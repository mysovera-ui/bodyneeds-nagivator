import { notFound } from "next/navigation";
import Link from "next/link";
import { getNutrientBySlug } from "@/lib/data";
import Disclaimer from "@/components/Disclaimer";
import ShareLinkBar from "@/components/ShareLinkBar";

export default async function NutrientDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const nutrient = await getNutrientBySlug(slug);
  if (!nutrient) notFound();

  return (
    <main className="max-w-2xl mx-auto px-4 py-10 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <Link href="/nutrients" className="text-sm text-emerald-700 hover:underline touch-manipulation inline-block py-1">
          ← All nutrients
        </Link>
        <ShareLinkBar type="nutrients" itemSlug={slug} />
      </div>
      <article className="rounded-xl border border-neutral-200 bg-white p-6 space-y-5 shadow-sm">
        <h1 className="text-2xl font-bold text-neutral-900">{nutrient.name}</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <h2 className="font-semibold text-neutral-800 mb-1">Body function</h2>
            <p className="text-neutral-600">{nutrient.body_function}</p>
          </div>
          <div>
            <h2 className="font-semibold text-neutral-800 mb-1">Daily requirement</h2>
            <p className="text-neutral-600">{nutrient.daily_requirement}</p>
          </div>
          <div>
            <h2 className="font-semibold text-neutral-800 mb-1">Deficiency signs</h2>
            <p className="text-neutral-600">{nutrient.deficiency_signs}</p>
          </div>
          <div>
            <h2 className="font-semibold text-neutral-800 mb-1">Excess risks</h2>
            <p className="text-neutral-600">{nutrient.excess_risks}</p>
          </div>
          <div>
            <h2 className="font-semibold text-neutral-800 mb-1">At-risk groups</h2>
            <p className="text-neutral-600">{nutrient.at_risk_groups}</p>
          </div>
          <div>
            <h2 className="font-semibold text-neutral-800 mb-1">Supplement forms</h2>
            <p className="text-neutral-600">{nutrient.supplement_forms}</p>
          </div>
        </div>

        {nutrient.food_sources.length > 0 && (
          <div>
            <h2 className="font-semibold text-neutral-800 mb-2">Food sources</h2>
            <ul className="space-y-1 text-sm">
              {nutrient.food_sources.map((f) => (
                <li key={f.id}>
                  <Link href={`/foods/${f.slug}`} className="text-emerald-700 hover:underline">
                    {f.name}
                  </Link>
                  {f.amount_per_serving ? ` — ${f.amount_per_serving}` : ""}
                </li>
              ))}
            </ul>
          </div>
        )}

        {nutrient.related_symptoms.length > 0 && (
          <div>
            <h2 className="font-semibold text-neutral-800 mb-2">Related symptoms</h2>
            <ul className="space-y-1 text-sm">
              {nutrient.related_symptoms.map((s) => (
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
