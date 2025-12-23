import { NextResponse } from "next/server";
import { requireAdminJson } from "@/lib/security/adminAuth";
import { rateLimit } from "@/lib/security/rateLimit";
import { listSupportTicketsAdminSafe, type SupportStatus } from "@/lib/admin/supportStore";
import { logAdminAction } from "@/lib/admin/audit";

function parseStatus(v: string | null): SupportStatus | null {
  if (v === "open" || v === "in_progress" || v === "resolved") return v;
  return null;
}

export async function GET(req: Request) {
  const auth = await requireAdminJson("VIEW_SUPPORT");
  if (!auth.ok) return auth.response;
  const user = auth.session?.user;
  if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const keySuffix = user.email || user.id;
  const limited = rateLimit(req, { keyPrefix: "admin-support-list", limit: 30, windowMs: 60_000, keySuffix });
  if (limited) return limited;

  const url = new URL(req.url);
  const status = parseStatus(url.searchParams.get("status"));
  const category = (url.searchParams.get("category") || "").trim() || null;
  const cursor = url.searchParams.get("cursor");
  const sort = url.searchParams.get("sort") === "oldest" ? "oldest" : "newest";
  const takeRaw = Number(url.searchParams.get("take") || "20");
  const take = Number.isFinite(takeRaw) ? Math.max(5, Math.min(50, takeRaw)) : 20;

  const out = await listSupportTicketsAdminSafe({ status, category, cursor, take, sort });

  await logAdminAction({
    adminUser: { id: user.id, email: user.email || null },
    adminRole: auth.role,
    actionType: "VIEW_SUPPORT_TICKETS_LIST",
    target: { targetType: "support-ticket", targetId: null },
    reason: "Admin support inbox view",
    req,
  });

  return NextResponse.json(out);
}


