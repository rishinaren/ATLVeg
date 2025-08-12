import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const body = await req.json();
  await prisma.feedback.create({ data: { userId: data.user?.id ?? null, message: String(body.message ?? "") } });
  return Response.json({ ok: true });
}

export async function HEAD() { return new Response("ok"); }
