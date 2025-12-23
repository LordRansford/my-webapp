import crypto from "node:crypto";

export function getDayUtc(d = new Date()) {
  return d.toISOString().slice(0, 10);
}

export function hashAnonKey(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export function anonKeyFromRequest(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0]?.trim() || req.headers.get("x-real-ip") || "";
  const ua = req.headers.get("user-agent") || "";
  if (!ip) return null;
  return hashAnonKey(`${ip}|${ua}`.slice(0, 400));
}


