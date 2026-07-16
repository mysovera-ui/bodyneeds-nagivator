import Link from "next/link";
import { login } from "@/lib/auth-actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; notice?: string }>;
}) {
  const { error, notice } = await searchParams;

  return (
    <main className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-neutral-900 mb-2">Consultant sign in</h1>
      <p className="text-sm text-neutral-500 mb-6">
        Sign in to manage content, save searches, and access the admin dashboard.
      </p>
      <form action={login} className="space-y-4">
        <div>
          <label className="block text-sm text-neutral-600 mb-1">Email</label>
          <input
            type="email"
            name="email"
            required
            autoFocus
            autoComplete="email"
            className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label className="block text-sm text-neutral-600 mb-1">Password</label>
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        {notice === "check_email" && (
          <p className="text-sm text-emerald-700">
            Account created — check your email to confirm, then sign in.
          </p>
        )}
        {error === "missing" && (
          <p className="text-sm text-red-700">Please enter your email and password.</p>
        )}
        {error && error !== "missing" && (
          <p className="text-sm text-red-700">{decodeURIComponent(error)}</p>
        )}
        <button
          type="submit"
          className="w-full rounded-lg bg-emerald-700 text-white px-5 py-3 font-medium hover:bg-emerald-800 active:bg-emerald-900 touch-manipulation"
        >
          Sign in
        </button>
      </form>
      <p className="text-sm text-neutral-500 mt-4">
        New consultant?{" "}
        <Link href="/signup" className="text-emerald-700 hover:underline touch-manipulation">
          Create an account
        </Link>
      </p>
    </main>
  );
}
