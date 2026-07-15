import { notFound } from "next/navigation";
import Link from "next/link";
import { getFoodSourceBySlug } from "@/lib/data";
import Disclaimer from "@/components/Disclaimer";

export default async function FoodDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const food = await getFoodSourceBySlug(slug);
  if (!food) notFound();

  return (
    <main className="max-w-2xl mx-auto px-4 py-10 space-y-4">
      <Link href="/foods" className="text-sm text-emerald-700 hover:underline">
        ← All foods
      </Link>
      <article className="rounded-xl border border-neutral-200 bg-white p-6 space-y-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-neutral-900">{food.name}</h1>
          <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-800">
            {food.dietary_category}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <h2 className="font-semibold text-neutral-800 mb-1">Serving size</h2>
            <p className="text-neutral-600">{food.serving_size}</p>
          </div>
          <div>
            <h2 className="font-semibold text-neutral-800 mb-1">Allergens</h2>
            <p className="text-neutral-600">{food.allergens || "None listed"}</p>
          </div>
          <div>
            <h2 className="font-semibold text-neutral-800 mb-1">Availability</h2>
            <p className="text-neutral-600">{food.availability || "—"}</p>
          </div>
          <div>
            <h2 className="font-semibold text-neutral-800 mb-1">Dietary patterns</h2>
            <p className="text-neutral-600">{food.dietary_patterns || "—"}</p>
          </div>
        </div>

        {food.nutrients.length > 0 && (
          <div>
            <h2 className="font-semibold text-neutral-800 mb-2">Key nutrients</h2>
            <ul className="space-y-1 text-sm">
              {food.nutrients.map((n) => (
                <li key={n.id}>
                  <Link href={`/nutrients/${n.slug}`} className="text-emerald-700 hover:underline">
                    {n.name}
                  </Link>
                  {n.amount_per_serving ? ` — ${n.amount_per_serving}` : ""}
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
