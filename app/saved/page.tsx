import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { deleteSavedSearch } from "@/lib/saved-searches-actions";

export const dynamic = "force-dynamic";

export default async function SavedSearchesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/saved");

  const { data, error } = await supabase
    .from("saved_searches")
    .select("id, query, created_at")
    .order("created_at", { ascending: false });

  const rows = data ?? [];

  return (
    <main className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold text-neutral-900">Saved Searches</h1>

      {error && (
        <p className="text-sm text-red-700">
          Could not load saved searches: {error.message}
        </p>
      )}

      {rows.length === 0 && !error ? (
        <p className="text-neutral-500">
          No saved searches yet. Search for a symptom, nutrient, or food and tap
          &ldquo;Save this search&rdquo; to keep it here.
        </p>
      ) : (
        <div className="divide-y divide-neutral-200 border border-neutral-200 rounded-lg bg-white">
          {rows.map((row) => (
            <div key={row.id} className="p-4 flex items-center justify-between gap-3">
              <Link
                href={`/?q=${encodeURIComponent(row.query)}`}
                className="font-medium text-emerald-700 hover:underline touch-manipulation"
              >
                {row.query}
              </Link>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-neutral-400">
                  {new Date(row.created_at as string).toLocaleDateString()}
                </span>
                <form action={deleteSavedSearch}>
                  <input type="hidden" name="id" value={row.id} />
                  <button
                    type="submit"
                    className="text-sm text-red-600 hover:underline touch-manipulation"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
