import type { Metadata } from "next";
import { terms } from "@/lib/legal/terms";
import LegalPage from "../components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service | LYST",
  description: "The terms for using the LYST website and host accounts.",
};

export default function TermsPage() {
  return <LegalPage docs={terms} other={{ href: "/privacy", label: "Privacy Policy" }} />;
}
