import { prisma } from "@/lib/prisma";
import { PlaceCard } from "@/components/PlaceCard";

export default async function Page() {
  // Simple, server-rendered: top-rated saved places as a demo (or fallback to latest)
  const places = await prisma.place.findMany({
    orderBy: [{ rating: "desc" }, { vegScore: "desc" }],
    take: 10,
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Recommended veg‑friendly spots</h1>
      <p className="opacity-80">A simple feed of highly‑rated veg/vegan‑friendly places around Atlanta.</p>
      <div className="grid md:grid-cols-2 gap-4">
        {places.map(p => (
          <PlaceCard key={p.id}
            id={p.id}
            name={p.name}
            rating={p.rating ?? undefined}
            priceLevel={p.priceLevel ?? undefined}
            vegScore={p.vegScore}
            lat={p.lat} lng={p.lng}
            address={p.address ?? undefined}
          />
        ))}
      </div>
    </div>
  );
}
