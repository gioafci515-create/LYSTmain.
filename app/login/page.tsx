import type { Metadata } from "next";
import { Suspense } from "react";
import AuthForm, { LinkNotice } from "../components/auth/AuthForm";
import AuthShell from "../components/auth/AuthShell";

export const metadata: Metadata = {
  title: "Log in | LYST",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <AuthShell title="Host log in">
      <Suspense fallback={null}>
        <LinkNotice />
      </Suspense>
      <AuthForm view="login" />
    </AuthShell>
  );
}
