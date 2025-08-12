"use client";
import { useEffect, useState } from "react";
import { Filters, FiltersBar } from "@/components/Filters";
import { PlaceCard } from "@/components/PlaceCard";

export default function SearchPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function doSearch(f: Filters, coords: GeolocationCoordinates) {
    setLoading(true);
    const params = new URLSearchParams({
      lat: String(coords.latitude),
      lng: String(coords.longitude),
      maxKm: String(f.maxKm),
      minRating: String(f.minRating),
    });
    if (f.price) params.set("price", f.price);
    if (f.cuisine) params.set("cuisine", f.cuisine);

    const res = await fetch(`/api/search?${params.toString()}`);
    const data = await res.json();
    setItems(data.items ?? []);
    setLoading(false);
  }

  function onApply(f: Filters) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => doSearch(f, pos.coords));
    } else {
      alert("Location not available. Enable geolocation to search nearby.");
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Search</h1>
      <FiltersBar onApply={onApply} />
      {loading && <div>Loading…</div>}
      <div className="grid md:grid-cols-2 gap-4">
        {items.map((p: any) => (
          <PlaceCard key={p.id}
            id={p.id}
            name={p.name}
            rating={p.rating}
            priceLevel={p.priceLevel}
            vegScore={p.vegScore}
            lat={p.lat} lng={p.lng}
            address={p.address}
            distanceKm={p.distanceKm}
          />
        ))}
      </div>
    </div>
  );
}
