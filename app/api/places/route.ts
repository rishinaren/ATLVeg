import { googleTextSearch } from "@/lib/google";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");

    if (!query) {
      return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 });
    }

    const center = lat && lng ? { lat: parseFloat(lat), lng: parseFloat(lng) } : undefined;
    const places = await googleTextSearch(query, center);

    return NextResponse.json({ places });
  } catch (error) {
    console.error("Google Places API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch places from Google" },
      { status: 500 }
    );
  }
}
