import type { Metadata } from "next";
import ResetForm from "./ResetForm";

export const metadata: Metadata = {
  title: "Choose a new password — LYST",
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <main className="mx-auto w-full max-w-[640px] px-6 py-16 md:py-24">
      <p className="text-[11px] uppercase tracking-[0.2em]">Host access only</p>
      <h1 className="mt-8 text-[40px] font-light leading-[1.05] tracking-tight md:text-5xl">
        Choose a new password
      </h1>
      <ResetForm />
    </main>
  );
}
