"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveSearch(formData: FormData) {
  const query = formData.get("query")?.toString().trim();
  if (!query) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(`/?q=${encodeURIComponent(query)}`)}`);
  }

  await supabase.from("saved_searches").insert({ query });
  revalidatePath("/saved");
}

export async function deleteSavedSearch(formData: FormData) {
  const id = formData.get("id")?.toString();
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("saved_searches").delete().eq("id", id);
  revalidatePath("/saved");
}
