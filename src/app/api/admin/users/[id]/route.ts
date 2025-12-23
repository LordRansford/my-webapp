import { NextResponse } from "next/server";
import { requireAdminJson } from "@/lib/security/adminAuth";
import { rateLimit } from "@/lib/security/rateLimit";
import { getUserAdminSafe } from "@/lib/admin/usersStore";
import { logAdminAction } from "@/lib/admin/audit";

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminJson("VIEW_USERS");
  if (!auth.ok) return auth.response;
  const admin = auth.session?.user;
  if (!admin?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const keySuffix = admin.email || admin.id;
  const limited = rateLimit(req, { keyPrefix: "admin-user-detail", limit: 60, windowMs: 60_000, keySuffix });
  if (limited) return limited;

  const { id } = await ctx.params;
  const user = await getUserAdminSafe(id);
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await logAdminAction({
    adminUser: { id: admin.id, email: admin.email || null },
    adminRole: auth.role,
    actionType: "VIEW_USER_DETAIL",
    target: { targetType: "user", targetId: id },
    reason: "Admin user detail view",
    req,
  });

  return NextResponse.json({ user });
}


