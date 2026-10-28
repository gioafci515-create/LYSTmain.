"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// Anonymous page-view beacon. No cookies or local storage; honours Do Not Track.
// The server stores only path, traffic source, device type and a daily-rotating hash.
export default function Tracker() {
  const pathname = usePathname();
  const last = useRef<string | null>(null);

  useEffect(() => {
    if (pathname.startsWith("/admin") || last.current === pathname) return;
    if (navigator.doNotTrack === "1") return;
    // Automated browsers (tests, Lighthouse, scrapers) are not visitors.
    if (navigator.webdriver) return;
    last.current = pathname;

    const q = new URLSearchParams(window.location.search);
    fetch("/api/track", {
      method: "POST",
      keepalive: true,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        path: pathname,
        referrer: document.referrer,
        utm_source: q.get("utm_source") ?? "",
        utm_campaign: q.get("utm_campaign") ?? "",
      }),
    }).catch(() => {});
  }, [pathname]);

  return null;
}
