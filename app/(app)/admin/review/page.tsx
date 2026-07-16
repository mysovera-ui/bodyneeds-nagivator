import Link from "next/link";
import { getReviewQueue } from "@/lib/review";
import { setReviewStatus } from "@/lib/review-actions";

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
  unreviewed: "bg-neutral-100 text-neutral-700",
  reviewed: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
};

export default async function ReviewQueuePage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: statusFilter } = await searchParams;
  const allItems = await getReviewQueue();
  const items =
    statusFilter && statusFilter !== "all"
      ? allItems.filter((i) => i.status === statusFilter)
      : allItems;

  const counts = {
    unreviewed: allItems.filter((i) => i.status === "unreviewed").length,
    reviewed: allItems.filter((i) => i.status === "reviewed").length,
    approved: allItems.filter((i) => i.status === "approved").length,
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <div>
        <Link href="/admin" className="text-sm text-emerald-700 hover:underline touch-manipulation">
          ← Admin
        </Link>
        <h1 className="text-2xl font-bold text-neutral-900 mt-1">Content Review</h1>
        <p className="text-sm text-neutral-500 mt-1">
          {allItems.length} content items. Track review status and confidence, and triage what still needs a look.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 text-sm">
        <FilterLink label={`All (${allItems.length})`} value="all" active={!statusFilter || statusFilter === "all"} />
        <FilterLink label={`Unreviewed (${counts.unreviewed})`} value="unreviewed" active={statusFilter === "unreviewed"} />
        <FilterLink label={`Reviewed (${counts.reviewed})`} value="reviewed" active={statusFilter === "reviewed"} />
        <FilterLink label={`Approved (${counts.approved})`} value="approved" active={statusFilter === "approved"} />
      </div>

      {items.length === 0 ? (
        <p className="text-neutral-500">Nothing here.</p>
      ) : (
        <div className="divide-y divide-neutral-200 border border-neutral-200 rounded-lg bg-white">
          {items.map((item) => (
            <div
              key={`${item.entityKey}-${item.id}`}
              className="p-4 flex flex-col sm:flex-row sm:items-center gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                    {item.entityLabel}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full uppercase font-semibold ${
                      STATUS_STYLES[item.status] ?? "bg-neutral-100 text-neutral-700"
                    }`}
                  >
                    {item.status}
                  </span>
                  {item.confidence != null && (
                    <span className="text-xs text-neutral-500">{item.confidence}% confidence</span>
                  )}
                </div>
                <Link
                  href={`/admin/${item.entityKey}/${item.id}/edit`}
                  className="font-medium text-neutral-900 hover:underline touch-manipulation"
                >
                  {item.name}
                </Link>
                {item.source && (
                  <p className="text-xs text-neutral-400 mt-0.5 truncate">Source: {item.source}</p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {item.status !== "reviewed" && (
                  <ReviewButton entityKey={item.entityKey} id={item.id} status="reviewed" label="Mark reviewed" />
                )}
                {item.status !== "approved" && (
                  <ReviewButton entityKey={item.entityKey} id={item.id} status="approved" label="Approve" />
                )}
                {item.status !== "unreviewed" && (
                  <ReviewButton entityKey={item.entityKey} id={item.id} status="unreviewed" label="Reset" muted />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

function FilterLink({ label, value, active }: { label: string; value: string; active: boolean }) {
  return (
    <Link
      href={value === "all" ? "/admin/review" : `/admin/review?status=${value}`}
      className={`px-3 py-1.5 rounded-full border touch-manipulation ${
        active
          ? "border-emerald-500 bg-emerald-50 text-emerald-800"
          : "border-neutral-300 text-neutral-600 hover:border-emerald-400"
      }`}
    >
      {label}
    </Link>
  );
}

function ReviewButton({
  entityKey,
  id,
  status,
  label,
  muted,
}: {
  entityKey: string;
  id: string;
  status: string;
  label: string;
  muted?: boolean;
}) {
  return (
    <form action={setReviewStatus}>
      <input type="hidden" name="entityKey" value={entityKey} />
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <button
        type="submit"
        className={`text-xs font-medium px-2.5 py-1.5 rounded-lg border touch-manipulation ${
          muted
            ? "border-neutral-200 text-neutral-500 hover:bg-neutral-50"
            : "border-emerald-300 text-emerald-700 hover:bg-emerald-50"
        }`}
      >
        {label}
      </button>
    </form>
  );
}
