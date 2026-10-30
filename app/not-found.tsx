import type { Metadata } from "next";
import Link from "next/link";
import AuthShell from "./components/auth/AuthShell";

export const metadata: Metadata = {
  title: "Page not found | LYST",
};

const button =
  "flex h-14 w-full items-center justify-center text-xs uppercase tracking-[0.15em] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black";

export default function NotFound() {
  return (
    <AuthShell eyebrow="Error 404" title="This page does not exist.">
      <p className="text-base font-light leading-relaxed text-black/80 md:text-lg">
        The link may be old or mistyped. Everything about LYST starts on the home page.
      </p>
      <div className="mt-10 space-y-3">
        <Link href="/" className={`${button} bg-[#201f1d] text-white hover:bg-black`}>
          Go to the home page
        </Link>
        <Link href="/#consultation" className={`${button} border border-[#201f1d] hover:bg-white`}>
          Book a consultation
        </Link>
      </div>
    </AuthShell>
  );
}
