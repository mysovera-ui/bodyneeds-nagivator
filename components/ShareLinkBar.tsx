import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getMyProfile } from "@/lib/branding";
import CopyLinkButton from "@/components/CopyLinkButton";

export default async function ShareLinkBar({
  type,
  itemSlug,
}: {
  type: "symptoms" | "nutrients" | "foods" | "supplements";
  itemSlug: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const profile = await getMyProfile();
  if (!profile) {
    return (
      <div className="flex justify-end">
        <Link
          href="/admin/branding"
          className="text-sm text-neutral-400 underline touch-manipulation"
        >
          Set up branding to share →
        </Link>
      </div>
    );
  }

  const url = `/c/${profile.slug}/${type}/${itemSlug}`;

  return (
    <div className="flex justify-end">
      <CopyLinkButton url={url} />
    </div>
  );
}
