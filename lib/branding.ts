"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";

export type ConsultantProfile = {
  id: string;
  business_name: string;
  slug: string;
  logo_url: string | null;
  accent_color: string;
  created_at: string;
  updated_at: string;
};

function slugify(input: string): string {
  const base = input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return base || "consultant";
}

export async function getMyProfile(): Promise<ConsultantProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("consultant_profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();
  return (data as ConsultantProfile) ?? null;
}

export async function getProfileBySlug(slug: string): Promise<ConsultantProfile | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("consultant_profiles")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return (data as ConsultantProfile) ?? null;
}

async function uniqueSlug(
  supabase: SupabaseClient,
  base: string,
  ownerId: string,
): Promise<string> {
  const root = slugify(base);
  let candidate = root;
  let suffix = 1;
  // Loop until we find a slug that's free, or already owned by this user
  // (so re-saving without changing the name doesn't churn the slug).
  for (;;) {
    const { data } = await supabase
      .from("consultant_profiles")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();
    if (!data || data.id === ownerId) return candidate;
    suffix += 1;
    candidate = `${root}-${suffix}`;
  }
}

export async function saveBranding(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login?next=/admin/branding");
  }

  const businessName = formData.get("business_name")?.toString().trim() ?? "";
  const accentColor = formData.get("accent_color")?.toString().trim() || "#047857";
  if (!businessName) {
    redirect("/admin/branding?error=missing_name");
  }

  const existing = await getMyProfile();

  let logoUrl = existing?.logo_url ?? null;
  const logoFile = formData.get("logo");
  if (logoFile instanceof File && logoFile.size > 0) {
    const ext = logoFile.name.split(".").pop()?.toLowerCase() || "png";
    const path = `${user.id}/logo-${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("consultant-logos")
      .upload(path, logoFile, {
        upsert: true,
        contentType: logoFile.type || undefined,
      });
    if (uploadError) {
      redirect("/admin/branding?error=logo_failed");
    }
    const { data: pub } = supabase.storage.from("consultant-logos").getPublicUrl(path);
    logoUrl = pub.publicUrl;
  }

  const slug = existing?.slug ?? (await uniqueSlug(supabase, businessName, user.id));

  const { error } = await supabase.from("consultant_profiles").upsert({
    id: user.id,
    business_name: businessName,
    slug,
    logo_url: logoUrl,
    accent_color: accentColor,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    redirect("/admin/branding?error=save_failed");
  }

  revalidatePath("/admin/branding");
  redirect("/admin/branding?success=1");
}
