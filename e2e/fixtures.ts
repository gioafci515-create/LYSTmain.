import { test as base, expect } from "@playwright/test";

// Applied to every test automatically:
// - the visitor beacon (/api/track) is answered locally, so tests never count as visits or write
//   to the database, even when run against the live site. (Belt and braces: Tracker also skips
//   automated browsers, which matters because a keepalive beacon can outlive a closing test page.)
// - any console error, uncaught page error, CSP violation (Chrome reports those as console
//   errors) or request to another origin fails the test (CLAUDE.md: no third-party requests).
export const test = base.extend<{ guard: void }>({
  guard: [
    async ({ page, baseURL }, use) => {
      const problems: string[] = [];
      const origin = new URL(baseURL!).origin;

      await page.route("**/api/track", (route) => route.fulfill({ status: 204 }));
      page.on("console", (m) => {
        if (m.type() === "error") problems.push(`console error: ${m.text()}`);
      });
      page.on("pageerror", (e) => problems.push(`page error: ${e.message}`));
      page.on("request", (r) => {
        const url = new URL(r.url());
        if (url.protocol.startsWith("http") && url.origin !== origin) problems.push(`third-party request: ${url.origin}`);
      });

      await use();
      expect(problems, "console errors, page errors, CSP violations or third-party requests").toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };

/** Supabase-backed flows need a reachable project: the live site, or a local .env.local. */
export const hasSupabase = (baseURL: string | undefined) =>
  !baseURL?.includes("localhost") || !!process.env.NEXT_PUBLIC_SUPABASE_URL;
