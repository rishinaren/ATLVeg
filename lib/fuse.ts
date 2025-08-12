import { haversineKm } from "./geo";
import type { PlaceLite } from "./google";
import type { OSMElement } from "./overpass";

export type Unified = {
  name: string;
  address?: string;
  lat: number; lng: number;
  rating?: number; userRatings?: number; priceLevel?: number;
  sourceIds: { googlePlaceId?: string; osmId?: string };
  vegScore: number;
  cuisines: string[];
};

function cuisineGuess(name: string): string[] {
  const n = name.toLowerCase();
  if (/(india|indian|biryani|curry)/.test(n)) return ["indian"];
  if (/(thai)/.test(n)) return ["thai"];
  if (/(ethiopia|ethiopian)/.test(n)) return ["ethiopian"];
  if (/(mediterranean|greek|lebanese|turkish)/.test(n)) return ["mediterranean"];
  if (/(falafel|hummus)/.test(n)) return ["mediterranean"];
  return [];
}

function scoreVeg({ name, tags }: { name?: string; tags?: Record<string,string> }) {
  let score = 0;
  if (tags?.["diet:vegan"] === "yes") score += 4;
  if (tags?.["diet:vegetarian"] === "yes") score += 3;
  const n = (name ?? "").toLowerCase();
  if (/vegan/.test(n)) score += 2;
  if (/vegetarian/.test(n)) score += 1;
  return Math.min(5, score);
}

export function fuse(
  google: PlaceLite[],
  osm: OSMElement[],
  center: { lat:number, lng:number },
) : Unified[] {
  const g = google.map(p => ({
    name: p.displayName?.text ?? "",
    address: p.formattedAddress,
    lat: p.location?.latitude ?? 0,
    lng: p.location?.longitude ?? 0,
    rating: p.rating,
    userRatings: p.userRatingCount,
    priceLevel: p.priceLevel,
    sourceIds: { googlePlaceId: p.id },
    vegScore: scoreVeg({ name: p.displayName?.text }),
    cuisines: cuisineGuess(p.displayName?.text ?? ""),
  })).filter(x => x.name && x.lat && x.lng);

  const o = osm.map(e => ({
    name: e.tags?.name ?? "",
    address: e.tags?.["addr:full"],
    lat: e.center?.lat ?? e.lat!,
    lng: e.center?.lon ?? e.lon!,
    rating: undefined,
    userRatings: undefined,
    priceLevel: undefined,
    sourceIds: { osmId: String(e.id) },
    vegScore: scoreVeg({ name: e.tags?.name, tags: e.tags }),
    cuisines: cuisineGuess(e.tags?.name ?? ""),
  })).filter(x => x.name && x.lat && x.lng);

  const all = [...g, ...o];

  // Deduplicate by name+proximity (<= 0.1 km)
  const result: Unified[] = [];
  for (const item of all) {
    const dup = result.find(r => r.name.toLowerCase() === item.name.toLowerCase() && haversineKm(r, item) <= 0.1);
    if (!dup) result.push(item);
    else {
      // Merge: prefer rating/price from Google; keep higher vegScore
      dup.rating ??= item.rating;
      dup.userRatings ??= item.userRatings;
      dup.priceLevel ??= item.priceLevel;
      dup.vegScore = Math.max(dup.vegScore, item.vegScore);
      dup.sourceIds = { ...dup.sourceIds, ...item.sourceIds };
      dup.cuisines = Array.from(new Set([...dup.cuisines, ...item.cuisines]));
    }
  }

  // sort default: rating desc -> distance asc -> vegScore desc
  return result.sort((a, b) => {
    const r = (b.rating ?? 0) - (a.rating ?? 0);
    if (r !== 0) return r;
    const da = haversineKm(center, a); const db = haversineKm(center, b);
    if (da !== db) return da - db;
    return b.vegScore - a.vegScore;
  });
}
