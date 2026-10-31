import "./globals.css";

// Pass-through: the real <html> is rendered by app/[locale]/layout.tsx (the site, per language)
// and app/admin/layout.tsx (admin, English only). Kept so app/not-found.tsx has a root layout.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
