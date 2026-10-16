// Traffic-source / device helpers shared by the tracker and booking routes.
// Only coarse, non-identifying values are ever stored.

export type Source = "instagram" | "tiktok" | "facebook" | "direct" | "other";

export const SOURCES: Source[] = ["instagram", "tiktok", "facebook", "direct", "other"];

export const sourceLabel: Record<Source, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  facebook: "Facebook",
  direct: "Direct",
  other: "Other",
};

export function hostOf(url?: string | null): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase().slice(0, 255);
  } catch {
    return null;
  }
}

export function detectSource(input: {
  referrerHost?: string | null;
  utmSource?: string | null;
  userAgent?: string | null;
}): Source {
  const utm = (input.utmSource ?? "").toLowerCase();
  if (utm) {
    if (/insta|^ig$/.test(utm)) return "instagram";
    if (/tiktok/.test(utm)) return "tiktok";
    if (/facebook|^fb$/.test(utm)) return "facebook";
  }

  const host = input.referrerHost ?? "";
  if (/(^|\.)instagram\.com$/.test(host)) return "instagram";
  if (/(^|\.)tiktok\.com$/.test(host)) return "tiktok";
  if (/(^|\.)(facebook|fb)\.com$/.test(host) || /(^|\.)fb\.me$/.test(host)) return "facebook";

  // In-app browsers often send no referrer; the user-agent gives it away.
  const ua = input.userAgent ?? "";
  if (/Instagram/i.test(ua)) return "instagram";
  if (/musical_ly|BytedanceWebview|TikTok/i.test(ua)) return "tiktok";
  if (/FBAN|FBAV|FB_IAB/i.test(ua)) return "facebook";

  if (host) return "other";
  return "direct";
}

export type Device = "mobile" | "tablet" | "desktop" | "unknown";

export function detectDevice(ua: string): Device {
  if (!ua) return "unknown";
  if (/ipad|tablet|playbook|silk/i.test(ua) || (/android/i.test(ua) && !/mobile/i.test(ua))) return "tablet";
  if (/mobi|iphone|ipod|android/i.test(ua)) return "mobile";
  return "desktop";
}

export function isBot(ua: string): boolean {
  return /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|preview|facebookexternalhit|embedly|monitor|uptime/i.test(ua);
}
