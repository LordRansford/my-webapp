import crypto from "node:crypto";
import { prisma } from "@/lib/db/prisma";
import { FREE_TIER_MS_PER_DAY } from "@/lib/billing/creditsConfig";

function startOfDayUtc(d = new Date()) {
  const x = new Date(d);
  x.setUTCHours(0, 0, 0, 0);
  return x;
}

export async function getUserFreeMsUsedToday(userId: string): Promise<number> {
  const since = startOfDayUtc();
  const rows = await prisma.creditUsageEvent.findMany({
    where: { userId, occurredAt: { gte: since } },
    select: { freeTierAppliedMs: true },
    take: 10_000,
  });
  return rows.reduce((sum, r) => sum + (Number(r.freeTierAppliedMs) || 0), 0);
}

export async function getUserFreeMsRemainingToday(userId: string): Promise<number> {
  const used = await getUserFreeMsUsedToday(userId);
  return Math.max(0, FREE_TIER_MS_PER_DAY - used);
}

// Anonymous free tier tracker: in-memory, ephemeral, TTL.
type Bucket = { usedMs: number; resetAt: number };
const anonBuckets = new Map<string, Bucket>();

function hash(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex").slice(0, 24);
}

export function getAnonKey(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for") || "";
  const ip = forwarded.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  const ua = req.headers.get("user-agent") || "unknown";
  return hash(`${ip}|${ua}`);
}

export function getAnonFreeMsRemainingToday(req: Request): number {
  const now = Date.now();
  const key = getAnonKey(req);
  const dayReset = startOfDayUtc(new Date(now + 24 * 60 * 60 * 1000)).getTime(); // next UTC midnight
  const existing = anonBuckets.get(key);
  if (!existing || existing.resetAt <= now) {
    anonBuckets.set(key, { usedMs: 0, resetAt: dayReset });
    return FREE_TIER_MS_PER_DAY;
  }
  return Math.max(0, FREE_TIER_MS_PER_DAY - existing.usedMs);
}

export function addAnonUsageMs(req: Request, durationMs: number) {
  const now = Date.now();
  const key = getAnonKey(req);
  const dayReset = startOfDayUtc(new Date(now + 24 * 60 * 60 * 1000)).getTime();
  const existing = anonBuckets.get(key);
  if (!existing || existing.resetAt <= now) {
    anonBuckets.set(key, { usedMs: Math.max(0, Math.round(durationMs)), resetAt: dayReset });
    return;
  }
  existing.usedMs += Math.max(0, Math.round(durationMs));
}


