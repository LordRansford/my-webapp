import { prisma } from "@/lib/db/prisma";
import type { AdminRole } from "@/lib/admin/rbac";

export type AdminAuditTarget = {
  targetType: string;
  targetId?: string | null;
};

export type LogAdminActionInput = {
  adminUser: { id: string; email?: string | null };
  adminRole: AdminRole;
  actionType: string;
  target: AdminAuditTarget;
  reason: string;
  req?: Request;
};

function truncate(value: string, max: number) {
  if (value.length <= max) return value;
  return value.slice(0, max);
}

function getIp(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for") || "";
  const ip = forwarded.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "";
  return ip || null;
}

/**
 * Append-only admin audit log.
 * - Never delete or edit rows.
 * - Reason is required so actions remain explainable later.
 * - Avoid logging sensitive payloads. Log metadata only.
 */
export async function logAdminAction(input: LogAdminActionInput) {
  const reason = (input.reason || "").trim();
  if (!reason) throw new Error("ADMIN_AUDIT_REASON_REQUIRED");

  const ua = input.req ? input.req.headers.get("user-agent") || "" : "";
  const record = {
    adminUserId: input.adminUser.id,
    adminRole: input.adminRole,
    actionType: input.actionType,
    targetType: input.target.targetType,
    targetId: input.target.targetId || null,
    reason,
    ipAddress: input.req ? getIp(input.req) : null,
    userAgent: ua ? truncate(ua, 160) : null,
    // timestamp handled by Prisma default
  };

  // Prisma client types can lag in some environments (e.g., CI/Vercel cache).
  // Keep this call safe by going through `any`.
  await (prisma as any).adminAuditLog.create({ data: record });
}


