import { prisma } from "@/lib/db/prisma";

const DEFAULT_CREDIT_EXPIRY_DAYS = 365 * 2; // 24 months (recommended default)
const CREDIT_EXPIRY_DAYS = (() => {
  const raw = process.env.CREDITS_EXPIRY_DAYS;
  const n = raw ? Number(raw) : NaN;
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : DEFAULT_CREDIT_EXPIRY_DAYS;
})();

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export async function getOrCreateCredits(userId: string) {
  const existing = await prisma.credits.findUnique({ where: { userId } });
  if (existing) return existing;
  return await prisma.credits.create({ data: { userId, balance: 0, expiresAt: null } });
}

export async function getCreditsAggregate() {
  const totalUsersWithCredits = await prisma.credits.count();
  const sum = await prisma.credits.aggregate({ _sum: { balance: true } });
  return {
    totalUsersWithCredits,
    totalCredits: sum._sum.balance ?? 0,
  };
}

export async function enforceCreditExpiry(userId: string) {
  const credits = await prisma.credits.findUnique({ where: { userId } });
  if (!credits) return null;
  if (!credits.expiresAt) return credits;
  const now = new Date();
  if (credits.expiresAt.getTime() > now.getTime()) return credits;
  // Expired: reset to zero but keep record.
  return await prisma.credits.update({ where: { userId }, data: { balance: 0 } });
}

export async function createCreditUsageEvent(input: {
  userId: string;
  toolId: string;
  consumed: number;
  units: number;
  freeUnits: number;
  paidUnits: number;
}) {
  return prisma.creditUsageEvent.create({
    data: {
      userId: input.userId,
      toolId: input.toolId,
      consumed: input.consumed,
      units: input.units,
      freeUnits: input.freeUnits,
      paidUnits: input.paidUnits,
    },
  });
}

export async function listCreditUsage(userId: string, limit = 50) {
  return prisma.creditUsageEvent.findMany({
    where: { userId },
    orderBy: { occurredAt: "desc" },
    take: Math.max(1, Math.min(200, limit)),
  });
}

export function computeNewExpiry(from = new Date()) {
  return addDays(from, CREDIT_EXPIRY_DAYS);
}

export async function createCreditLot(input: {
  userId: string;
  credits: number;
  source: string;
  stripeEventId?: string | null;
  stripePriceId?: string | null;
  expiresAt?: Date | null;
}) {
  return prisma.creditLot.create({
    data: {
      userId: input.userId,
      credits: Math.max(0, Math.round(Number(input.credits) || 0)),
      source: input.source,
      stripeEventId: input.stripeEventId || null,
      stripePriceId: input.stripePriceId || null,
      expiresAt: input.expiresAt || null,
    },
  });
}

export async function grantCredits(input: {
  userId: string;
  credits: number;
  source: string;
  stripeEventId?: string | null;
  stripePriceId?: string | null;
}) {
  const creditsToAdd = Math.max(0, Math.round(Number(input.credits) || 0));
  if (!creditsToAdd) return { ok: false as const, balance: null as number | null };

  const expiresAt = computeNewExpiry(new Date());

  const result = await prisma.$transaction(async (tx) => {
    const current = await tx.credits.findUnique({ where: { userId: input.userId } });
    const currentBalance = current?.balance ?? 0;
    const nextBalance = currentBalance + creditsToAdd;

    const updated = await tx.credits.upsert({
      where: { userId: input.userId },
      update: {
        balance: nextBalance,
        // Keep the furthest expiry (simple model; lots are for audit trail).
        expiresAt: current?.expiresAt && current.expiresAt > expiresAt ? current.expiresAt : expiresAt,
      },
      create: {
        userId: input.userId,
        balance: nextBalance,
        expiresAt,
      },
    });

    await tx.creditLot.create({
      data: {
        userId: input.userId,
        credits: creditsToAdd,
        source: input.source,
        stripeEventId: input.stripeEventId || null,
        stripePriceId: input.stripePriceId || null,
        expiresAt,
      },
    });

    return { ok: true as const, balance: updated.balance };
  });

  return result;
}


