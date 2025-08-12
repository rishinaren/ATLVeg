import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return new Response("Unauthorized", { status: 401 });

  const body = await req.json().catch(() => ({} as any));
  if (body.bootstrapProfile) {
    // Ensure a profile exists after signup
    await prisma.userProfile.upsert({ where: { id: data.user.id }, update: { email: data.user.email ?? "" }, create: { id: data.user.id, email: data.user.email ?? "" } });
    return Response.json({ ok: true });
  }

  const { placeId } = body as { placeId: string };
  if (!placeId) return new Response("Bad Request", { status: 400 });
  await prisma.favorite.upsert({ where: { userId_placeId: { userId: data.user.id, placeId } }, update: {}, create: { userId: data.user.id, placeId } });
  return Response.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return new Response("Unauthorized", { status: 401 });

  const { searchParams } = new URL(req.url);
  const placeId = searchParams.get("placeId");
  if (!placeId) return new Response("Bad Request", { status: 400 });
  await prisma.favorite.delete({ where: { userId_placeId: { userId: data.user.id, placeId } } });
  return Response.json({ ok: true });
}
