import Link from "next/link";
import { listFoodSources } from "@/lib/data";

const CATEGORIES = ["vegan", "vegetarian", "omnivore"];

export default async function FoodsIndex({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; excludeAllergen?: string }>;
}) {
  const { category, excludeAllergen } = await searchParams;
  const foods = await listFoodSources({ category, excludeAllergen });

  return (
    <main className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold text-neutral-900">All Food Sources</h1>

      <form className="flex flex-wrap gap-3 items-end text-sm">
        <div>
          <label className="block text-neutral-600 mb-1">Dietary category</label>
          <select
            name="category"
            defaultValue={category ?? ""}
            className="rounded-lg border border-neutral-300 px-3 py-2"
          >
            <option value="">All</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-neutral-600 mb-1">Exclude allergen</label>
          <input
            type="text"
            name="excludeAllergen"
            defaultValue={excludeAllergen ?? ""}
            placeholder="e.g. fish"
            className="rounded-lg border border-neutral-300 px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-emerald-700 text-white px-4 py-2 font-medium hover:bg-emerald-800"
        >
          Apply
        </button>
        {(category || excludeAllergen) && (
          <Link href="/foods" className="text-neutral-500 underline px-2 py-2">
            Clear
          </Link>
        )}
      </form>

      {foods.length === 0 ? (
        <p className="text-neutral-500">No food sources match these filters.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {foods.map((f) => (
            <Link
              key={f.id}
              href={`/foods/${f.slug}`}
              className="rounded-lg border border-neutral-200 bg-white p-4 hover:border-emerald-400 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-neutral-900">{f.name}</h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {f.dietary_category}
                </span>
              </div>
              <p className="text-sm text-neutral-500 mt-1">{f.serving_size}</p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
