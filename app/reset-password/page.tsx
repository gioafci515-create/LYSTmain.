import type { Metadata } from "next";
import AuthShell from "../components/auth/AuthShell";
import ResetForm from "./ResetForm";

export const metadata: Metadata = {
  title: "Choose a new password | LYST",
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <AuthShell title="Choose a new password">
      <ResetForm />
    </AuthShell>
  );
}
