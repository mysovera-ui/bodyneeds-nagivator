import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function login(formData: FormData) {
  "use server";
  const password = formData.get("password")?.toString() ?? "";
  const expected = process.env.ADMIN_PASSWORD;

  if (!expected) {
    redirect("/admin/login?error=not_configured");
  }
  if (password !== expected) {
    redirect("/admin/login?error=wrong_password");
  }

  const cookieStore = await cookies();
  cookieStore.set("admin_session", password, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 8,
    path: "/",
  });
  redirect("/admin");
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-neutral-900 mb-2">Admin sign in</h1>
      <p className="text-sm text-neutral-500 mb-6">
        Content editor access. Public search and browsing don&rsquo;t require this.
      </p>
      <form action={login} className="space-y-4">
        <div>
          <label className="block text-sm text-neutral-600 mb-1">Password</label>
          <input
            type="password"
            name="password"
            required
            autoFocus
            className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        {error === "wrong_password" && (
          <p className="text-sm text-red-700">Incorrect password. Try again.</p>
        )}
        {error === "not_configured" && (
          <p className="text-sm text-red-700">
            Admin isn&rsquo;t configured yet — set the ADMIN_PASSWORD environment
            variable in Vercel.
          </p>
        )}
        <button
          type="submit"
          className="w-full rounded-lg bg-emerald-700 text-white px-5 py-3 font-medium hover:bg-emerald-800 active:bg-emerald-900 touch-manipulation"
        >
          Sign in
        </button>
      </form>
    </main>
  );
}
