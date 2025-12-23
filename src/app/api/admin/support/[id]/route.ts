import { NextResponse } from "next/server";
import { requireAdminJson } from "@/lib/security/adminAuth";
import { rateLimit } from "@/lib/security/rateLimit";
import { getSupportTicketAdminSafe } from "@/lib/admin/supportStore";
import { logAdminAction } from "@/lib/admin/audit";

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminJson("VIEW_SUPPORT");
  if (!auth.ok) return auth.response;
  const user = auth.session?.user;
  if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const keySuffix = user.email || user.id;
  const limited = rateLimit(req, { keyPrefix: "admin-support-detail", limit: 60, windowMs: 60_000, keySuffix });
  if (limited) return limited;

  const { id } = await ctx.params;
  const ticket = await getSupportTicketAdminSafe(id);
  if (!ticket) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await logAdminAction({
    adminUser: { id: user.id, email: user.email || null },
    adminRole: auth.role,
    actionType: "VIEW_SUPPORT_TICKET_DETAIL",
    target: { targetType: "support-ticket", targetId: id },
    reason: "Admin support ticket detail view",
    req,
  });

  return NextResponse.json({ ticket });
}


