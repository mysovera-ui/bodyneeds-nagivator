import { createClient } from "@/lib/supabase/server";

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

export async function insertRow(table: string, values: Record<string, string>) {
  const supabase = await createClient();
  const { error } = await supabase.from(table).insert(values);
  if (error) throw new Error(error.message);
}

export async function updateRow(table: string, id: string, values: Record<string, string>) {
  const supabase = await createClient();
  const { error } = await supabase.from(table).update(values).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteRow(table: string, id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw new Error(error.message);
}
