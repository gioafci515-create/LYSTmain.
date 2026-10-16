import { requireAdmin } from "@/lib/supabase/server";

const STATUSES = ["new", "confirmed", "completed", "cancelled"];
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin();
  if (!auth.ok) return Response.json({ error: "Not authorised" }, { status: auth.status });

  const { id } = await ctx.params;
  if (!UUID_RE.test(id)) return Response.json({ error: "Bad id" }, { status: 400 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const update: { status?: string; admin_notes?: string | null } = {};
  if (body.status !== undefined) {
    if (typeof body.status !== "string" || !STATUSES.includes(body.status)) {
      return Response.json({ error: "Bad status" }, { status: 400 });
    }
    update.status = body.status;
  }
  if (body.admin_notes !== undefined) {
    update.admin_notes = typeof body.admin_notes === "string" ? body.admin_notes.slice(0, 4000) : null;
  }
  if (Object.keys(update).length === 0) return Response.json({ error: "Nothing to update" }, { status: 400 });

  const { data, error } = await auth.sb
    .from("consultation_requests")
    .update(update)
    .eq("id", id)
    .select()
    .maybeSingle();
  if (error) {
    console.error("consultation update failed", error);
    return Response.json({ error: "Could not update" }, { status: 500 });
  }
  if (!data) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ consultation: data });
}
