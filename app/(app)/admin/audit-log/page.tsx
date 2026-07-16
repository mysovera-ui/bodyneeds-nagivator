import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type AuditRow = {
  id: string;
  created_at: string;
  actor_email: string | null;
  action: string;
  table_name: string;
  record_id: string | null;
  details: string | null;
};

const ACTION_STYLES: Record<string, string> = {
  insert: "bg-emerald-100 text-emerald-800",
  update: "bg-amber-100 text-amber-800",
  delete: "bg-red-100 text-red-800",
};

export default async function AuditLogPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("audit_logs")
    .select("id, created_at, actor_email, action, table_name, record_id, details")
    .order("created_at", { ascending: false })
    .limit(50);

  const rows = (data ?? []) as AuditRow[];

  return (
    <main className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <div>
        <Link href="/admin" className="text-sm text-emerald-700 hover:underline touch-manipulation">
          ← Admin
        </Link>
        <h1 className="text-2xl font-bold text-neutral-900 mt-1">Audit Log</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Last {rows.length} content edits, most recent first.
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-700">Could not load audit log: {error.message}</p>
      )}

      {rows.length === 0 && !error ? (
        <p className="text-neutral-500">No edits recorded yet.</p>
      ) : (
        <div className="divide-y divide-neutral-200 border border-neutral-200 rounded-lg bg-white">
          {rows.map((row) => (
            <div key={row.id} className="p-4 flex flex-col gap-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full uppercase ${
                    ACTION_STYLES[row.action] ?? "bg-neutral-100 text-neutral-700"
                  }`}
                >
                  {row.action}
                </span>
                <span className="text-sm font-medium text-neutral-900">{row.table_name}</span>
                <span className="text-xs text-neutral-400">
                  {new Date(row.created_at).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-neutral-600">{row.details}</p>
              <p className="text-xs text-neutral-400">by {row.actor_email ?? "unknown"}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
