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
  photos?: Array<{
    name: string;
    widthPx: number;
    heightPx: number;
    authorAttributions?: Array<{
      displayName: string;
      uri: string;
      photoUri: string;
    }>;
  }>;
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
        "places.photos",
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
        "places.photos",
      ]),
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Google Nearby failed");
  const data = await res.json();
  return (data.places ?? []) as PlaceLite[];
}

export type { PlaceLite };

// Function to get photo URL from photo reference
export function getPhotoUrl(photoName: string, maxWidth: number = 400): string {
  // The photo name comes in format: places/{place_id}/photos/{photo_id}
  // We need to call the Photos API to get the actual image
  return `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=${maxWidth}&key=${process.env.GOOGLE_PLACES_API_KEY}`;
}
