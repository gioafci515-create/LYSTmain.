import { defineConfig, devices } from "@playwright/test";

// Smoke tests (e2e/). Locally they reuse a running `npm run dev` (or start one) and drive the
// installed Microsoft Edge; CI builds the app and uses Playwright's own Chromium.
// `npm run test:e2e:live` runs the same tests against the live site (playwright.live.config.ts).

// Lets tests know whether this machine can reach Supabase (tests that need it skip otherwise).
// Only the variable names matter to the tests; values stay in this process.
try {
  process.loadEnvFile(".env.local");
} catch {
  // No .env.local (CI): Supabase-backed tests are skipped unless CI provides the variables.
}

const ci = !!process.env.CI;
const channel = ci ? undefined : "msedge";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: ci,
  retries: ci ? 2 : 0,
  workers: ci ? 2 : undefined,
  reporter: ci ? [["list"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], channel } },
    { name: "mobile", use: { ...devices["Pixel 7"], channel } },
  ],
  webServer: {
    command: ci ? "npm run build && npm run start" : "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !ci,
    timeout: 240_000,
  },
});
