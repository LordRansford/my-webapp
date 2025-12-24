export type AuthEnvStatus = {
  ok: boolean;
  missing: string[];
};

export function getAuthEnvStatus(): AuthEnvStatus {
  const missing: string[] = [];

  // NextAuth v4 canonical env names.
  if (!process.env.NEXTAUTH_URL) missing.push("NEXTAUTH_URL");
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


