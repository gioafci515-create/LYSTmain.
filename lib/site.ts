// Single source of truth for public brand details.
// Empty string = not supplied yet; the site shows a "[... required]" placeholder
// and the admin launch checklist flags it.
export type SocialKey = "instagram" | "tiktok" | "facebook";

export const site: {
  name: string;
  url: string;
  social: Record<SocialKey, string>;
  contact: { email: string; phone: string; address: string };
} = {
  name: "LYST",
  url: "", // e.g. "https://lyst.com"
  social: {
    instagram: "https://www.instagram.com/lystinvites/",
    tiktok: "https://www.tiktok.com/@lystinvites",
    facebook: "",
  },
  contact: {
    email: "",
    phone: "",
    address: "",
  },
};

export const socialLabels: Record<SocialKey, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  facebook: "Facebook",
};
