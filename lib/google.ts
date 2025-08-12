const PLACES_TEXT_URL = "https://places.googleapis.com/v1/places:searchText";
const PLACES_NEARBY_URL = "https://places.googleapis.com/v1/places:searchNearby";

type PlaceLite = {
  id?: string;
  displayName?: { text: string };
  formattedAddress?: string;
  rating?: number;
  userRatingCount?: number;
  priceLevel?: number; // 0-4
  types?: string[];
  location?: { latitude: number; longitude: number };
};

function fieldMask(fields: string[]) {
  return fields.join(",");
}

export async function googleTextSearch(query: string, center?: {lat:number,lng:number}) {
  const body: any = {
    textQuery: query,
    pageSize: 20,
    languageCode: "en",
    regionCode: "US",
  };
  if (center) body.locationBias = { circle: { center: { latitude: center.lat, longitude: center.lng }, radius: 20000 } };

  const res = await fetch(PLACES_TEXT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": process.env.GOOGLE_PLACES_API_KEY!,
      "X-Goog-FieldMask": fieldMask([
        "places.id",
        "places.displayName",
        "places.formattedAddress",
        "places.rating",
        "places.userRatingCount",
        "places.priceLevel",
        "places.types",
        "places.location",
      ]),
    },
    body: JSON.stringify(body),
    // cache: "no-store" // allow fresh
  });
  if (!res.ok) throw new Error("Google Text Search failed");
  const data = await res.json();
  return (data.places ?? []) as PlaceLite[];
}

export async function googleNearby({lat,lng}:{lat:number,lng:number}) {
  const body = {
    includedTypes: ["restaurant", "cafe"],
    maxResultCount: 20,
    locationRestriction: { circle: { center: { latitude: lat, longitude: lng }, radius: 20000 } },
    languageCode: "en",
  };
  const res = await fetch(PLACES_NEARBY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": process.env.GOOGLE_PLACES_API_KEY!,
      "X-Goog-FieldMask": fieldMask([
        "places.id",
        "places.displayName",
        "places.formattedAddress",
        "places.rating",
        "places.userRatingCount",
        "places.priceLevel",
        "places.types",
        "places.location",
      ]),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Google Nearby failed");
  const data = await res.json();
  return (data.places ?? []) as PlaceLite[];
}

export type { PlaceLite };
