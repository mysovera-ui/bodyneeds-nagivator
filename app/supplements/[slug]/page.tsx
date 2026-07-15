import { notFound } from "next/navigation";
import Link from "next/link";
import { getSupplementCategoryBySlug } from "@/lib/data";
import Disclaimer from "@/components/Disclaimer";

export default async function SupplementDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supplement = await getSupplementCategoryBySlug(slug);
  if (!supplement) notFound();

  return (
    <main className="max-w-2xl mx-auto px-4 py-10 space-y-4">
      <Link href="/supplements" className="text-sm text-emerald-700 hover:underline touch-manipulation inline-block py-1">
        ← All supplements
      </Link>
      <article className="rounded-xl border border-neutral-200 bg-white p-6 space-y-5 shadow-sm">
        <h1 className="text-2xl font-bold text-neutral-900">{supplement.name}</h1>
        <p className="text-neutral-700">{supplement.purpose}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <h2 className="font-semibold text-neutral-800 mb-1">Forms</h2>
            <p className="text-neutral-600">{supplement.forms}</p>
          </div>
          <div>
            <h2 className="font-semibold text-neutral-800 mb-1">Advantages</h2>
            <p className="text-neutral-600">{supplement.advantages}</p>
          </div>
          <div>
            <h2 className="font-semibold text-neutral-800 mb-1">Disadvantages</h2>
            <p className="text-neutral-600">{supplement.disadvantages}</p>
          </div>
          <div>
            <h2 className="font-semibold text-neutral-800 mb-1">Side effects</h2>
            <p className="text-neutral-600">{supplement.side_effects}</p>
          </div>
          <div>
            <h2 className="font-semibold text-neutral-800 mb-1">Interactions</h2>
            <p className="text-neutral-600">{supplement.interactions}</p>
          </div>
          <div>
            <h2 className="font-semibold text-neutral-800 mb-1">At-risk groups</h2>
            <p className="text-neutral-600">{supplement.at_risk_groups}</p>
          </div>
        </div>

        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4">
          <h2 className="font-semibold text-amber-800 text-sm mb-1">Cautions</h2>
          <p className="text-amber-800 text-sm">{supplement.cautions}</p>
        </div>

        {supplement.related_symptoms.length > 0 && (
          <div>
            <h2 className="font-semibold text-neutral-800 mb-2">Related symptoms</h2>
            <ul className="space-y-1 text-sm">
              {supplement.related_symptoms.map((s) => (
                <li key={s.id}>
                  <Link href={`/symptoms/${s.slug}`} className="text-emerald-700 hover:underline">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Disclaimer />
      </article>
    </main>
  );
}
