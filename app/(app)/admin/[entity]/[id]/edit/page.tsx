import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { ENTITIES } from "@/lib/admin";
import { getRow, updateRow, deleteRow } from "@/lib/admin-data";
import AdminFormFields from "@/components/AdminFormFields";

export default async function EditEntityPage({
  params,
  searchParams,
}: {
  params: Promise<{ entity: string; id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { entity, id } = await params;
  const { error } = await searchParams;
  const config = ENTITIES[entity];
  if (!config) notFound();

  const row = await getRow(config.table, id);
  if (!row) notFound();

  async function update(formData: FormData) {
    "use server";
    const values: Record<string, string | number | null> = {};
    for (const f of config.fields) {
      const v = formData.get(f.name)?.toString().trim() ?? "";
      if (f.required && !v) {
        redirect(`/admin/${entity}/${id}/edit?error=missing`);
      }
      if (f.type === "number") {
        values[f.name] = v ? Number(v) : null;
      } else {
        values[f.name] = v;
      }
    }
    try {
      await updateRow(config.table, id, values);
    } catch {
      redirect(`/admin/${entity}/${id}/edit?error=save_failed`);
    }
    revalidatePath(`/admin/${entity}`);
    revalidatePath(`/${entity}`);
    revalidatePath(`/${entity}/${values.slug}`);
    revalidatePath("/");
    redirect(`/admin/${entity}`);
  }

  async function remove() {
    "use server";
    await deleteRow(config.table, id);
    revalidatePath(`/admin/${entity}`);
    revalidatePath(`/${entity}`);
    revalidatePath("/");
    redirect(`/admin/${entity}`);
  }

  return (
    <main className="max-w-xl mx-auto px-4 py-10 space-y-6">
      <Link href={`/admin/${entity}`} className="text-sm text-emerald-700 hover:underline touch-manipulation">
        ← {config.label}
      </Link>
      <h1 className="text-2xl font-bold text-neutral-900">Edit {config.singular}</h1>
      {error === "missing" && (
        <p className="text-sm text-red-700">Please fill in all required fields.</p>
      )}
      {error === "save_failed" && (
        <p className="text-sm text-red-700">
          Couldn&rsquo;t save — check the slug is unique and try again.
        </p>
      )}
      <form action={update} className="space-y-4">
        <AdminFormFields fields={config.fields} defaultValues={row} />
        <button
          type="submit"
          className="rounded-lg bg-emerald-700 text-white px-5 py-3 font-medium hover:bg-emerald-800 active:bg-emerald-900 touch-manipulation"
        >
          Save
        </button>
      </form>
      <form action={remove}>
        <button type="submit" className="text-sm text-red-600 hover:underline touch-manipulation">
          Delete this {config.singular.toLowerCase()}
        </button>
      </form>
    </main>
  );
}
