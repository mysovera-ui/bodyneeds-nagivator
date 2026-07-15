import Link from "next/link";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ENTITIES } from "@/lib/admin";
import { listRows, deleteRow } from "@/lib/admin-data";

export const dynamic = "force-dynamic";

export default async function EntityListPage({
  params,
}: {
  params: Promise<{ entity: string }>;
}) {
  const { entity } = await params;
  const config = ENTITIES[entity];
  if (!config) notFound();

  const rows = await listRows(config.table);

  async function remove(formData: FormData) {
    "use server";
    const id = formData.get("id")?.toString();
    if (!id) return;
    await deleteRow(config.table, id);
    revalidatePath(`/admin/${entity}`);
    revalidatePath(`/${entity}`);
    revalidatePath("/");
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <Link href="/admin" className="text-sm text-emerald-700 hover:underline touch-manipulation">
            ← Admin
          </Link>
          <h1 className="text-2xl font-bold text-neutral-900 mt-1">{config.label}</h1>
        </div>
        <Link
          href={`/admin/${entity}/new`}
          className="shrink-0 rounded-lg bg-emerald-700 text-white px-4 py-2.5 font-medium hover:bg-emerald-800 active:bg-emerald-900 touch-manipulation"
        >
          + New
        </Link>
      </div>

      {rows.length === 0 ? (
        <p className="text-neutral-500">No rows yet.</p>
      ) : (
        <div className="divide-y divide-neutral-200 border border-neutral-200 rounded-lg bg-white">
          {rows.map((row) => {
            const r = row as { id: string; name: string; slug: string };
            return (
              <div key={r.id} className="flex items-center justify-between p-4 gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-neutral-900 truncate">{r.name}</p>
                  <p className="text-xs text-neutral-500 truncate">{r.slug}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Link
                    href={`/admin/${entity}/${r.id}/edit`}
                    className="text-sm text-emerald-700 hover:underline touch-manipulation"
                  >
                    Edit
                  </Link>
                  <form action={remove}>
                    <input type="hidden" name="id" value={r.id} />
                    <button
                      type="submit"
                      className="text-sm text-red-600 hover:underline touch-manipulation"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
