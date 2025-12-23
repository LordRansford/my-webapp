import { NextResponse } from "next/server";
import { requireSameOrigin } from "@/lib/security/origin";
import { requireAdminJson } from "@/lib/security/adminAuth";
import { rateLimit } from "@/lib/security/rateLimit";
import { getUserAdminSafe, setUserAdminRole } from "@/lib/admin/usersStore";
import { ADMIN_ROLES, type AdminRole } from "@/lib/admin/rbac";
import { logAdminAction } from "@/lib/admin/audit";

function parseRole(value: unknown): AdminRole | null {
  if (value === null || value === "" || value === "NONE") return null;
  if (typeof value !== "string") return null;
  return (ADMIN_ROLES as readonly string[]).includes(value) ? (value as AdminRole) : null;
}

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const originBlock = requireSameOrigin(req);
  if (originBlock) return originBlock;

  const auth = await requireAdminJson("MANAGE_USERS");
  if (!auth.ok) return auth.response;
  const admin = auth.session?.user;
  if (!admin?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const keySuffix = admin.email || admin.id;
  const limited = rateLimit(req, { keyPrefix: "admin-user-role", limit: 20, windowMs: 60_000, keySuffix });
  if (limited) return limited;

  const { id } = await ctx.params;
  const target = await getUserAdminSafe(id);
  if (!target) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = (await req.json().catch(() => ({}))) as any;
  const reason = String(body.reason || "").trim();
  if (!reason) return NextResponse.json({ error: "reason required" }, { status: 400 });
  const nextRole = parseRole(body.role);
  if (body.role != null && body.role !== "NONE" && nextRole == null) return NextResponse.json({ error: "invalid role" }, { status: 400 });

  // Guardrails:
  // - OWNER cannot be downgraded by non-OWNER
  if (target.role === "OWNER" && auth.role !== "OWNER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await setUserAdminRole(id, nextRole);

  await logAdminAction({
    adminUser: { id: admin.id, email: admin.email || null },
    adminRole: auth.role,
    actionType: "MANAGE_USER_ROLE",
    target: { targetType: "user", targetId: id },
    reason,
    req,
  });

  return NextResponse.json({ ok: true });
}


