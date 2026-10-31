import Link from "next/link";
import { fontClassName, fontStack } from "@/lib/fonts";

// 404 for paths outside the localized site (e.g. an unknown /admin/... page). Localized pages use
// app/[locale]/not-found.tsx instead.
export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${fontClassName} h-full antialiased`} style={{ "--font-stack": fontStack } as React.CSSProperties}>
      <body className="flex min-h-full flex-col">
        <title>Page not found | LYST</title>
        <main id="main" className="mx-auto w-full max-w-[560px] px-6 py-24">
          <p className="text-xs uppercase tracking-[0.2em]">Error 404</p>
          <h1 className="mt-8 text-[40px] font-light leading-[1.05] tracking-tight">This page does not exist.</h1>
          <Link href="/" className="mt-10 flex h-14 w-full items-center justify-center bg-[#201f1d] text-xs uppercase tracking-[0.15em] text-white hover:bg-black">
            Go to the home page
          </Link>
        </main>
      </body>
    </html>
  );
}
