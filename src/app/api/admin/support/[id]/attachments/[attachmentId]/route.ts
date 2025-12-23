import { NextResponse } from "next/server";
import { requireAdminJson } from "@/lib/security/adminAuth";
import { rateLimit } from "@/lib/security/rateLimit";
import { getSupportTicketAdminSafe } from "@/lib/admin/supportStore";

/**
 * Secure attachment download route.
 *
 * Safety posture (foundation-only):
 * - Supports screenshots only (enforced at upload time in future prompt).
 * - No inline rendering here. Return as attachment when storage is wired.
 * - For now we only store metadata and return a clear error if no storage key exists.
 */
export async function GET(req: Request, ctx: { params: Promise<{ id: string; attachmentId: string }> }) {
  const auth = await requireAdminJson("VIEW_SUPPORT");
  if (!auth.ok) return auth.response;
  const user = auth.session?.user;
  if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const keySuffix = user.email || user.id;
  const limited = rateLimit(req, { keyPrefix: "admin-support-attachment", limit: 60, windowMs: 60_000, keySuffix });
  if (limited) return limited;

  const { id, attachmentId } = await ctx.params;
  const ticket = await getSupportTicketAdminSafe(id);
  if (!ticket) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const att = ticket.attachments.find((a) => a.id === attachmentId);
  if (!att) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!att.storageKey) {
    return NextResponse.json({ error: "Attachment storage is not configured for this environment." }, { status: 501 });
  }

  // TODO: integrate with external object storage (Vercel Blob, S3, etc) and stream bytes.
  return NextResponse.json({ error: "Attachment download not implemented yet." }, { status: 501 });
}


