import { createSupabaseServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { PlaceCard } from "@/components/PlaceCard";

export default async function FavoritesPage() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return <div>Please <a className="underline" href="/auth/login">log in</a> to see favorites.</div>;

  const me = await prisma.userProfile.findUnique({ where: { id: data.user.id } });
  if (!me) return <div>No profile found.</div>;

  const favs = await prisma.favorite.findMany({ where: { userId: me.id }, include: { place: true } });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Your favorites</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {favs.map(({ place }) => (
          <PlaceCard key={place.id}
            id={place.id}
            name={place.name}
            rating={place.rating ?? undefined}
            priceLevel={place.priceLevel ?? undefined}
            vegScore={place.vegScore}
            lat={place.lat} lng={place.lng}
            address={place.address ?? undefined}
            isFavorite
          />
        ))}
      </div>
    </div>
  );
}
