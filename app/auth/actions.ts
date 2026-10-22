"use server";

import { headers } from "next/headers";
import { ipFromHeaders, rateLimited } from "@/lib/rate-limit";
import { createUserClient } from "@/lib/supabase/server";

// Every auth call runs here, on the server. The session lives only in httpOnly cookies
// (lib/supabase/server.ts), so no token is ever readable by browser JavaScript.
// Server Actions are public endpoints: every argument is treated as untrusted input.

type Failure = { error: string };
export type Account = { email: string; name: string | null; role: "admin" | "host"; since: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BUSY = "Too many attempts. Please wait a few minutes and try again.";
const MINUTE = 60_000;

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

// Supabase messages become fixed sentences; anything unexpected stays in the server log.
function friendly(message: string) {
  const m = message.toLowerCase();
  if (m.includes("invalid login")) return "Email or password is incorrect.";
  if (m.includes("email not confirmed")) return "Please confirm your email first. Check your inbox for our message.";
  if (m.includes("already registered") || m.includes("already been registered")) return "An account with this email already exists. Log in instead.";
  if (m.includes("rate limit") || m.includes("too many")) return BUSY;
  if (m.includes("password")) return message; // password-policy hints, e.g. "Password should be at least 8 characters."
  console.error("auth error", message);
  return "Something went wrong. Please try again.";
}

async function limited(action: string, max: number, windowMs: number) {
  return rateLimited(`${action}:${ipFromHeaders(await headers())}`, max, windowMs);
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
  if (!EMAIL_RE.test(e) || !p) return { error: "Enter your email and password." };
  if ((await limited("login", 10, 10 * MINUTE)) || rateLimited(`login:${e.toLowerCase()}`, 10, 10 * MINUTE)) {
    return { error: BUSY };
  }

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
}): Promise<Failure | { signedIn: boolean }> {
  const name = str(input?.name, 200);
  const email = str(input?.email, 320);
  const password = typeof input?.password === "string" ? input.password : "";
  if (!name || !EMAIL_RE.test(email) || password.length < 8) return { error: "Please check your details." };
  if (input?.ageConfirmed !== true) return { error: "Host accounts are for people aged 16 or older." };
  if (await limited("signup", 5, 60 * MINUTE)) return { error: BUSY };

  const sb = await createUserClient();
  const { data, error } = await sb.auth.signUp({
    email,
    password,
    options: {
      // age_confirmed_16 is stored as profiles.age_confirmed_at by the signup trigger (supabase/schema.sql).
      data: { full_name: name, age_confirmed_16: true },
      emailRedirectTo: `${await origin()}/auth/callback?next=/account`,
    },
  });
  if (error) return { error: friendly(error.message) };
  return { signedIn: !!data.session };
}

export async function requestPasswordReset(email: unknown): Promise<Failure | { ok: true }> {
  const e = str(email, 320);
  if (!EMAIL_RE.test(e)) return { error: "Enter a complete email address." };
  if (await limited("reset", 5, 60 * MINUTE)) return { error: BUSY };

  const sb = await createUserClient();
  const { error } = await sb.auth.resetPasswordForEmail(e, {
    redirectTo: `${await origin()}/auth/callback?next=/reset-password`,
  });
  if (error) return { error: friendly(error.message) };
  return { ok: true };
}

export async function updatePassword(password: unknown): Promise<Failure | { ok: true }> {
  const p = typeof password === "string" ? password : "";
  if (p.length < 8) return { error: "Use at least 8 characters." };
  if (await limited("password", 10, 10 * MINUTE)) return { error: BUSY };

  const sb = await createUserClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return { error: "This reset link has expired. Request a new one from the log-in screen." };
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
