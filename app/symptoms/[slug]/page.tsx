import { notFound } from "next/navigation";
import Link from "next/link";
import { getFullSymptomBySlug } from "@/lib/data";
import ResultCard from "@/components/ResultCard";

export default async function SymptomDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const symptom = await getFullSymptomBySlug(slug);
  if (!symptom) notFound();

  return (
    <main className="max-w-2xl mx-auto px-4 py-10 space-y-4">
      <Link href="/symptoms" className="text-sm text-emerald-700 hover:underline">
        ← All symptoms
      </Link>
      <ResultCard symptom={symptom} />
    </main>
  );
}
