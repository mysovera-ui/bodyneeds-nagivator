import Link from "next/link";
import type { FoodSourceDetail } from "@/lib/data";

export default function FoodResultCard({ food }: { food: FoodSourceDetail }) {
  return (
    <article className="rounded-xl border border-neutral-200 bg-white p-6 space-y-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-emerald-700 uppercase tracking-wide mb-1">
            Food source
          </p>
          <Link
            href={`/foods/${food.slug}`}
            className="text-xl font-bold text-neutral-900 hover:underline touch-manipulation"
          >
            {food.name}
          </Link>
          <p className="text-neutral-700 mt-1 text-sm">{food.serving_size}</p>
        </div>
        <span className="shrink-0 text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-800">
          {food.dietary_category}
        </span>
      </div>

      {food.allergens && (
        <p className="text-sm text-neutral-600">
          <strong>Allergens:</strong> {food.allergens}
        </p>
      )}

      {food.nutrients.length > 0 && (
        <div>
          <h3 className="font-semibold text-neutral-800 mb-1 text-sm">Key nutrients</h3>
          <p className="text-sm text-neutral-600">
            {food.nutrients.map((n, i) => (
              <span key={n.id}>
                <Link href={`/nutrients/${n.slug}`} className="text-emerald-700 underline touch-manipulation">
                  {n.name}
                </Link>
                {n.amount_per_serving ? ` (${n.amount_per_serving})` : ""}
                {i < food.nutrients.length - 1 ? ", " : ""}
              </span>
            ))}
          </p>
        </div>
      )}
    </article>
  );
}
