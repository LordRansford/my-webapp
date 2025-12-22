export const ADMIN_EMAIL = "sageransity@icloud.com";

export function isAdmin(user?: { email?: string | null } | null) {
  const email = (user?.email || "").trim().toLowerCase();
  return email === ADMIN_EMAIL.toLowerCase();
}


