import { createSupabaseServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export default async function HistoryPage() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return <div>Please <a className="underline" href="/auth/login">log in</a> to view history.</div>;

  let items = [];
  try {
    items = await prisma.clickHistory.findMany({
      where: { userId: data.user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  } catch (error) {
    console.error("Failed to load click history:", error);
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Restaurant History</h1>
        <div className="text-center py-8">
          <div className="text-4xl mb-4">📱</div>
          <p className="text-gray-600 dark:text-gray-400">
            Unable to load history. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Restaurant History</h1>
      {items.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🍽️</div>
          <p className="text-gray-600 dark:text-gray-400">
            No restaurants visited yet. Start exploring to see your history here!
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map(i => (
            <li key={i.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium">{i.placeName}</div>
                  {i.placeAddress && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">{i.placeAddress}</div>
                  )}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-500 ml-4">
                  {new Date(i.createdAt).toLocaleDateString()}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
