import Link from "next/link";
import type { FullSymptom } from "@/lib/data";
import RedFlags from "@/components/RedFlags";
import Disclaimer from "@/components/Disclaimer";

export default function ResultCard({ symptom }: { symptom: FullSymptom }) {
  return (
    <article className="rounded-xl border border-neutral-200 bg-white p-6 space-y-5 shadow-sm">
      <div>
        <h2 className="text-2xl font-bold text-neutral-900">{symptom.name}</h2>
        <p className="text-neutral-700 mt-1">{symptom.explanation}</p>
      </div>

      <RedFlags text={symptom.red_flags} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div>
          <h3 className="font-semibold text-neutral-800 mb-1">Lifestyle factors</h3>
          <p className="text-neutral-600">{symptom.lifestyle_factors}</p>
        </div>
        <div>
          <h3 className="font-semibold text-neutral-800 mb-1">Nutritional factors</h3>
          <p className="text-neutral-600">{symptom.nutritional_factors}</p>
        </div>
        <div>
          <h3 className="font-semibold text-neutral-800 mb-1">Possible medical causes</h3>
          <p className="text-neutral-600">{symptom.medical_causes}</p>
        </div>
        <div>
          <h3 className="font-semibold text-neutral-800 mb-1">Next steps</h3>
          <p className="text-neutral-600">{symptom.professional_next_steps}</p>
        </div>
      </div>

      {symptom.nutrients.length > 0 && (
        <div>
          <h3 className="font-semibold text-neutral-800 mb-2">
            Related nutrients ({symptom.nutrients.length})
          </h3>
          <div className="space-y-3">
            {symptom.nutrients.map((n) => (
              <div key={n.id} className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                <Link
                  href={`/nutrients/${n.slug}`}
                  className="font-medium text-emerald-800 hover:underline"
                >
                  {n.name}
                </Link>
                {n.relevance_note && (
                  <p className="text-xs text-neutral-600 mt-0.5">{n.relevance_note}</p>
                )}
                {n.food_sources.length > 0 && (
                  <p className="text-xs text-neutral-600 mt-1">
                    Food sources:{" "}
                    {n.food_sources.map((f, i) => (
                      <span key={f.id}>
                        <Link href={`/foods/${f.slug}`} className="underline">
                          {f.name}
                        </Link>
                        {f.amount_per_serving ? ` (${f.amount_per_serving})` : ""}
                        {i < n.food_sources.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {symptom.supplements.length > 0 && (
        <div>
          <h3 className="font-semibold text-neutral-800 mb-2">
            Supplement categories ({symptom.supplements.length})
          </h3>
          <div className="space-y-3">
            {symptom.supplements.map((s) => (
              <div key={s.id} className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                <Link
                  href={`/supplements/${s.slug}`}
                  className="font-medium text-amber-800 hover:underline"
                >
                  {s.name}
                </Link>
                {s.relevance_note && (
                  <p className="text-xs text-neutral-600 mt-0.5">{s.relevance_note}</p>
                )}
                <p className="text-xs text-neutral-600 mt-1">
                  <strong>Cautions:</strong> {s.cautions}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <Disclaimer />
    </article>
  );
}
