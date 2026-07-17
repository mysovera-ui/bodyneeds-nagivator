import { notFound } from "next/navigation";
import Link from "next/link";
import { getProfileBySlug } from "@/lib/branding";
import {
  getFullSymptomBySlug,
  getNutrientBySlug,
  getFoodSourceBySlug,
  getSupplementCategoryBySlug,
} from "@/lib/data";
import Disclaimer from "@/components/Disclaimer";
import RedFlags from "@/components/RedFlags";
import PrintButton from "@/components/PrintButton";

export const dynamic = "force-dynamic";

const VALID_TYPES = ["symptoms", "nutrients", "foods", "supplements"] as const;
type ItemType = (typeof VALID_TYPES)[number];

export default async function BrandedResultPage({
  params,
}: {
  params: Promise<{ slug: string; type: string; itemSlug: string }>;
}) {
  const { slug, type, itemSlug } = await params;

  if (!VALID_TYPES.includes(type as ItemType)) notFound();

  const profile = await getProfileBySlug(slug);
  if (!profile) notFound();

  const base = `/c/${slug}`;

  return (
    <div className="min-h-screen bg-neutral-50">
      <header
        className="px-4 py-4 sm:py-5 flex items-center gap-3 text-white print:text-black print:bg-white"
        style={{ backgroundColor: profile.accent_color }}
      >
        {profile.logo_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.logo_url}
            alt={profile.business_name}
            className="h-10 w-10 rounded object-contain bg-white/90 p-1"
          />
        )}
        <span className="font-bold text-lg">{profile.business_name}</span>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div className="print:hidden flex justify-end gap-2">
          <a
            href={`/pdf/${type}/${itemSlug}?brand=${slug}`}
            className="text-sm text-neutral-600 border border-neutral-300 rounded-lg px-3 py-1.5 hover:bg-neutral-100 touch-manipulation"
          >
            Download PDF
          </a>
          <PrintButton />
        </div>

        {type === "symptoms" && <SymptomContent slug={itemSlug} base={base} />}
        {type === "nutrients" && <NutrientContent slug={itemSlug} base={base} />}
        {type === "foods" && <FoodContent slug={itemSlug} base={base} />}
        {type === "supplements" && <SupplementContent slug={itemSlug} base={base} />}

        <p className="text-center text-xs text-neutral-400 pt-4 print:hidden">
          Powered by BodyNeeds Navigator
        </p>
      </main>
    </div>
  );
}

async function SymptomContent({ slug, base }: { slug: string; base: string }) {
  const symptom = await getFullSymptomBySlug(slug);
  if (!symptom) notFound();

  return (
    <article className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">{symptom.name}</h1>
        <p className="text-neutral-700 mt-1">{symptom.explanation}</p>
      </div>

      <RedFlags text={symptom.red_flags} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div>
          <h2 className="font-semibold text-neutral-800 mb-1">Lifestyle factors</h2>
          <p className="text-neutral-600">{symptom.lifestyle_factors}</p>
        </div>
        <div>
          <h2 className="font-semibold text-neutral-800 mb-1">Nutritional factors</h2>
          <p className="text-neutral-600">{symptom.nutritional_factors}</p>
        </div>
        <div>
          <h2 className="font-semibold text-neutral-800 mb-1">Possible medical causes</h2>
          <p className="text-neutral-600">{symptom.medical_causes}</p>
        </div>
        <div>
          <h2 className="font-semibold text-neutral-800 mb-1">Next steps</h2>
          <p className="text-neutral-600">{symptom.professional_next_steps}</p>
        </div>
      </div>

      {symptom.nutrients.length > 0 && (
        <div>
          <h2 className="font-semibold text-neutral-800 mb-2">
            Related nutrients ({symptom.nutrients.length})
          </h2>
          <div className="space-y-3">
            {symptom.nutrients.map((n) => (
              <div key={n.id} className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                <Link
                  href={`${base}/nutrients/${n.slug}`}
                  className="font-medium text-emerald-800 hover:underline"
                >
                  {n.name}
                </Link>
                {n.relevance_note && (
                  <p className="text-xs text-neutral-600 mt-0.5">{n.relevance_note}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {symptom.supplements.length > 0 && (
        <div>
          <h2 className="font-semibold text-neutral-800 mb-2">
            Supplement categories ({symptom.supplements.length})
          </h2>
          <div className="space-y-3">
            {symptom.supplements.map((s) => (
              <div key={s.id} className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                <Link
                  href={`${base}/supplements/${s.slug}`}
                  className="font-medium text-amber-800 hover:underline"
                >
                  {s.name}
                </Link>
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

async function NutrientContent({ slug, base }: { slug: string; base: string }) {
  const nutrient = await getNutrientBySlug(slug);
  if (!nutrient) notFound();

  return (
    <article className="space-y-5">
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
      </div>
      {nutrient.food_sources.length > 0 && (
        <div>
          <h2 className="font-semibold text-neutral-800 mb-2">Food sources</h2>
          <ul className="space-y-1 text-sm">
            {nutrient.food_sources.map((f) => (
              <li key={f.id}>
                <Link href={`${base}/foods/${f.slug}`} className="text-emerald-700 hover:underline">
                  {f.name}
                </Link>
                {f.amount_per_serving ? ` — ${f.amount_per_serving}` : ""}
              </li>
            ))}
          </ul>
        </div>
      )}
      <Disclaimer />
    </article>
  );
}

async function FoodContent({ slug, base }: { slug: string; base: string }) {
  const food = await getFoodSourceBySlug(slug);
  if (!food) notFound();

  return (
    <article className="space-y-5">
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
      </div>
      {food.nutrients.length > 0 && (
        <div>
          <h2 className="font-semibold text-neutral-800 mb-2">Key nutrients</h2>
          <ul className="space-y-1 text-sm">
            {food.nutrients.map((n) => (
              <li key={n.id}>
                <Link href={`${base}/nutrients/${n.slug}`} className="text-emerald-700 hover:underline">
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
  );
}

async function SupplementContent({ slug, base }: { slug: string; base: string }) {
  const supplement = await getSupplementCategoryBySlug(slug);
  if (!supplement) notFound();
  void base;

  return (
    <article className="space-y-5">
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
      </div>
      <div className="rounded-lg border border-amber-300 bg-amber-50 p-4">
        <h2 className="font-semibold text-amber-800 text-sm mb-1">Cautions</h2>
        <p className="text-amber-800 text-sm">{supplement.cautions}</p>
      </div>
      <Disclaimer />
    </article>
  );
}
