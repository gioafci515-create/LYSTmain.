import type { Metadata } from "next";
import AdminApp from "./AdminApp";

export const metadata: Metadata = {
  title: "LYST Admin",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminApp />;
}
