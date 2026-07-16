"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { ENTITIES } from "@/lib/admin";

const REVIEW_STATUSES = ["unreviewed", "reviewed", "approved"];

export async function setReviewStatus(formData: FormData) {
  const entityKey = formData.get("entityKey")?.toString() ?? "";
  const id = formData.get("id")?.toString() ?? "";
  const status = formData.get("status")?.toString() ?? "";

  const entity = ENTITIES[entityKey];
  if (!entity || !id || !REVIEW_STATUSES.includes(status)) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from(entity.table)
    .update({ [entity.reviewStatusField]: status })
    .eq("id", id);

  if (!error) {
    try {
      await supabase.from("audit_logs").insert({
        action: "update",
        table_name: entity.table,
        record_id: id,
        actor_email: user?.email ?? null,
        details: `Review status set to "${status}"`,
      });
    } catch {
      // Audit logging is best-effort; never block the underlying mutation.
    }
  }

  revalidatePath("/admin/review");
  revalidatePath(`/admin/${entityKey}`);
  revalidatePath(`/${entityKey}`);
}
