import { requireAdmin } from "@/lib/supabase/server";

const WEEK_MS = 7 * 86_400_000;

function mondayUtc(d: Date) {
  const x = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  const dow = (new Date(x).getUTCDay() + 6) % 7; // Monday = 0
  return x - dow * 86_400_000;
}

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return Response.json({ error: "Not authorised" }, { status: auth.status });
  const { sb } = auth;

  const [consultations, hosts, stats] = await Promise.all([
    sb.from("consultation_requests").select("*").order("created_at", { ascending: false }).limit(1000),
    sb.from("profiles").select("id, created_at, full_name, email, role").order("created_at", { ascending: false }).limit(1000),
    sb.rpc("admin_stats", { days: 30 }),
  ]);

  if (consultations.error || hosts.error) {
    console.error("admin overview query failed", consultations.error ?? hosts.error);
    return Response.json({ error: "Could not load data" }, { status: 500 });
  }

  // Requests per week for the last 12 weeks (oldest → newest).
  const thisWeek = mondayUtc(new Date());
  const weekly = Array.from({ length: 12 }, () => 0);
  for (const c of consultations.data) {
    const idx = 11 - Math.floor((thisWeek - mondayUtc(new Date(c.created_at))) / WEEK_MS);
    if (idx >= 0 && idx < 12) weekly[idx] += 1;
  }

  return Response.json({
    consultations: consultations.data,
    hosts: hosts.data,
    weekly,
    // stats is null until the admin_stats SQL function has been created.
    stats: stats.error ? null : stats.data,
    statsError: stats.error ? stats.error.message : null,
  });
}
