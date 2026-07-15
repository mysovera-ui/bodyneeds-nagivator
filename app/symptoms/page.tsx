import Link from "next/link";
import { listSymptoms } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function SymptomsIndex() {
  const symptoms = await listSymptoms();

  return (
    <main className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold text-neutral-900">All Symptoms</h1>

      {symptoms.length === 0 ? (
        <p className="text-neutral-500">No symptoms found yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {symptoms.map((s) => (
            <Link
              key={s.id}
              href={`/symptoms/${s.slug}`}
              className="rounded-lg border border-neutral-200 bg-white p-4 hover:border-emerald-400 hover:shadow-sm transition-shadow"
            >
              <h2 className="font-semibold text-neutral-900">{s.name}</h2>
              <p className="text-sm text-neutral-500 line-clamp-2 mt-1">
                {s.explanation}
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
