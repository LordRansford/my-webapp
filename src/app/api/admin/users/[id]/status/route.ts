import { NextResponse } from "next/server";
import { requireSameOrigin } from "@/lib/security/origin";
import { requireAdminJson } from "@/lib/security/adminAuth";
import { rateLimit } from "@/lib/security/rateLimit";
import { getUserAdminSafe, setUserAccountStatus } from "@/lib/admin/usersStore";
import { logAdminAction } from "@/lib/admin/audit";

function parseStatus(value: unknown): "active" | "suspended" | "pending" | null {
  if (value === "active" || value === "suspended" || value === "pending") return value;
  return null;
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const originBlock = requireSameOrigin(req);
  if (originBlock) return originBlock;

  const auth = await requireAdminJson("MANAGE_USERS");
  if (!auth.ok) return auth.response;
  const admin = auth.session?.user;
  if (!admin?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const keySuffix = admin.email || admin.id;
  const limited = rateLimit(req, { keyPrefix: "admin-user-status", limit: 20, windowMs: 60_000, keySuffix });
  if (limited) return limited;

  const { id } = await ctx.params;
  if (id === admin.id) return NextResponse.json({ error: "You cannot suspend your own account" }, { status: 400 });

  const target = await getUserAdminSafe(id);
  if (!target) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = (await req.json().catch(() => ({}))) as any;
  const reason = String(body.reason || "").trim();
  if (!reason) return NextResponse.json({ error: "reason required" }, { status: 400 });
  const status = parseStatus(body.status);
  if (!status) return NextResponse.json({ error: "invalid status" }, { status: 400 });

  await setUserAccountStatus(id, status);

  await logAdminAction({
    adminUser: { id: admin.id, email: admin.email || null },
    adminRole: auth.role,
    actionType: "MANAGE_USER_STATUS",
    target: { targetType: "user", targetId: id },
    reason,
    req,
  });

  return NextResponse.json({ ok: true });
}


