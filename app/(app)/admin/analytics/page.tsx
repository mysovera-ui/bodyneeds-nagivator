import Link from "next/link";
import { getSearchStats, getTopSearchedSymptoms, getTopSearchTerms } from "@/lib/analytics";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const [stats, topSymptoms, topTerms] = await Promise.all([
    getSearchStats(),
    getTopSearchedSymptoms(10),
    getTopSearchTerms(10),
  ]);

  const maxSymptomCount = Math.max(1, ...topSymptoms.map((s) => s.count));
  const maxTermCount = Math.max(1, ...topTerms.map((t) => t.count));

  return (
    <main className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <div>
        <Link href="/admin" className="text-sm text-emerald-700 hover:underline touch-manipulation">
          ← Admin
        </Link>
        <h1 className="text-2xl font-bold text-neutral-900 mt-1">Analytics</h1>
        <p className="text-sm text-neutral-500 mt-1">
          What people are searching for on BodyNeeds Navigator.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Last 7 days" value={stats.total7d} />
        <StatCard label="Last 30 days" value={stats.total30d} />
        <StatCard label="All time" value={stats.totalAllTime} />
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-neutral-900">Most-searched symptoms</h2>
        {topSymptoms.length === 0 ? (
          <p className="text-sm text-neutral-500">No search data yet.</p>
        ) : (
          <div className="space-y-2">
            {topSymptoms.map((s, i) => (
              <div key={s.id} className="flex items-center gap-3">
                <span className="text-xs text-neutral-400 w-4 shrink-0">{i + 1}</span>
                <Link
                  href={`/symptoms/${s.slug}`}
                  className="text-sm text-neutral-800 hover:underline w-40 sm:w-56 shrink-0 truncate"
                >
                  {s.name}
                </Link>
                <div className="flex-1 h-4 bg-neutral-100 rounded overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded"
                    style={{ width: `${(s.count / maxSymptomCount) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-neutral-500 w-6 text-right shrink-0">{s.count}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-neutral-900">Top search terms</h2>
        <p className="text-xs text-neutral-400">
          Includes terms that returned no results — useful for spotting content gaps.
        </p>
        {topTerms.length === 0 ? (
          <p className="text-sm text-neutral-500">No search data yet.</p>
        ) : (
          <div className="space-y-2">
            {topTerms.map((t, i) => (
              <div key={t.term} className="flex items-center gap-3">
                <span className="text-xs text-neutral-400 w-4 shrink-0">{i + 1}</span>
                <span className="text-sm text-neutral-800 w-40 sm:w-56 shrink-0 truncate">{t.term}</span>
                <div className="flex-1 h-4 bg-neutral-100 rounded overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded"
                    style={{ width: `${(t.count / maxTermCount) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-neutral-500 w-6 text-right shrink-0">{t.count}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4 text-center">
      <p className="text-2xl font-bold text-neutral-900">{value}</p>
      <p className="text-xs text-neutral-500 mt-1">{label}</p>
    </div>
  );
}
