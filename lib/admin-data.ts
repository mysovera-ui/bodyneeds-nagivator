import { createClient } from "@/lib/supabase/server";

async function logAudit(
  action: "insert" | "update" | "delete",
  table: string,
  recordId: string | null,
  details: string,
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    await supabase.from("audit_logs").insert({
      action,
      table_name: table,
      record_id: recordId,
      actor_email: user?.email ?? null,
      details,
    });
  } catch {
    // Audit logging is best-effort; never block the underlying mutation.
  }
}

export async function listRows(table: string): Promise<Record<string, unknown>[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from(table).select("*").order("name");
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getRow(
  table: string,
  id: string,
): Promise<Record<string, unknown> | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from(table).select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function insertRow(table: string, values: Record<string, string | number | null>) {
  const supabase = await createClient();
  const { data, error } = await supabase.from(table).insert(values).select().single();
  if (error) throw new Error(error.message);
  await logAudit("insert", table, (data?.id as string) ?? null, `Created "${values.name ?? data?.id}"`);
  return data;
}

export async function updateRow(table: string, id: string, values: Record<string, string | number | null>) {
  const supabase = await createClient();
  const { error } = await supabase.from(table).update(values).eq("id", id);
  if (error) throw new Error(error.message);
  await logAudit("update", table, id, `Updated "${values.name ?? id}"`);
}

export async function deleteRow(table: string, id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw new Error(error.message);
  await logAudit("delete", table, id, `Deleted record ${id}`);
}
