import type { Metadata } from "next";
import { privacy } from "@/lib/legal/privacy";
import LegalPage from "../components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy | LYST",
  description: "What personal information LYST collects, why, who processes it, how long it is kept and how to ask for its deletion.",
};

export default function PrivacyPage() {
  return <LegalPage docs={privacy} other={{ href: "/terms", label: "Terms of Service" }} />;
}
