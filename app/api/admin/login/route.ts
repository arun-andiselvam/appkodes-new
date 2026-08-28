import { NextResponse } from "next/server";

import {
  ADMIN_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  checkCredentials,
  issueSessionToken,
} from "@/lib/admin-auth";
import { callerKey, overLimit } from "@/lib/rate-limit";

/**
 * Signing in.
 *
 * !! THIS ROUTE ITSELF IS NOT BEHIND THE GATE IT ISSUES TICKETS FOR !!
 *
 * See proxy.ts's isLoginRoute check. Everything that matters is checked
 * here instead: rate limiting against guessing, and a constant-time
 * comparison against the real credentials, both from lib/admin-auth.ts.
 */

export const dynamic = "force-dynamic";

function redirectToLogin(request: Request, next: string, error: string) {
  const url = new URL("/admin/login", request.url);
  url.searchParams.set("next", next);
  url.searchParams.set("error", error);
  return NextResponse.redirect(url, { status: 303 });
}

export async function POST(request: Request) {
  /*
   * Ten attempts a minute per caller. Generous for a person mistyping a
   * password, tight for a script trying every word in a list - and the
   * credential check underneath is constant time regardless, so this is
   * the layer actually doing the slowing down.
   */
  if (overLimit("admin-login", callerKey(request), 10, 60_000)) {
    return redirectToLogin(request, "/admin/estimates", "rate_limited");
  }

  const form = await request.formData();
  const username = String(form.get("username") ?? "");
  const password = String(form.get("password") ?? "");
  const rawNext = String(form.get("next") ?? "/admin/estimates");
  /* Same-site only - a next value is form input, never trusted as a full URL. */
  const next = rawNext.startsWith("/") ? rawNext : "/admin/estimates";

  const ok = await checkCredentials(username, password);
  if (!ok) return redirectToLogin(request, next, "bad_credentials");

  const token = await issueSessionToken();
  if (!token) return redirectToLogin(request, next, "bad_credentials");

  const response = NextResponse.redirect(new URL(next, request.url), { status: 303 });
  response.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return response;
}
