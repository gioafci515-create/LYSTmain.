import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { connection } from "next/server";

// Per-request client acting as the signed-in user (RLS applies).
// This is the only Supabase client: the session lives in httpOnly cookies that browser
// JavaScript cannot read, and every auth call goes through app/auth/actions.ts.
export async function createUserClient() {
  // Read cookies first: it marks the caller as request-time only, so the build never runs it
  // (and a deploy can't fail just because the Supabase keys are missing at build time).
  const store = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase credentials are not configured");
  return createServerClient(url, key, {
    cookies: {
      getAll: () => store.getAll(),
      setAll(list) {
        try {
          list.forEach(({ name, value, options }) =>
            store.set(name, value, {
              ...options,
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
            }),
          );
        } catch {
          // Called from a context that cannot set cookies; session refresh happens on the next request.
        }
      },
    },
  });
}

/** Returns a user-scoped client only if the caller is a signed-in admin. */
export async function requireAdmin() {
  // Admin data is always per-request: never let the build try to pre-render it.
  await connection();
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error("Supabase credentials are not configured");
    return { ok: false as const, status: 503 };
  }
  const sb = await createUserClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return { ok: false as const, status: 401 };
  const { data: profile } = await sb.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "admin") return { ok: false as const, status: 403 };
  return { ok: true as const, sb, user };
}
