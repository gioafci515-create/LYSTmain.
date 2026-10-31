import { NextResponse } from "next/server";
import { localeOf, localePath } from "@/lib/i18n-meta";
import { createUserClient } from "@/lib/supabase/server";

// Landing point for the links in Supabase emails (confirm signup, reset password).
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const rawNext = searchParams.get("next") ?? "/";
  // Only allow same-site relative redirects.
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/";

  if (code) {
    const sb = await createUserClient();
    const { error } = await sb.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }
  // Back to log in, in the language the link was requested in.
  return NextResponse.redirect(`${origin}${localePath(localeOf(next), "/login")}?error=link`);
}
