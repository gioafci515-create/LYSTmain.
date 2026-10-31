"use server";

import { headers } from "next/headers";
import { hasLocale } from "next-intl";
import { routing, type Locale } from "@/i18n/routing";
import { localePath } from "@/lib/i18n-meta";
import { rateLimited, visitorIp, type LimitName } from "@/lib/rate-limit";
import { createUserClient } from "@/lib/supabase/server";
import type en from "@/messages/en.json";

// Every auth call runs here, on the server. The session lives only in httpOnly cookies
// (lib/supabase/server.ts), so no token is ever readable by browser JavaScript.
// Server Actions are public endpoints: every argument is treated as untrusted input.
// Failures are codes (errors.* in messages/*.json); the browser shows them in the visitor's language.

export type AuthError = keyof typeof en.errors;
type Failure = { error: AuthError };
export type Account = { email: string; name: string | null; role: "admin" | "host"; since: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const lang = (v: unknown): Locale => (hasLocale(routing.locales, v) ? v : routing.defaultLocale);

// Supabase messages become fixed codes; anything unexpected stays in the server log.
function friendly(message: string): AuthError {
  const m = message.toLowerCase();
  if (m.includes("invalid login")) return "invalid_login";
  if (m.includes("email not confirmed")) return "email_not_confirmed";
  if (m.includes("already registered") || m.includes("already been registered")) return "already_registered";
  if (m.includes("rate limit") || m.includes("too many")) return "busy";
  if (m.includes("password")) return "weak_password"; // password-policy hints, e.g. "Password should be at least 8 characters."
  console.error("auth error", message);
  return "generic";
}

// Limits per visitor IP; the windows live in lib/rate-limit.ts.
async function limited(name: LimitName) {
  return rateLimited(name, visitorIp(await headers()));
}

// Where links in auth e-mails point back to. Supabase only honours URLs on its Redirect URLs allow-list.
async function origin() {
  const h = await headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export async function signIn(email: unknown, password: unknown): Promise<Failure | { role: Account["role"] }> {
  const e = str(email, 320);
  const p = typeof password === "string" ? password : "";
  if (!EMAIL_RE.test(e) || !p) return { error: "missing_credentials" };
  if ((await limited("login")) || (await rateLimited("loginEmail", e.toLowerCase()))) return { error: "busy" };

  const sb = await createUserClient();
  const { data, error } = await sb.auth.signInWithPassword({ email: e, password: p });
  if (error || !data.user) return { error: friendly(error?.message ?? "") };
  const { data: profile } = await sb.from("profiles").select("role").eq("id", data.user.id).maybeSingle();
  return { role: profile?.role === "admin" ? "admin" : "host" };
}

export async function signUp(input: {
  name: unknown;
  email: unknown;
  password: unknown;
  ageConfirmed: unknown;
  locale?: unknown;
}): Promise<Failure | { signedIn: boolean }> {
  const name = str(input?.name, 200);
  const email = str(input?.email, 320);
  const password = typeof input?.password === "string" ? input.password : "";
  if (!name || !EMAIL_RE.test(email) || password.length < 8) return { error: "check_details" };
  if (input?.ageConfirmed !== true) return { error: "age" };
  if (await limited("signup")) return { error: "busy" };

  const sb = await createUserClient();
  const { data, error } = await sb.auth.signUp({
    email,
    password,
    options: {
      // age_confirmed_16 is stored as profiles.age_confirmed_at by the signup trigger (supabase/schema.sql).
      data: { full_name: name, age_confirmed_16: true },
      emailRedirectTo: `${await origin()}/auth/callback?next=${localePath(lang(input?.locale), "/account")}`,
    },
  });
  if (error) return { error: friendly(error.message) };
  return { signedIn: !!data.session };
}

export async function requestPasswordReset(email: unknown, locale?: unknown): Promise<Failure | { ok: true }> {
  const e = str(email, 320);
  if (!EMAIL_RE.test(e)) return { error: "invalid_email" };
  if (await limited("reset")) return { error: "busy" };

  const sb = await createUserClient();
  const { error } = await sb.auth.resetPasswordForEmail(e, {
    redirectTo: `${await origin()}/auth/callback?next=${localePath(lang(locale), "/reset-password")}`,
  });
  if (error) return { error: friendly(error.message) };
  return { ok: true };
}

export async function updatePassword(password: unknown): Promise<Failure | { ok: true }> {
  const p = typeof password === "string" ? password : "";
  if (p.length < 8) return { error: "short_password" };
  if (await limited("password")) return { error: "busy" };

  const sb = await createUserClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return { error: "reset_expired" };
  const { error } = await sb.auth.updateUser({ password: p });
  if (error) return { error: friendly(error.message) };
  return { ok: true };
}

export async function signOut() {
  const sb = await createUserClient();
  await sb.auth.signOut();
}

/** The signed-in host or admin, or null. */
export async function getAccount(): Promise<Account | null> {
  // Without Supabase configured (CI, a fresh checkout) nobody can be signed in: pages that only
  // ask "is someone signed in?" shouldn't error over it. Real auth actions still fail loudly.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) return null;
  const sb = await createUserClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return null;
  const { data: p } = await sb.from("profiles").select("full_name, role, created_at").eq("id", user.id).maybeSingle();
  return {
    email: user.email ?? "",
    name: p?.full_name ?? (user.user_metadata?.full_name as string | undefined) ?? null,
    role: p?.role === "admin" ? "admin" : "host",
    since: p?.created_at ?? user.created_at,
  };
}
