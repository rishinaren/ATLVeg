import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const photoName = searchParams.get("name");
    const maxWidth = searchParams.get("maxWidth") || "400";

    if (!photoName) {
      return NextResponse.json({ error: "Photo name is required" }, { status: 400 });
    }

    // Fetch the actual photo from Google Places Photos API
    const photoUrl = `https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=${maxWidth}&key=${process.env.GOOGLE_PLACES_API_KEY}`;
    
    const response = await fetch(photoUrl);
    
    if (!response.ok) {
      throw new Error("Failed to fetch photo");
    }

    // Get the image buffer
    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/jpeg";

    // Return the image with appropriate headers
    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400", // Cache for 1 day
      },
    });
  } catch (error) {
    console.error("Photo API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch photo" },
      { status: 500 }
    );
  }
}
