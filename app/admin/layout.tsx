import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { fontClassName, fontStack } from "@/lib/fonts";
import messages from "@/messages/en.json";
import SkipLink from "../components/SkipLink";

// Admin is English-only. The English messages are provided so shared form fields work here too.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Without this, next-intl would read the language from request headers and block static rendering.
  setRequestLocale("en");
  return (
    <html lang="en" className={`${fontClassName} h-full antialiased`} style={{ "--font-stack": fontStack } as React.CSSProperties}>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider locale="en" messages={messages}>
          <SkipLink label="Skip to content" />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
