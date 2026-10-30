// Single source of truth for public brand details.
// Empty string = not supplied yet: it is left out of the public site (never a placeholder)
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
    email: "lystinvites@gmail.com",
    phone: "+995 568 13 02 60",
    address: "Tbilisi, Georgia",
  },
};

/** tel: link for a displayed phone number ("+995 568 13 02 60" -> "tel:+995568130260"). */
export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

export const socialLabels: Record<SocialKey, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  facebook: "Facebook",
};
