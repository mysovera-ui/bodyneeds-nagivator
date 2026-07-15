import Link from "next/link";
import { listSupplementCategories } from "@/lib/data";

export default async function SupplementsIndex() {
  const supplements = await listSupplementCategories();

  return (
    <main className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold text-neutral-900">All Supplement Categories</h1>

      {supplements.length === 0 ? (
        <p className="text-neutral-500">No supplement categories found yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {supplements.map((s) => (
            <Link
              key={s.id}
              href={`/supplements/${s.slug}`}
              className="rounded-lg border border-neutral-200 bg-white p-4 hover:border-emerald-400 hover:shadow-sm transition-shadow"
            >
              <h2 className="font-semibold text-neutral-900">{s.name}</h2>
              <p className="text-sm text-neutral-500 line-clamp-2 mt-1">{s.purpose}</p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
