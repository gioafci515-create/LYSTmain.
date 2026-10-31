import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Maps "/", "/en/..." and "/ru/..." onto app/[locale]. Admin, API, auth callbacks, Next internals
// and files (images, robots.txt, sitemap.xml) are left alone.
export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|admin|auth|_next|_vercel|.*\\..*).*)"],
};
