import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { requireAdminPermission, type AdminPermission } from "@/lib/admin/rbac";

export async function requireAdminJson(permission: AdminPermission = "VIEW_SYSTEM") {
  const session = await getServerSession(authOptions).catch(() => null);
  if (!session?.user) {
    return { ok: false as const, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  try {
    const { role } = requireAdminPermission(session.user, permission);
    return { ok: true as const, session, role };
  } catch (err: any) {
    const status = typeof err?.status === "number" ? err.status : 403;
    return { ok: false as const, response: NextResponse.json({ error: "Forbidden" }, { status }) };
  }
}


