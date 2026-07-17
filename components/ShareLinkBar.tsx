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
  const pdfUrl = profile
    ? `/pdf/${type}/${itemSlug}?brand=${profile.slug}`
    : `/pdf/${type}/${itemSlug}`;

  if (!profile) {
    return (
      <div className="flex justify-end items-center gap-3">
        <a
          href={pdfUrl}
          className="text-sm text-neutral-500 underline touch-manipulation"
        >
          Download PDF
        </a>
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
    <div className="flex justify-end items-center gap-3">
      <a
        href={pdfUrl}
        className="text-sm text-neutral-500 underline touch-manipulation"
      >
        Download PDF
      </a>
      <CopyLinkButton url={url} />
    </div>
  );
}
