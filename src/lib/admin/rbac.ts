export const ADMIN_ROLES = ["OWNER", "ADMIN", "SUPPORT", "READ_ONLY"] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

export function isAdminRole(value: unknown): value is AdminRole {
  return typeof value === "string" && (ADMIN_ROLES as readonly string[]).includes(value);
}

export const ADMIN_PERMISSIONS = [
  "VIEW_USERS",
  "MANAGE_USERS",
  "VIEW_SUPPORT",
  "MANAGE_SUPPORT",
  "VIEW_BILLING",
  "MANAGE_BILLING",
  "VIEW_SYSTEM",
  "MANAGE_SYSTEM",
] as const;

export type AdminPermission = (typeof ADMIN_PERMISSIONS)[number];

type RolePermissions = Record<AdminRole, readonly AdminPermission[]>;

export const ROLE_PERMISSIONS: RolePermissions = {
  OWNER: ADMIN_PERMISSIONS,
  ADMIN: ["VIEW_USERS", "MANAGE_USERS", "VIEW_SUPPORT", "MANAGE_SUPPORT", "VIEW_BILLING", "VIEW_SYSTEM", "MANAGE_SYSTEM"],
  SUPPORT: ["VIEW_USERS", "VIEW_SUPPORT", "MANAGE_SUPPORT", "VIEW_SYSTEM"],
  READ_ONLY: ["VIEW_USERS", "VIEW_SUPPORT", "VIEW_BILLING", "VIEW_SYSTEM"],
} as const;

function parseEmailList(raw: string | undefined) {
  return (raw || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function getAdminRole(user?: { email?: string | null } | null): AdminRole | null {
  const explicitRole = (user as any)?.adminRole;
  if (isAdminRole(explicitRole)) return explicitRole;

  const email = (user?.email || "").trim().toLowerCase();
  if (!email) return null;

  // Environment-based role mapping (extensible, no client exposure).
  // Comma-separated lists:
  // - ADMIN_OWNER_EMAILS
  // - ADMIN_ADMIN_EMAILS
  // - ADMIN_SUPPORT_EMAILS
  // - ADMIN_READ_ONLY_EMAILS
  const owners = parseEmailList(process.env.ADMIN_OWNER_EMAILS);
  const admins = parseEmailList(process.env.ADMIN_ADMIN_EMAILS);
  const support = parseEmailList(process.env.ADMIN_SUPPORT_EMAILS);
  const readOnly = parseEmailList(process.env.ADMIN_READ_ONLY_EMAILS);

  if (owners.includes(email)) return "OWNER";
  if (admins.includes(email)) return "ADMIN";
  if (support.includes(email)) return "SUPPORT";
  if (readOnly.includes(email)) return "READ_ONLY";

  // Backward-compatible escape hatch for early deployments.
  const legacyOwner = (process.env.ADMIN_EMAIL || "sageransity@icloud.com").trim().toLowerCase();
  if (email === legacyOwner) return "OWNER";

  return null;
}

export function hasPermission(role: AdminRole, permission: AdminPermission) {
  const perms = ROLE_PERMISSIONS[role] || [];
  return perms.includes(permission);
}

export class AdminPermissionError extends Error {
  status = 403 as const;
  code = "ADMIN_FORBIDDEN" as const;
  constructor(message = "Access denied") {
    super(message);
  }
}

/**
 * Server-side RBAC gate.
 * Fail closed: if role is missing or permission is not granted, throw.
 *
 * Step-up auth placeholder:
 * - In future, enforce recent authentication or additional verification here (MFA).
 * - For now, this is intentionally a stub to avoid refactors later.
 */
export function requireAdminPermission(
  user: { id?: string | null; email?: string | null } | null | undefined,
  permission: AdminPermission
) {
  const role = getAdminRole(user);
  if (!role) throw new AdminPermissionError("Access denied");
  if (!hasPermission(role, permission)) throw new AdminPermissionError("Access denied");

  // Step-up auth placeholder:
  // if (permission === "MANAGE_BILLING") { enforceStepUp(user) }

  return { role };
}


