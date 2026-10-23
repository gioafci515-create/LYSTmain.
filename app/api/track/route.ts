import { createHash } from "node:crypto";
import { rateLimited, visitorIp } from "@/lib/rate-limit";
import { detectDevice, detectSource, hostOf, isBot } from "@/lib/source";
import { createServiceClient } from "@/lib/supabase/admin";

const empty = (status = 204) => new Response(null, { status });
const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  const ua = req.headers.get("user-agent") ?? "";
  const salt = process.env.ANALYTICS_SALT;
  if (!salt || !ua || isBot(ua)) return empty();

  const ip = visitorIp(req.headers);
  if (await rateLimited("track", ip)) return empty(429);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return empty(400);
  }

  const path = str(body.path, 500);
  if (!path.startsWith("/") || path.startsWith("/admin") || path.startsWith("/api")) return empty();

  // Cookieless unique-visitor id: hash of ip + user-agent + a secret + today's date.
  // The raw IP and user-agent are never stored, and the hash changes every day,
  // so no one can be followed across days.
  const day = new Date().toISOString().slice(0, 10);
  const visitorHash = createHash("sha256").update(`${ip}|${ua}|${salt}|${day}`).digest("hex").slice(0, 32);

  let referrerHost = hostOf(str(body.referrer, 2000));
  const ownHost = req.headers.get("host")?.replace(/^www\./, "").toLowerCase();
  if (referrerHost && referrerHost === ownHost) referrerHost = null;

  const source = detectSource({
    referrerHost,
    utmSource: str(body.utm_source, 100),
    userAgent: ua,
  });

  try {
    const { error } = await createServiceClient().from("page_views").insert({
      path,
      source,
      referrer_host: referrerHost,
      utm_campaign: str(body.utm_campaign, 255) || null,
      device: detectDevice(ua),
      visitor_hash: visitorHash,
    });
    if (error) throw error;
  } catch (err) {
    console.error("page view insert failed", err);
    return empty(500);
  }
  return empty();
}
