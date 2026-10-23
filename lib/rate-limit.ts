import "server-only";
import { createHash } from "node:crypto";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Shared rate limits in Upstash Redis: every serverless instance counts the same requests.
// Without Upstash env vars (local dev) it falls back to a per-process memory counter.

const MINUTE = 60_000;

const LIMITS = {
  login: { max: 10, windowMs: 10 * MINUTE }, // per visitor IP
  loginEmail: { max: 10, windowMs: 10 * MINUTE }, // per account: password guessing spread over many IPs
  signup: { max: 5, windowMs: 60 * MINUTE },
  reset: { max: 5, windowMs: 60 * MINUTE },
  password: { max: 10, windowMs: 10 * MINUTE },
  booking: { max: 5, windowMs: 10 * MINUTE },
  track: { max: 60, windowMs: MINUTE },
};

export type LimitName = keyof typeof LIMITS;

// Vercel's Upstash integration names them KV_REST_API_*; a direct Upstash setup uses UPSTASH_REDIS_REST_*.
const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
const redis = url && token ? new Redis({ url, token }) : null;

// Built once per instance, outside any handler, so each limiter's ephemeral cache can
// reject an already-blocked caller without a Redis round trip.
const limiters = redis
  ? (Object.fromEntries(
      Object.entries(LIMITS).map(([name, { max, windowMs }]) => [
        name,
        new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(max, `${windowMs} ms`),
          prefix: `lyst:rl:${name}`,
          timeout: 1000, // if Upstash is unreachable, let the request through rather than lock everyone out
          analytics: false,
        }),
      ]),
    ) as Record<LimitName, Ratelimit>)
  : null;

if (!limiters && process.env.VERCEL_ENV === "production") {
  console.error("Rate limiting: Upstash env vars are missing, falling back to per-instance memory");
}

// Keys hold a salted hash, never the raw IP or email, and expire with their window.
const hashed = (id: string) =>
  createHash("sha256").update(`${process.env.ANALYTICS_SALT ?? ""}|${id}`).digest("hex").slice(0, 32);

/** True when `id` (a visitor IP or an email) has used up the `name` limit. */
export async function rateLimited(name: LimitName, id: string): Promise<boolean> {
  const key = hashed(id);
  if (limiters) return !(await limiters[name].limit(key)).success;
  return memoryLimited(`${name}:${key}`, LIMITS[name]);
}

/**
 * The visitor's real IP. On Vercel these headers are written by Vercel's edge and any value the
 * client sends is overwritten, so they can't be spoofed; x-vercel-forwarded-for also survives a
 * proxy placed in front of Vercel. Off Vercel (local dev) x-forwarded-for is only a best effort.
 */
export function visitorIp(h: { get(name: string): string | null }): string {
  const first = (v: string | null) => v?.split(",")[0]?.trim() || null;
  return first(h.get("x-vercel-forwarded-for")) ?? first(h.get("x-real-ip")) ?? first(h.get("x-forwarded-for")) ?? "unknown";
}

const hits = new Map<string, number[]>();

function memoryLimited(key: string, { max, windowMs }: { max: number; windowMs: number }): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);

  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= windowMs)) hits.delete(k);
  }
  return false;
}
