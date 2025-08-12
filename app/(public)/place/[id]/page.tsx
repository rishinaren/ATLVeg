import { prisma } from "@/lib/prisma";

export default async function PlacePage({ params }: { params: { id: string } }) {
  const place = await prisma.place.findUnique({ where: { id: params.id } });
  if (!place) return <div>Not found</div>;
  const src = `https://www.google.com/maps/embed/v1/place?key=${process.env.GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(place.name)}&center=${place.lat},${place.lng}&zoom=15`;
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{place.name}</h1>
      <iframe width="100%" height="320" style={{ border: 0 }} loading="lazy" allowFullScreen src={src} />
      <div className="card">
        <div className="opacity-80">{place.address}</div>
        <div className="flex gap-3 text-sm mt-2">
          {place.rating !== null && <span>⭐ {place.rating?.toFixed(1)}</span>}
          {typeof place.priceLevel === 'number' && <span>{"$".repeat(place.priceLevel || 0)}</span>}
          <span>VegScore {place.vegScore}</span>
        </div>
      </div>
    </div>
  );
}
