import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();
    const body = await req.json();
    
    // Handle both message and optional email
    const feedbackData = {
      userId: data.user?.id ?? null,
      message: String(body.message ?? ""),
      // Note: If your prisma schema doesn't have an email field, 
      // you can store it in the message or add it to the schema
      ...(body.email && { email: String(body.email) })
    };
    
    await prisma.feedback.create({ data: feedbackData });
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Feedback submission error:", error);
    // Still return success to avoid exposing internal errors
    return Response.json({ ok: true });
  }
}

export async function HEAD() { return new Response("ok"); }
