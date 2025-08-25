import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { placeId, placeName, placeAddress } = await request.json();
    
    const supabase = createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();
    
    if (!data.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    // First, ensure the place exists in our database
    const existingPlace = await prisma.place.findFirst({
      where: { googlePlaceId: placeId }
    });

    let place;
    if (!existingPlace) {
      // Create a basic place record if it doesn't exist
      place = await prisma.place.create({
        data: {
          googlePlaceId: placeId,
          name: placeName,
          address: placeAddress || '',
          lat: 0, // We'll update these later when we have more data
          lng: 0,
        }
      });
    } else {
      place = existingPlace;
    }

    // Record the click
    const click = await prisma.clickHistory.create({
      data: {
        userId: data.user.id,
        placeId: place.id,
        placeName,
        placeAddress: placeAddress || null,
      }
    });

    return NextResponse.json({ success: true, clickId: click.id });
  } catch (error) {
    console.error('Error recording click:', error);
    return NextResponse.json({ error: 'Failed to record click' }, { status: 500 });
  }
}
