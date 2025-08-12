import { NextRequest } from "next/server";
import { z } from "zod";
import { googleNearby, googleTextSearch } from "@/lib/google";
import { fetchVegInAtlanta } from "@/lib/overpass";
import { fuse } from "@/lib/fuse";
import { haversineKm } from "@/lib/geo";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const Query = z.object({
  q: z.string().optional(),
  lat: z.coerce.number(),
  lng: z.coerce.number(),
  maxKm: z.coerce.number().default(20),
  minRating: z.coerce.number().min(0).max(5).default(0),
  price: z.string().optional(),
  cuisine: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const args = Query.parse(Object.fromEntries(searchParams));
  const center = { lat: args.lat, lng: args.lng };

  const [text, nearby, osm] = await Promise.all([
    googleTextSearch(args.q ?? "vegetarian OR vegan restaurant in Atlanta", center),
    googleNearby(center),
    fetchVegInAtlanta(),
  ]);

  let unified = fuse([...text, ...nearby], osm, center);

  // Apply filters
  unified = unified.filter(u => (u.rating ?? 0) >= args.minRating);
  if (args.price) unified = unified.filter(u => u.priceLevel === Number(args.price));
  if (args.cuisine) unified = unified.filter(u => u.cuisines.includes(args.cuisine!.toLowerCase()));

  // Compute distance for UI & trim
  const items = unified.map(u => ({ ...u, id: `${u.sourceIds.googlePlaceId ?? u.sourceIds.osmId ?? u.name}-${u.lat.toFixed(5)}`, distanceKm: haversineKm(center, u) })).slice(0, 30);

  // Persist search history if logged in
  try {
    const supabase = createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      await prisma.searchHistory.create({ data: { userId: data.user.id, query: args.q ?? "veg", filters: args } });
    }
  } catch {}

  return Response.json({ items });
}
