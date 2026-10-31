/** First Tab stop on every page; each page marks where its content starts with id="main". */
export default function SkipLink({ label }: { label: string }) {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-[#0b0b0b] focus:px-4 focus:py-3 focus:text-sm focus:text-white focus:outline-2 focus:outline-offset-2 focus:outline-white"
    >
      {label}
    </a>
  );
}
