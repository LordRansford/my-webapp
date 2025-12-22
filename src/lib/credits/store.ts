import { prisma } from "@/lib/db/prisma";

const CREDIT_EXPIRY_DAYS = 30;

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


