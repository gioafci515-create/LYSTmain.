import type { Metadata } from "next";
import AuthForm from "../components/auth/AuthForm";
import AuthShell from "../components/auth/AuthShell";

export const metadata: Metadata = {
  title: "Forgot password | LYST",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell title="Forgot password?">
      <AuthForm view="forgot" />
    </AuthShell>
  );
}
