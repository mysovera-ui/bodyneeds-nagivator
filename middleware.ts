import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Best-effort in-memory rate limiter for the search route. This resets on
// cold start and is not shared across serverless instances/regions, so it
// is a soft defense (not a hard guarantee) — sufficient to blunt naive
// scripted abuse without adding an external store (e.g. Upstash Redis) for
// this v1. Revisit with a shared store if abuse becomes a real problem.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 30;
const requestLog = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (requestLog.get(key) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS,
  );
  recent.push(now);
  requestLog.set(key, recent);

  // Guard against unbounded memory growth on a long-lived instance.
  if (requestLog.size > 5000) requestLog.clear();

  return recent.length > RATE_LIMIT_MAX_REQUESTS;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/" && request.nextUrl.searchParams.has("q")) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";
    if (isRateLimited(`search:${ip}`)) {
      return new NextResponse(
        "Too many searches. Please slow down and try again shortly.",
        { status: 429, headers: { "Content-Type": "text/plain" } },
      );
    }
  }

  const { response, user } = await updateSession(request);

  if (pathname.startsWith("/admin") && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
