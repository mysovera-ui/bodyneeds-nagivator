import Link from "next/link";
import { signup } from "@/lib/auth-actions";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const knownErrors = ["missing", "weak_password"];

  return (
    <main className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-neutral-900 mb-2">Create a consultant account</h1>
      <p className="text-sm text-neutral-500 mb-6">
        For health &amp; wellness consultants using BodyNeeds Navigator to manage
        content and save client-ready searches.
      </p>
      <form action={signup} className="space-y-4">
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
            minLength={8}
            autoComplete="new-password"
            className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <p className="text-xs text-neutral-400 mt-1">At least 8 characters.</p>
        </div>
        {error === "missing" && (
          <p className="text-sm text-red-700">Please enter your email and password.</p>
        )}
        {error === "weak_password" && (
          <p className="text-sm text-red-700">Password must be at least 8 characters.</p>
        )}
        {error && !knownErrors.includes(error) && (
          <p className="text-sm text-red-700">{decodeURIComponent(error)}</p>
        )}
        <button
          type="submit"
          className="w-full rounded-lg bg-emerald-700 text-white px-5 py-3 font-medium hover:bg-emerald-800 active:bg-emerald-900 touch-manipulation"
        >
          Create account
        </button>
      </form>
      <p className="text-sm text-neutral-500 mt-4">
        Already have an account?{" "}
        <Link href="/login" className="text-emerald-700 hover:underline touch-manipulation">
          Sign in
        </Link>
      </p>
    </main>
  );
}
