import { NextResponse } from "next/server";
import { requireSameOrigin } from "@/lib/security/origin";
import { requireAdminJson } from "@/lib/security/adminAuth";
import { rateLimit } from "@/lib/security/rateLimit";
import { getSupportTicketAdminSafe, setSupportTicketStatus, type SupportStatus } from "@/lib/admin/supportStore";
import { logAdminAction } from "@/lib/admin/audit";

function parseStatus(v: unknown): SupportStatus | null {
  if (v === "open" || v === "in_progress" || v === "resolved") return v;
  return null;
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const originBlock = requireSameOrigin(req);
  if (originBlock) return originBlock;

  const auth = await requireAdminJson("MANAGE_SUPPORT");
  if (!auth.ok) return auth.response;
  const user = auth.session?.user;
  if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const keySuffix = user.email || user.id;
  const limited = rateLimit(req, { keyPrefix: "admin-support-status", limit: 20, windowMs: 60_000, keySuffix });
  if (limited) return limited;

  const { id } = await ctx.params;
  const ticket = await getSupportTicketAdminSafe(id);
  if (!ticket) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = (await req.json().catch(() => ({}))) as any;
  const reason = String(body.reason || "").trim();
  if (!reason) return NextResponse.json({ error: "reason required" }, { status: 400 });
  const status = parseStatus(body.status);
  if (!status) return NextResponse.json({ error: "invalid status" }, { status: 400 });

  await setSupportTicketStatus(id, status);

  await logAdminAction({
    adminUser: { id: user.id, email: user.email || null },
    adminRole: auth.role,
    actionType: "MANAGE_SUPPORT_TICKET_STATUS",
    target: { targetType: "support-ticket", targetId: id },
    reason,
    req,
  });

  return NextResponse.json({ ok: true });
}


