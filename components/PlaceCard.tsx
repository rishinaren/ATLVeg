import Link from "next/link";

export function PlaceCard({
  id,
  name,
  rating,
  priceLevel,
  distanceKm,
  vegScore,
  lat,
  lng,
  address,
  isFavorite,
}: {
  id: string; name: string; rating?: number; priceLevel?: number; distanceKm?: number; vegScore: number; lat:number; lng:number; address?: string; isFavorite?: boolean;
}) {
  const price = typeof priceLevel === 'number' ? '$'.repeat(priceLevel || 0) : '';
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  return (
    <div className="card flex flex-col gap-2">
      <div className="flex justify-between">
        <h3 className="text-lg font-semibold">{name}</h3>
        <span className="chip">VegScore {vegScore}</span>
      </div>
      <div className="text-sm opacity-80">{address ?? ''}</div>
      <div className="flex gap-3 text-sm">
        {rating !== undefined && <span>⭐ {rating.toFixed(1)}</span>}
        {price && <span>{price}</span>}
        {distanceKm !== undefined && <span>{distanceKm.toFixed(1)} km</span>}
      </div>
      <div className="flex gap-2">
        <a className="btn" href={directions} target="_blank" rel="noreferrer">Directions</a>
        <Link className="btn" href={`/place/${id}`}>Open</Link>
        {isFavorite && <span className="chip">Saved</span>}
      </div>
    </div>
  );
}
