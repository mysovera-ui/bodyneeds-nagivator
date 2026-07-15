import { CardGridSkeleton } from "@/components/Skeletons";

export default function Loading() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <div className="h-8 w-40 bg-neutral-200 rounded animate-pulse" />
      <CardGridSkeleton />
    </main>
  );
}
