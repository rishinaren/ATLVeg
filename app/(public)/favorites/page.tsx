import { createSupabaseServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { PlaceCard } from "@/components/PlaceCard";
import { calculateVegScore } from "@/lib/vegScore";

export default async function FavoritesPage() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return <div>Please <a className="underline" href="/auth/login">log in</a> to see favorites.</div>;

  try {
    // Check if database is available
    const me = await prisma.userProfile.findUnique({ where: { id: data.user.id } });
    if (!me) return <div>No profile found.</div>;

    const favs = await prisma.favorite.findMany({ where: { userId: me.id }, include: { place: true } });
    
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Your favorites</h1>
        {favs.length === 0 ? (
          <div className="text-gray-600">No favorites yet. Start by searching for places and adding them to favorites!</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {favs.map(({ place }) => {
              const { label: vegLabel } = calculateVegScore({ name: place.name });
              return (
                <PlaceCard key={place.id}
                  id={place.id}
                  name={place.name}
                  rating={place.rating ?? undefined}
                  priceLevel={place.priceLevel ?? undefined}
                  vegLabel={vegLabel}
                  lat={place.lat} lng={place.lng}
                  address={place.address ?? undefined}
                  isFavorite
                />
              );
            })}
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Database connection error:", error);
    
    // Check if it's a database connection error
    const isDbError = error instanceof Error && 
      (error.message.includes("Can't reach database server") || 
       error.message.includes("ECONNREFUSED") ||
       error.message.includes("connect ECONNREFUSED"));
    
    if (isDbError) {
      return (
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Your favorites</h1>
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <h3 className="text-lg font-medium text-yellow-800">Database Not Available</h3>
            <p className="text-yellow-700 mt-1">
              The database is not currently running. In development mode, favorites are stored in your browser's local storage instead.
            </p>
            <p className="text-yellow-700 mt-2">
              To set up a local database, the developer needs to run a PostgreSQL instance.
            </p>
          </div>
        </div>
      );
    }
    
    // For other errors, show a generic message
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Your favorites</h1>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-700">
            There was an error loading your favorites. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}
