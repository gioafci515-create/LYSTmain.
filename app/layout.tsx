import type { Metadata } from "next";
import localFont from "next/font/local";
import { Suspense } from "react";
import ModalProvider from "./components/modal/ModalProvider";
import Tracker from "./components/Tracker";
import "./globals.css";

// Self-hosted: no request to Google from the browser or the build. Inter is SIL OFL, see fonts/Inter-OFL.txt.
const inter = localFont({
  src: "./fonts/InterVariable-latin.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LYST | Beyond the invitation",
  description: "Bespoke digital invitations and connected event experiences.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <ModalProvider>{children}</ModalProvider>
        <Suspense fallback={null}>
          <Tracker />
        </Suspense>
      </body>
    </html>
  );
}
