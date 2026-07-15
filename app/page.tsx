import { Suspense } from "react";
import Link from "next/link";
import SearchBox from "@/components/SearchBox";
import ResultCard from "@/components/ResultCard";
import { ResultCardSkeleton } from "@/components/Skeletons";
import { assembleFullSymptom, searchSymptoms } from "@/lib/data";

export const dynamic = "force-dynamic";

const EXAMPLES = ["Fatigue", "Poor Sleep", "Low Mood", "Muscle Cramps"];

async function SearchResults({ q }: { q: string }) {
  try {
    const matches = await searchSymptoms(q);

    if (matches.length === 0) {
      return (
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-8 text-center">
          <p className="text-neutral-700 font-medium">
            No results for &ldquo;{q}&rdquo;.
          </p>
          <p className="text-neutral-500 text-sm mt-1">
            Try{" "}
            {EXAMPLES.map((e, i) => (
              <span key={e}>
                <Link href={`/?q=${encodeURIComponent(e)}`} className="underline text-emerald-700">
                  {e}
                </Link>
                {i < EXAMPLES.length - 1 ? ", " : ""}
              </span>
            ))}
            , or browse all <Link href="/symptoms" className="underline text-emerald-700">symptoms</Link>.
          </p>
        </div>
      );
    }

    const full = await Promise.all(matches.map((m) => assembleFullSymptom(m)));

    return (
      <div className="space-y-6">
        {full.map((symptom) => (
          <ResultCard key={symptom.id} symptom={symptom} />
        ))}
      </div>
    );
  } catch {
    return (
      <div className="rounded-xl border border-red-300 bg-red-50 p-6 text-center">
        <p className="text-red-800 font-medium">
          Something went wrong loading results.
        </p>
        <p className="text-red-700 text-sm mt-1">Please try again in a moment.</p>
      </div>
    );
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  return (
    <main className="max-w-2xl mx-auto px-4 py-10 space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          BodyNeeds Navigator
        </h1>
        <p className="text-neutral-600">
          Search a symptom to see its nutritional context — lifestyle factors,
          key nutrients, food sources, and supplement safety guidance.
        </p>
      </div>

      <SearchBox defaultValue={q} />

      {!q && (
        <div className="flex flex-wrap gap-2 justify-center text-sm">
          <span className="text-neutral-500">Try:</span>
          {EXAMPLES.map((e) => (
            <Link
              key={e}
              href={`/?q=${encodeURIComponent(e)}`}
              className="px-3 py-1 rounded-full border border-neutral-300 text-neutral-700 hover:border-emerald-500 hover:text-emerald-700"
            >
              {e}
            </Link>
          ))}
        </div>
      )}

      {q ? (
        <Suspense fallback={<ResultCardSkeleton />}>
          <SearchResults q={q} />
        </Suspense>
      ) : (
        <p className="text-center text-sm text-neutral-400">
          Or browse the full <Link href="/symptoms" className="underline">symptom index</Link>.
        </p>
      )}
    </main>
  );
}
