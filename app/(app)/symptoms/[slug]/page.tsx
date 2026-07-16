import { notFound } from "next/navigation";
import Link from "next/link";
import { getFullSymptomBySlug } from "@/lib/data";
import ResultCard from "@/components/ResultCard";
import ShareLinkBar from "@/components/ShareLinkBar";

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
      <div className="flex items-center justify-between gap-3">
        <Link href="/symptoms" className="text-sm text-emerald-700 hover:underline touch-manipulation inline-block py-1">
          ← All symptoms
        </Link>
        <ShareLinkBar type="symptoms" itemSlug={slug} />
      </div>
      <ResultCard symptom={symptom} />
    </main>
  );
}
