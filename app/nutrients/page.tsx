import Link from "next/link";
import { listNutrients } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function NutrientsIndex() {
  const nutrients = await listNutrients();

  return (
    <main className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold text-neutral-900">All Nutrients</h1>

      {nutrients.length === 0 ? (
        <p className="text-neutral-500">No nutrients found yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {nutrients.map((n) => (
            <Link
              key={n.id}
              href={`/nutrients/${n.slug}`}
              className="rounded-lg border border-neutral-200 bg-white p-4 hover:border-emerald-400 hover:shadow-sm transition-shadow"
            >
              <h2 className="font-semibold text-neutral-900">{n.name}</h2>
              <p className="text-sm text-neutral-500 line-clamp-2 mt-1">
                {n.body_function}
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
