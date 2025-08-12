const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

export type OSMElement = {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number; lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

export async function fetchVegInAtlanta() {
  // Atlanta administrative boundary (search by name; Overpass resolves)
  const q = `
  [out:json][timeout:25];
  area["boundary"="administrative"]["name"="Atlanta"]["admin_level"~"^8$"]->.atl;
  (
    nwr(area.atl)["amenity"~"^(restaurant|cafe|fast_food)$"]["diet:vegan"="yes"];
    nwr(area.atl)["amenity"~"^(restaurant|cafe|fast_food)$"]["diet:vegetarian"="yes"];
  );
  out center tags;`;

  const res = await fetch(OVERPASS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ data: q }).toString(),
    // cache: "no-store"
  });
  if (!res.ok) throw new Error("Overpass query failed");
  const data = await res.json();
  return (data.elements ?? []) as OSMElement[];
}
