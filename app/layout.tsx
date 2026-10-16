import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import ModalProvider from "./components/modal/ModalProvider";
import Tracker from "./components/Tracker";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "LYST — Beyond the invitation",
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
