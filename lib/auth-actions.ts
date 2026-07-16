"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

function safeMessage(message: string): string {
  // Avoid leaking internal provider detail; map a few known cases to
  // friendlier copy and fall back to a generic message otherwise.
  if (/invalid login credentials/i.test(message)) return "Incorrect email or password.";
  if (/already registered/i.test(message)) return "An account with that email already exists.";
  if (/rate limit/i.test(message)) return "Too many attempts. Please wait a moment and try again.";
  return "Something went wrong. Please try again.";
}

export async function login(formData: FormData) {
  const email = formData.get("email")?.toString().trim() ?? "";
  const password = formData.get("password")?.toString() ?? "";
  if (!email || !password) {
    redirect("/login?error=missing");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect(`/login?error=${encodeURIComponent(safeMessage(error.message))}`);
  }
  redirect("/admin");
}

export async function signup(formData: FormData) {
  const email = formData.get("email")?.toString().trim() ?? "";
  const password = formData.get("password")?.toString() ?? "";
  if (!email || !password) {
    redirect("/signup?error=missing");
  }
  if (password.length < 8) {
    redirect("/signup?error=weak_password");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    redirect(`/signup?error=${encodeURIComponent(safeMessage(error.message))}`);
  }

  if (data.session) {
    redirect("/admin");
  }
  // Email confirmation required before a session exists
  redirect("/login?notice=check_email");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
