import Link from "next/link";
import type { NutrientDetail } from "@/lib/data";

export default function NutrientResultCard({ nutrient }: { nutrient: NutrientDetail }) {
  return (
    <article className="rounded-xl border border-neutral-200 bg-white p-6 space-y-4 shadow-sm">
      <div>
        <p className="text-xs font-medium text-emerald-700 uppercase tracking-wide mb-1">
          Nutrient
        </p>
        <Link
          href={`/nutrients/${nutrient.slug}`}
          className="text-xl font-bold text-neutral-900 hover:underline touch-manipulation"
        >
          {nutrient.name}
        </Link>
        <p className="text-neutral-700 mt-1 text-sm">{nutrient.body_function}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div>
          <h3 className="font-semibold text-neutral-800 mb-1">Daily requirement</h3>
          <p className="text-neutral-600">{nutrient.daily_requirement}</p>
        </div>
        <div>
          <h3 className="font-semibold text-neutral-800 mb-1">Deficiency signs</h3>
          <p className="text-neutral-600">{nutrient.deficiency_signs}</p>
        </div>
      </div>

      {nutrient.food_sources.length > 0 && (
        <div>
          <h3 className="font-semibold text-neutral-800 mb-1 text-sm">Food sources</h3>
          <p className="text-sm text-neutral-600">
            {nutrient.food_sources.map((f, i) => (
              <span key={f.id}>
                <Link href={`/foods/${f.slug}`} className="text-emerald-700 underline touch-manipulation">
                  {f.name}
                </Link>
                {f.amount_per_serving ? ` (${f.amount_per_serving})` : ""}
                {i < nutrient.food_sources.length - 1 ? ", " : ""}
              </span>
            ))}
          </p>
        </div>
      )}

      {nutrient.related_symptoms.length > 0 && (
        <div>
          <h3 className="font-semibold text-neutral-800 mb-1 text-sm">Related symptoms</h3>
          <p className="text-sm text-neutral-600">
            {nutrient.related_symptoms.map((s, i) => (
              <span key={s.id}>
                <Link href={`/symptoms/${s.slug}`} className="text-emerald-700 underline touch-manipulation">
                  {s.name}
                </Link>
                {i < nutrient.related_symptoms.length - 1 ? ", " : ""}
              </span>
            ))}
          </p>
        </div>
      )}
    </article>
  );
}
