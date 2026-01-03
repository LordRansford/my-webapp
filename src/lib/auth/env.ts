export type AuthEnvStatus = {
  ok: boolean;
  missing: string[];
};

function getBaseUrlFallback() {
  const explicit = (process.env.NEXT_PUBLIC_SITE_URL || "").trim();
  if (explicit) return explicit;
  const vercel = (process.env.VERCEL_URL || "").trim();
  if (vercel) return vercel.startsWith("http") ? vercel : `https://${vercel}`;
  return "";
}

/**
 * Best-effort compatibility:
 * - Prefer NEXTAUTH_URL (canonical).
 * - If absent, use NEXT_PUBLIC_SITE_URL or VERCEL_URL so OAuth callbacks can still work.
 */
export function ensureNextAuthUrl() {
  if (process.env.NEXTAUTH_URL) return;
  const fallback = getBaseUrlFallback();
  if (fallback) process.env.NEXTAUTH_URL = fallback;
}

export function getAuthEnvStatus(): AuthEnvStatus {
  const missing: string[] = [];

  // NextAuth v4 canonical env names.
  // Allow a fallback so production doesn't "look broken" when only NEXT_PUBLIC_SITE_URL/VERCEL_URL is set.
  // Still recommend setting NEXTAUTH_URL explicitly.
  if (!process.env.NEXTAUTH_URL && !getBaseUrlFallback()) missing.push("NEXTAUTH_URL");
  if (!process.env.NEXTAUTH_SECRET) missing.push("NEXTAUTH_SECRET");

  // Provider env vars (only required when you want sign-in enabled).
  const hasGoogle = Boolean(process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_SECRET);
  if (hasGoogle) {
    if (!process.env.GOOGLE_CLIENT_ID) missing.push("GOOGLE_CLIENT_ID");
    if (!process.env.GOOGLE_CLIENT_SECRET) missing.push("GOOGLE_CLIENT_SECRET");
  }

  // Email magic link provider (optional). Enable only when fully configured.
  const hasEmail = Boolean(process.env.EMAIL_SERVER || process.env.EMAIL_FROM);
  if (hasEmail) {
    if (!process.env.EMAIL_SERVER) missing.push("EMAIL_SERVER");
    if (!process.env.EMAIL_FROM) missing.push("EMAIL_FROM");
  }

  return { ok: missing.length === 0, missing };
}

export function logAuthEnvIfMisconfigured(context: string) {
  const status = getAuthEnvStatus();
  if (status.ok) return;
  // Server logs only. Do not print values.
  console.error(`auth:misconfigured ${context} missing=${status.missing.join(",")}`);
}


