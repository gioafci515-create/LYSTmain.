import type { Source } from "@/lib/source";

export type ConsultationStatus = "new" | "confirmed" | "completed" | "cancelled";

export type Consultation = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  event_context: string | null;
  preferred_date: string | null;
  preferred_time: string | null;
  source: Source;
  status: ConsultationStatus;
  admin_notes: string | null;
};

export type Profile = {
  id: string;
  created_at: string;
  full_name: string | null;
  email: string | null;
  role: "host" | "admin";
};

export type Stats = {
  days: number;
  views: number;
  visitors: number;
  sources: { source: Source; views: number; visitors: number }[];
  devices: { device: string; views: number }[];
  top_pages: { path: string; views: number }[];
  daily: { day: string; views: number; visitors: number }[];
};

export type AdminData = {
  consultations: Consultation[];
  hosts: Profile[];
  weekly: number[];
  stats: Stats | null;
};
