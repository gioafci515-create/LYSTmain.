import Link from "next/link";

const link =
  "underline underline-offset-4 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black";

function NewTabLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} target="_blank" rel="noopener" className={link}>
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </Link>
  );
}

/** Privacy Policy and Terms next to a form. They open in a new tab so a half-filled form is not lost. */
export default function LegalLinks() {
  return (
    <>
      <NewTabLink href="/privacy">Privacy Policy</NewTabLink>
      {" · "}
      <NewTabLink href="/terms">Terms of Service</NewTabLink>
    </>
  );
}

export { NewTabLink };
