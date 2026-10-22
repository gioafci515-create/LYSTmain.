import type { Metadata } from "next";
import AuthForm from "../components/auth/AuthForm";
import AuthShell from "../components/auth/AuthShell";

export const metadata: Metadata = {
  title: "Sign up | LYST",
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return (
    <AuthShell title="Host sign up">
      <AuthForm view="signup" />
    </AuthShell>
  );
}
