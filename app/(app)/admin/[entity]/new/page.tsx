import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { ENTITIES } from "@/lib/admin";
import { insertRow } from "@/lib/admin-data";
import AdminFormFields from "@/components/AdminFormFields";

export default async function NewEntityPage({
  params,
  searchParams,
}: {
  params: Promise<{ entity: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { entity } = await params;
  const { error } = await searchParams;
  const config = ENTITIES[entity];
  if (!config) notFound();

  async function create(formData: FormData) {
    "use server";
    const values: Record<string, string | number | null> = {};
    for (const f of config.fields) {
      const v = formData.get(f.name)?.toString().trim() ?? "";
      if (f.required && !v) {
        redirect(`/admin/${entity}/new?error=missing`);
      }
      if (f.type === "number") {
        if (v) values[f.name] = Number(v);
      } else if (v) {
        values[f.name] = v;
      }
    }
    try {
      await insertRow(config.table, values);
    } catch {
      redirect(`/admin/${entity}/new?error=save_failed`);
    }
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
      <h1 className="text-2xl font-bold text-neutral-900">New {config.singular}</h1>
      {error === "missing" && (
        <p className="text-sm text-red-700">Please fill in all required fields.</p>
      )}
      {error === "save_failed" && (
        <p className="text-sm text-red-700">
          Couldn&rsquo;t save — check the slug is unique and try again.
        </p>
      )}
      <form action={create} className="space-y-4">
        <AdminFormFields fields={config.fields} />
        <button
          type="submit"
          className="rounded-lg bg-emerald-700 text-white px-5 py-3 font-medium hover:bg-emerald-800 active:bg-emerald-900 touch-manipulation"
        >
          Create
        </button>
      </form>
    </main>
  );
}
