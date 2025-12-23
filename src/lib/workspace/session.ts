import crypto from "node:crypto";
import { prisma } from "@/lib/db/prisma";

const COOKIE_NAME = "workspace_session";

function getSecret() {
  return (
    process.env.WORKSPACE_COOKIE_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "dev-workspace-secret-change-me"
  );
}

function hmac(value: string) {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("hex");
}

export function signWorkspaceToken(raw: string) {
  const sig = hmac(raw);
  return `${raw}.${sig}`;
}

export function verifyWorkspaceToken(signed: string) {
  const parts = String(signed || "").split(".");
  if (parts.length !== 2) return null;
  const [raw, sig] = parts;
  if (!raw || !sig) return null;
  const expected = hmac(raw);
  try {
    const a = Buffer.from(sig, "hex");
    const b = Buffer.from(expected, "hex");
    if (a.length !== b.length) return null;
    return crypto.timingSafeEqual(a, b) ? raw : null;
  } catch {
    return null;
  }
}

export function hashToken(raw: string) {
  return crypto.createHash("sha256").update(raw).digest("hex");
}

export async function getOrCreateWorkspaceSession(params: { tokenRaw: string }) {
  const tokenHash = hashToken(params.tokenRaw);
  const sessionModel = (prisma as any).workspaceSession as {
    upsert: (args: any) => Promise<any>;
  };
  return sessionModel.upsert({
    where: { tokenHash },
    create: { tokenHash },
    update: { updatedAt: new Date() },
  });
}

export function newWorkspaceTokenRaw() {
  return crypto.randomUUID();
}

export const WORKSPACE_COOKIE = {
  name: COOKIE_NAME,
  maxAgeSeconds: 60 * 60 * 24 * 60, // 60 days
};


