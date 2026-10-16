import { clientIp, rateLimited } from "@/lib/rate-limit";
import { detectSource, hostOf } from "@/lib/source";
import { createServiceClient } from "@/lib/supabase/admin";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const str = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

export async function POST(req: Request) {
  if (rateLimited(`consult:${clientIp(req)}`, 5, 10 * 60_000)) {
    return Response.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }
  if (Number(req.headers.get("content-length") ?? 0) > 20_000) {
    return Response.json({ error: "Request too large." }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real users never fill this hidden field.
  if (str(body.website, 100)) return Response.json({ ok: true });

  const name = str(body.name, 200);
  const email = str(body.email, 320);
  const phone = str(body.phone, 50);
  const context = str(body.context, 4000);
  const date = str(body.date, 10);
  const time = str(body.time, 50);

  const fields: Record<string, string> = {};
  if (!name) fields.name = "Enter your name.";
  if (!EMAIL_RE.test(email)) fields.email = "Enter a complete email address.";
  if (!DATE_RE.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00Z`))) {
    fields.date = "Choose a date.";
  } else {
    const d = Date.parse(`${date}T00:00:00Z`);
    const today = Date.parse(new Date().toISOString().slice(0, 10) + "T00:00:00Z");
    if (d < today - 86_400_000 || d > today + 400 * 86_400_000) fields.date = "Choose a date in the coming months.";
  }
  if (!time) fields.time = "Choose a time.";
  if (Object.keys(fields).length) return Response.json({ error: "Please check your details.", fields }, { status: 400 });

  const source = detectSource({
    referrerHost: hostOf(str(body.referrer, 2000)),
    utmSource: str(body.utm_source, 100),
    userAgent: req.headers.get("user-agent"),
  });

  try {
    const { error } = await createServiceClient().from("consultation_requests").insert({
      name,
      email,
      phone: phone || null,
      event_context: context || null,
      preferred_date: date,
      preferred_time: time,
      source,
    });
    if (error) throw error;
  } catch (err) {
    console.error("consultation insert failed", err);
    return Response.json({ error: "We could not save your request. Please try again." }, { status: 500 });
  }

  return Response.json({ ok: true });
}
