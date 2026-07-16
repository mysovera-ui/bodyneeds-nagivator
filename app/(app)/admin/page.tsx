import Link from "next/link";
import { ENTITIES } from "@/lib/admin";
import { logout } from "@/lib/auth-actions";

export default function AdminHome() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Admin</h1>
        <form action={logout}>
          <button
            type="submit"
            className="text-sm text-neutral-500 underline touch-manipulation"
          >
            Sign out
          </button>
        </form>
      </div>
      <p className="text-sm text-neutral-500">
        Create, edit, and delete content. Changes appear on the public site
        immediately.
      </p>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        <Link
          href="/admin/audit-log"
          className="inline-block text-sm text-emerald-700 hover:underline touch-manipulation"
        >
          View audit log →
        </Link>
        <Link
          href="/admin/branding"
          className="inline-block text-sm text-emerald-700 hover:underline touch-manipulation"
        >
          Branding & share links →
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.values(ENTITIES).map((e) => (
          <Link
            key={e.key}
            href={`/admin/${e.key}`}
            className="rounded-lg border border-neutral-200 bg-white p-4 hover:border-emerald-400 hover:shadow-sm active:bg-neutral-50 touch-manipulation"
          >
            <h2 className="font-semibold text-neutral-900">{e.label}</h2>
          </Link>
        ))}
      </div>
    </main>
  );
}
