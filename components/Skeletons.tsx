export function ResultCardSkeleton() {
  return (
    <div className="rounded-xl border border-neutral-200 p-6 space-y-4 animate-pulse">
      <div className="h-6 w-1/3 bg-neutral-200 rounded" />
      <div className="h-4 w-full bg-neutral-200 rounded" />
      <div className="h-4 w-5/6 bg-neutral-200 rounded" />
      <div className="h-20 w-full bg-neutral-200 rounded" />
      <div className="h-20 w-full bg-neutral-200 rounded" />
    </div>
  );
}

export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-24 rounded-lg border border-neutral-200 bg-neutral-100 animate-pulse"
        />
      ))}
    </div>
  );
}
