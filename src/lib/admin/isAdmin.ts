export const ADMIN_EMAIL = "sageransity@icloud.com";

export function isAdmin(user?: { email?: string | null } | null) {
  // Backward-compatible helper. Prefer RBAC via getAdminRole() for new code.
  const email = (user?.email || "").trim().toLowerCase();
  if (!email) return false;
  if (email === ADMIN_EMAIL.toLowerCase()) return true;
  const owners = (process.env.ADMIN_OWNER_EMAILS || "").toLowerCase();
  const admins = (process.env.ADMIN_ADMIN_EMAILS || "").toLowerCase();
  const support = (process.env.ADMIN_SUPPORT_EMAILS || "").toLowerCase();
  const readOnly = (process.env.ADMIN_READ_ONLY_EMAILS || "").toLowerCase();
  return [owners, admins, support, readOnly].some((list) => list.split(",").map((s) => s.trim()).includes(email));
}


