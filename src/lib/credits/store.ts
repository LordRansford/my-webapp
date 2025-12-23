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
  runId?: string | null;
  baseFree?: boolean;
  estimatedCredits?: number;
  actualCredits?: number;
  meteringUnit?: string;
  durationMs?: number;
  inputBytes?: number;
  outputBytes?: number;
  freeTierAppliedMs?: number;
  paidMs?: number;
}) {
  return prisma.creditUsageEvent.create({
    data: {
      userId: input.userId,
      toolId: input.toolId,
      consumed: input.consumed,
      units: input.units,
      freeUnits: input.freeUnits,
      paidUnits: input.paidUnits,
      runId: input.runId || null,
      baseFree: Boolean(input.baseFree),
      estimatedCredits: Math.max(0, Math.round(Number(input.estimatedCredits) || 0)),
      actualCredits: Math.max(0, Math.round(Number(input.actualCredits) || 0)),
      meteringUnit: input.meteringUnit || "ms",
      durationMs: Math.max(0, Math.round(Number(input.durationMs) || 0)),
      inputBytes: Math.max(0, Math.round(Number(input.inputBytes) || 0)),
      outputBytes: Math.max(0, Math.round(Number(input.outputBytes) || 0)),
      freeTierAppliedMs: Math.max(0, Math.round(Number(input.freeTierAppliedMs) || 0)),
      paidMs: Math.max(0, Math.round(Number(input.paidMs) || 0)),
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
  stripeCheckoutSessionId?: string | null;
  stripePaymentIntentId?: string | null;
  expiresAt?: Date | null;
}) {
  const credits = Math.max(0, Math.round(Number(input.credits) || 0));
  return prisma.creditLot.create({
    data: {
      userId: input.userId,
      credits,
      amountCredits: credits,
      remainingCredits: credits,
      source: input.source,
      stripeEventId: input.stripeEventId || null,
      stripePriceId: input.stripePriceId || null,
      stripeCheckoutSessionId: input.stripeCheckoutSessionId || null,
      stripePaymentIntentId: input.stripePaymentIntentId || null,
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
  stripeCheckoutSessionId?: string | null;
  stripePaymentIntentId?: string | null;
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
        amountCredits: creditsToAdd,
        remainingCredits: creditsToAdd,
        source: input.source,
        stripeEventId: input.stripeEventId || null,
        stripePriceId: input.stripePriceId || null,
        stripeCheckoutSessionId: input.stripeCheckoutSessionId || null,
        stripePaymentIntentId: input.stripePaymentIntentId || null,
        expiresAt,
      },
    });

    return { ok: true as const, balance: updated.balance };
  });

  return result;
}


