// SAMPLE DATA ONLY. Nothing here is real or connected to a backend.
// Replace with API calls once a database/auth provider is chosen.

export type ConsultationStatus = "new" | "confirmed" | "completed" | "cancelled";
export type Source = "instagram" | "tiktok" | "facebook" | "direct" | "other";

export type Consultation = {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string; // ISO date
  time: string;
  eventType: string;
  guests: number;
  budget: string;
  context: string;
  source: Source;
  status: ConsultationStatus;
  createdAt: string;
};

export const consultations: Consultation[] = [
  { id: "C-1042", name: "Sample Client A", email: "client.a@example.com", phone: "+00 000 000 001", date: "2026-10-19", time: "10:00", eventType: "Wedding", guests: 140, budget: "€15–25k", context: "Garden ceremony, wants a connected RSVP and photo wall.", source: "instagram", status: "new", createdAt: "2026-10-15" },
  { id: "C-1041", name: "Sample Client B", email: "client.b@example.com", phone: "+00 000 000 002", date: "2026-10-20", time: "14:30", eventType: "Private dinner", guests: 24, budget: "€3–5k", context: "Anniversary dinner, bespoke printed + digital invitation.", source: "tiktok", status: "confirmed", createdAt: "2026-10-14" },
  { id: "C-1040", name: "Sample Client C", email: "client.c@example.com", phone: "+00 000 000 003", date: "2026-10-22", time: "11:00", eventType: "Corporate gala", guests: 320, budget: "€30k+", context: "Annual gala; needs guest management and live updates.", source: "direct", status: "confirmed", createdAt: "2026-10-13" },
  { id: "C-1039", name: "Sample Client D", email: "client.d@example.com", phone: "+00 000 000 004", date: "2026-10-23", time: "16:00", eventType: "Birthday", guests: 60, budget: "€5–8k", context: "40th birthday on a rooftop. Interactive polls for the guests.", source: "facebook", status: "new", createdAt: "2026-10-13" },
  { id: "C-1038", name: "Sample Client E", email: "client.e@example.com", phone: "+00 000 000 005", date: "2026-10-12", time: "09:30", eventType: "Festival", guests: 800, budget: "€40k+", context: "Beach festival; real-time updates for ticket holders.", source: "instagram", status: "completed", createdAt: "2026-10-05" },
  { id: "C-1037", name: "Sample Client F", email: "client.f@example.com", phone: "+00 000 000 006", date: "2026-10-10", time: "13:00", eventType: "Engagement", guests: 45, budget: "€4–6k", context: "Intimate engagement party, memory book afterwards.", source: "tiktok", status: "completed", createdAt: "2026-10-03" },
  { id: "C-1036", name: "Sample Client G", email: "client.g@example.com", phone: "+00 000 000 007", date: "2026-10-09", time: "15:30", eventType: "Wedding", guests: 90, budget: "€10–15k", context: "Cancelled — date clash with venue.", source: "other", status: "cancelled", createdAt: "2026-10-02" },
  { id: "C-1035", name: "Sample Client H", email: "client.h@example.com", phone: "+00 000 000 008", date: "2026-10-26", time: "12:00", eventType: "Private dinner", guests: 18, budget: "€2–3k", context: "Chef's table evening, minimal invitation.", source: "instagram", status: "new", createdAt: "2026-10-16" },
];

export type Host = {
  id: string;
  name: string;
  email: string;
  plan: "Signature" | "Essential" | "Studio";
  events: number;
  guests: number;
  status: "active" | "invited" | "paused";
  joined: string;
};

export const hosts: Host[] = [
  { id: "H-201", name: "Sample Host One", email: "host.one@example.com", plan: "Signature", events: 6, guests: 540, status: "active", joined: "2026-03-02" },
  { id: "H-202", name: "Sample Host Two", email: "host.two@example.com", plan: "Studio", events: 3, guests: 410, status: "active", joined: "2026-05-18" },
  { id: "H-203", name: "Sample Host Three", email: "host.three@example.com", plan: "Essential", events: 1, guests: 60, status: "active", joined: "2026-07-09" },
  { id: "H-204", name: "Sample Host Four", email: "host.four@example.com", plan: "Essential", events: 0, guests: 0, status: "invited", joined: "2026-10-11" },
  { id: "H-205", name: "Sample Host Five", email: "host.five@example.com", plan: "Signature", events: 2, guests: 190, status: "paused", joined: "2026-01-21" },
];

export type EventItem = {
  id: string;
  title: string;
  host: string;
  date: string;
  location: string;
  status: "live" | "draft" | "past";
  yes: number;
  no: number;
  pending: number;
};

export const events: EventItem[] = [
  { id: "E-301", title: "Garden Wedding — Sample", host: "Sample Host One", date: "2026-11-07", location: "Venue placeholder", status: "live", yes: 96, no: 12, pending: 32 },
  { id: "E-302", title: "Annual Gala — Sample", host: "Sample Host Two", date: "2026-11-21", location: "Venue placeholder", status: "live", yes: 188, no: 40, pending: 92 },
  { id: "E-303", title: "Rooftop 40th — Sample", host: "Sample Host Three", date: "2026-10-30", location: "Venue placeholder", status: "live", yes: 41, no: 5, pending: 14 },
  { id: "E-304", title: "Chef's Table — Sample", host: "Sample Host One", date: "2026-12-04", location: "Venue placeholder", status: "draft", yes: 0, no: 0, pending: 18 },
  { id: "E-305", title: "Beach Festival — Sample", host: "Sample Host Two", date: "2026-09-27", location: "Venue placeholder", status: "past", yes: 612, no: 70, pending: 118 },
  { id: "E-306", title: "Engagement — Sample", host: "Sample Host Five", date: "2026-08-15", location: "Venue placeholder", status: "past", yes: 38, no: 4, pending: 3 },
];

export type Guest = {
  id: string;
  name: string;
  event: string;
  response: "yes" | "no" | "pending";
  plusOnes: number;
  diet: string;
  respondedAt: string;
};

export const guests: Guest[] = [
  { id: "G-1", name: "Sample Guest 1", event: "Garden Wedding — Sample", response: "yes", plusOnes: 1, diet: "Vegetarian", respondedAt: "2026-10-14" },
  { id: "G-2", name: "Sample Guest 2", event: "Garden Wedding — Sample", response: "yes", plusOnes: 0, diet: "—", respondedAt: "2026-10-14" },
  { id: "G-3", name: "Sample Guest 3", event: "Garden Wedding — Sample", response: "no", plusOnes: 0, diet: "—", respondedAt: "2026-10-12" },
  { id: "G-4", name: "Sample Guest 4", event: "Annual Gala — Sample", response: "yes", plusOnes: 1, diet: "Gluten-free", respondedAt: "2026-10-15" },
  { id: "G-5", name: "Sample Guest 5", event: "Annual Gala — Sample", response: "pending", plusOnes: 0, diet: "—", respondedAt: "—" },
  { id: "G-6", name: "Sample Guest 6", event: "Rooftop 40th — Sample", response: "yes", plusOnes: 2, diet: "Vegan", respondedAt: "2026-10-16" },
  { id: "G-7", name: "Sample Guest 7", event: "Rooftop 40th — Sample", response: "pending", plusOnes: 0, diet: "—", respondedAt: "—" },
  { id: "G-8", name: "Sample Guest 8", event: "Chef's Table — Sample", response: "pending", plusOnes: 0, diet: "Nut allergy", respondedAt: "—" },
  { id: "G-9", name: "Sample Guest 9", event: "Annual Gala — Sample", response: "no", plusOnes: 0, diet: "—", respondedAt: "2026-10-10" },
  { id: "G-10", name: "Sample Guest 10", event: "Garden Wedding — Sample", response: "yes", plusOnes: 1, diet: "Pescatarian", respondedAt: "2026-10-16" },
];

export const weeklyBookings = [3, 4, 2, 6, 5, 7, 4, 8, 9, 6, 11, 12];

export const trafficSources: { source: Source; label: string; visits: number }[] = [
  { source: "instagram", label: "Instagram", visits: 4820 },
  { source: "tiktok", label: "TikTok", visits: 3610 },
  { source: "facebook", label: "Facebook", visits: 1290 },
  { source: "direct", label: "Direct", visits: 1740 },
  { source: "other", label: "Other", visits: 540 },
];

export const activity: { id: string; text: string; time: string; kind: "booking" | "rsvp" | "host" | "event" }[] = [
  { id: "a1", text: "New consultation request — Sample Client H", time: "12 min ago", kind: "booking" },
  { id: "a2", text: "6 new RSVPs for Annual Gala — Sample", time: "1 h ago", kind: "rsvp" },
  { id: "a3", text: "Sample Host Four was invited", time: "5 days ago", kind: "host" },
  { id: "a4", text: "Chef's Table — Sample saved as draft", time: "yesterday", kind: "event" },
  { id: "a5", text: "Consultation confirmed — Sample Client C", time: "yesterday", kind: "booking" },
  { id: "a6", text: "Rooftop 40th — Sample went live", time: "2 days ago", kind: "event" },
];

export const sourceLabel: Record<Source, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  facebook: "Facebook",
  direct: "Direct",
  other: "Other",
};
