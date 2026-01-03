import { NextResponse } from "next/server";
import { requireSameOrigin } from "@/lib/security/origin";
import { requireAdminJson } from "@/lib/security/adminAuth";
import { rateLimit } from "@/lib/security/rateLimit";
import { grantCredits } from "@/lib/credits/store";
import { logAdminAction } from "@/lib/admin/audit";

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const originBlock = requireSameOrigin(req);
  if (originBlock) return originBlock;

  const auth = await requireAdminJson("MANAGE_BILLING");
  if (!auth.ok) return auth.response;
  const admin = auth.session?.user;
  if (!admin?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const keySuffix = admin.email || admin.id;
  const limited = rateLimit(req, { keyPrefix: "admin-user-grant-credits", limit: 20, windowMs: 60_000, keySuffix });
  if (limited) return limited;

  const { id } = await ctx.params;
  const body = (await req.json().catch(() => null)) as any;
  const credits = Math.max(0, Math.round(Number(body?.credits) || 0));
  const reason = String(body?.reason || "").trim();

  if (!reason) return NextResponse.json({ error: "reason required" }, { status: 400 });
  if (!credits || credits > 50_000) return NextResponse.json({ error: "invalid credits" }, { status: 400 });

  const result = await grantCredits({ userId: id, credits, source: "admin_grant" });
  if (!result.ok) return NextResponse.json({ error: "grant failed" }, { status: 400 });

  await logAdminAction({
    adminUser: { id: admin.id, email: admin.email || null },
    adminRole: auth.role,
    actionType: "GRANT_CREDITS",
    target: { targetType: "user", targetId: id },
    reason,
    req,
  }).catch(() => null);

  return NextResponse.json({ ok: true, balance: result.balance }, { status: 200 });
}

