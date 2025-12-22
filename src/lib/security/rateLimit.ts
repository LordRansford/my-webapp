import { NextResponse } from "next/server";
import crypto from "crypto";

type Options = {
  keyPrefix: string;
  limit: number;
  windowMs: number;
  keySuffix?: string;
  message?: string;
};

type Entry = { count: number; resetAt: number };

const buckets = new Map<string, Entry>();

function hash(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex").slice(0, 24);
}

function getClientKey(req: Request, keySuffix?: string) {
  // Privacy: we do not persist IPs; we only keep a short-lived hash in memory.
  const forwarded = req.headers.get("x-forwarded-for") || "";
  const ip = forwarded.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  const ua = req.headers.get("user-agent") || "unknown";
  return hash(`${ip}|${ua}|${keySuffix || ""}`);
}

export function rateLimit(req: Request, opts: Options) {
  const now = Date.now();
  const key = `${opts.keyPrefix}:${getClientKey(req, opts.keySuffix)}`;
  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + opts.windowMs });
    return null;
  }
  existing.count += 1;
  if (existing.count > opts.limit) {
    const retryAfter = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
    return NextResponse.json(
      { error: opts.message || "Too many requests. Please try again shortly." },
      { status: 429, headers: { "retry-after": String(retryAfter) } }
    );
  }
  return null;
}


