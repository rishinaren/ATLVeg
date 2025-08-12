import { createSupabaseServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export default async function HistoryPage() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return <div>Please <a className="underline" href="/auth/login">log in</a> to view history.</div>;

  const items = await prisma.searchHistory.findMany({
    where: { userId: data.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Search history (7‑day)</h1>
      <ul className="space-y-2">
        {items.map(i => (
          <li key={i.id} className="card">
            <div className="text-sm opacity-80">{new Date(i.createdAt).toLocaleString()}</div>
            <div className="font-medium">{i.query}</div>
            <pre className="opacity-80 text-xs">{JSON.stringify(i.filters)}</pre>
          </li>
        ))}
      </ul>
    </div>
  );
}
