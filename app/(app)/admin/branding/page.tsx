import Link from "next/link";
import { getMyProfile, saveBranding } from "@/lib/branding";

export default async function BrandingPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const { error, success } = await searchParams;
  const profile = await getMyProfile();

  return (
    <main className="max-w-xl mx-auto px-4 py-10 space-y-6">
      <div>
        <Link href="/admin" className="text-sm text-emerald-700 hover:underline touch-manipulation">
          ← Admin
        </Link>
        <h1 className="text-2xl font-bold text-neutral-900 mt-1">Branding</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Set up your practice name, logo, and color. Clients see this instead
          of BodyNeeds Navigator on your shared result links.
        </p>
      </div>

      {success === "1" && (
        <p className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
          Branding saved.
        </p>
      )}
      {error === "missing_name" && (
        <p className="text-sm text-red-700">Please enter a business/practice name.</p>
      )}
      {error === "logo_failed" && (
        <p className="text-sm text-red-700">
          Couldn&rsquo;t upload that logo. Try a smaller image file.
        </p>
      )}
      {error === "save_failed" && (
        <p className="text-sm text-red-700">Couldn&rsquo;t save your branding. Please try again.</p>
      )}

      <form action={saveBranding} className="space-y-4" encType="multipart/form-data">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Business / practice name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="business_name"
            required
            defaultValue={profile?.business_name ?? ""}
            placeholder="e.g. Willow Wellness Clinic"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Logo</label>
          {profile?.logo_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.logo_url}
              alt="Current logo"
              className="h-14 w-14 rounded-lg object-contain border border-neutral-200 bg-white mb-2"
            />
          )}
          <input
            type="file"
            name="logo"
            accept="image/*"
            className="w-full text-sm text-neutral-600 file:mr-3 file:rounded-lg file:border-0 file:bg-neutral-100 file:px-3 file:py-2 file:text-sm file:font-medium touch-manipulation"
          />
          <p className="text-xs text-neutral-400 mt-1">
            {profile?.logo_url ? "Upload a new image to replace it." : "PNG or JPG works best."}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Accent color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              name="accent_color"
              defaultValue={profile?.accent_color ?? "#047857"}
              className="h-11 w-14 rounded-lg border border-neutral-300 touch-manipulation"
            />
            <span className="text-sm text-neutral-500">
              Used for the header bar on your shared pages.
            </span>
          </div>
        </div>

        {profile?.slug && (
          <div className="rounded-lg bg-neutral-50 border border-neutral-200 p-3">
            <p className="text-sm font-medium text-neutral-700">Your share link base</p>
            <p className="text-sm text-emerald-700 break-all mt-0.5">/c/{profile.slug}/...</p>
            <p className="text-xs text-neutral-400 mt-1">
              Look for &ldquo;Copy branded link&rdquo; on any symptom, nutrient,
              food, or supplement page while signed in.
            </p>
          </div>
        )}

        <button
          type="submit"
          className="rounded-lg bg-emerald-700 text-white px-5 py-3 font-medium hover:bg-emerald-800 active:bg-emerald-900 touch-manipulation"
        >
          Save branding
        </button>
      </form>
    </main>
  );
}
