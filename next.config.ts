import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const isDev = process.env.NODE_ENV === "development";

// The browser only ever talks to this site: Supabase is called from the server (CLAUDE.md, security rules).
// Scripts keep 'unsafe-inline' because nonces would force every page to render dynamically;
// external scripts, framing, plugins and foreign form targets are all blocked.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  `connect-src 'self'${isDev ? " ws:" : ""}`,
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Camera/microphone open up to 'self' only when Disposable Camera / voice notes are built.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()" },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  // The site's public address (lib/site.ts). Inlined at build time so browser code (the admin
  // checklist) sees it too; it is public by nature. Changing it in Vercel needs a redeploy.
  env: { SITE_URL: process.env.SITE_URL ?? "" },
  images: {
    // Photos are served at quality 90; 75 stays available for the default.
    qualities: [75, 90],
  },
  partialPrefetching: true,
  poweredByHeader: false,
  // Dev logging prints Server Action arguments, which would put passwords from app/auth/actions.ts in the terminal.
  logging: { serverFunctions: false },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default withNextIntl(nextConfig);
