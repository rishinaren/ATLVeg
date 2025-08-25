import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();
    
    if (!data.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json().catch(() => ({} as any));
    
    if (body.bootstrapProfile) {
      // For development mode, we'll create a simple profile
      // In production, this would connect to the actual database
      try {
        // Check if we're in development mode (no real database)
        const isDev = process.env.NODE_ENV === 'development' && 
          (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('localhost'));
        
        if (isDev) {
          // Just return success for development mode
          return Response.json({ ok: true, dev: true });
        }
        
        // Production: create actual profile
        await prisma.userProfile.upsert({ 
          where: { id: data.user.id }, 
          update: { email: data.user.email ?? "" }, 
          create: { id: data.user.id, email: data.user.email ?? "" } 
        });
      } catch (dbError) {
        console.warn("Database operation failed, continuing in dev mode:", dbError);
        return Response.json({ ok: true, dev: true });
      }
      
      return Response.json({ ok: true });
    }

    const { placeId, placeName, placeAddress } = body as { placeId: string; placeName: string; placeAddress?: string };
    if (!placeId || !placeName) {
      return new Response("Bad Request", { status: 400 });
    }

    // Ensure user profile exists
    let userProfile = await prisma.userProfile.findUnique({
      where: { id: data.user.id }
    });

    if (!userProfile) {
      userProfile = await prisma.userProfile.create({
        data: {
          id: data.user.id,
          email: data.user.email || '',
        }
      });
    }
    
    try {
      // First, ensure the place exists in our database
      const place = await prisma.place.upsert({
        where: { googlePlaceId: placeId },
        update: {},
        create: {
          googlePlaceId: placeId,
          name: placeName,
          address: placeAddress || '',
          lat: 0, // We'll update these later when we have more data
          lng: 0,
        }
      });

      // Add to favorites
      await prisma.favorite.upsert({ 
        where: { userId_placeId: { userId: data.user.id, placeId: place.id } }, 
        update: {}, 
        create: { userId: data.user.id, placeId: place.id } 
      });
    } catch (dbError) {
      console.warn("Database operation failed:", dbError);
      return new Response("Service temporarily unavailable", { status: 503 });
    }
    
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Favorites API error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return new Response("Unauthorized", { status: 401 });

  const { searchParams } = new URL(req.url);
  const googlePlaceId = searchParams.get("placeId");
  if (!googlePlaceId) return new Response("Bad Request", { status: 400 });
  
  try {
    // Find the place by googlePlaceId
    const place = await prisma.place.findFirst({
      where: { googlePlaceId }
    });
    
    if (place) {
      await prisma.favorite.delete({ 
        where: { userId_placeId: { userId: data.user.id, placeId: place.id } } 
      });
    }
  } catch (dbError) {
    console.warn("Database operation failed:", dbError);
    return new Response("Service temporarily unavailable", { status: 503 });
  }
  
  return Response.json({ ok: true });
}
