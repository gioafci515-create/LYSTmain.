import type { Metadata } from "next";
import AuthShell from "../components/auth/AuthShell";
import AccountView from "./AccountView";

export const metadata: Metadata = {
  title: "Your account | LYST",
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return (
    <AuthShell title="Your account">
      <AccountView />
    </AuthShell>
  );
}
