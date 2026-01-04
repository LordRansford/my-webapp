import crypto from "node:crypto";

export type PackTokenPayload = {
  packId: string;
  exp: number; // unix ms
};

function b64urlEncode(input: string) {
  return Buffer.from(input, "utf8").toString("base64url");
}

function b64urlDecode(input: string) {
  return Buffer.from(input, "base64url").toString("utf8");
}

function getShareSecret(): string {
  // Prefer a dedicated secret, but fall back to NEXTAUTH_SECRET if present.
  const secret = process.env.SHARE_PACK_SECRET || process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("Missing SHARE_PACK_SECRET (or NEXTAUTH_SECRET).");
  }
  return secret;
}

function sign(payloadB64: string): string {
  const secret = getShareSecret();
  return crypto.createHmac("sha256", secret).update(payloadB64).digest("base64url");
}

export function createPackToken(params: { packId: string; expiresAt: number }): string {
  const payload: PackTokenPayload = { packId: params.packId, exp: params.expiresAt };
  const payloadB64 = b64urlEncode(JSON.stringify(payload));
  const sig = sign(payloadB64);
  return `${payloadB64}.${sig}`;
}

export function verifyPackToken(token: string): { ok: true; payload: PackTokenPayload } | { ok: false; error: string } {
  const raw = String(token || "");
  const parts = raw.split(".");
  if (parts.length !== 2) return { ok: false, error: "Invalid token format." };
  const [payloadB64, sig] = parts;
  if (!payloadB64 || !sig) return { ok: false, error: "Invalid token." };

  const expected = sign(payloadB64);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return { ok: false, error: "Invalid token signature." };

  let parsed: any;
  try {
    parsed = JSON.parse(b64urlDecode(payloadB64));
  } catch {
    return { ok: false, error: "Invalid token payload." };
  }

  const packId = typeof parsed?.packId === "string" ? parsed.packId : "";
  const exp = typeof parsed?.exp === "number" ? parsed.exp : 0;
  if (!packId || !Number.isFinite(exp) || exp <= 0) return { ok: false, error: "Invalid token payload." };
  if (Date.now() > exp) return { ok: false, error: "This share link has expired." };

  return { ok: true, payload: { packId, exp } };
}

export function packPathnames(packId: string) {
  const safe = String(packId).replace(/[^a-zA-Z0-9_-]/g, "");
  return {
    zip: `share/packs/${safe}.zip`,
    meta: `share/packs/${safe}.json`,
  };
}

