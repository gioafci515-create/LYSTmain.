import { defineConfig } from "@playwright/test";
import base from "./playwright.config";

// Same smoke tests against the deployed site: `npm run test:e2e:live`.
// Read-only: the visitor beacon is blocked and no form is submitted except one wrong-password
// login (desktop only), so a run never writes to the live database.
export default defineConfig({
  ...base,
  retries: 1,
  use: { ...base.use, baseURL: process.env.E2E_BASE_URL ?? "https://lystmain.vercel.app" },
  webServer: undefined,
});
