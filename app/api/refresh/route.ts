import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic"; // allow on Vercel cron

export async function GET(req: NextRequest) {
  // 1) Prune history older than 7 days
  const cutoff = new Date(Date.now() - 7*24*60*60*1000);
  await prisma.searchHistory.deleteMany({ where: { createdAt: { lt: cutoff } } });

  // 2) (Optional) Rehydrate Google fields for popular places (respect provider caching rules)
  // Left as an exercise; keep this minimal for MVP.

  return Response.json({ ok: true });
}
