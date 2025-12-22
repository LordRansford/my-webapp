import { prisma } from "@/lib/db/prisma";

export async function getOrCreateCredits(userId: string) {
  const existing = await prisma.credits.findUnique({ where: { userId } });
  if (existing) return existing;
  return await prisma.credits.create({ data: { userId, balance: 0 } });
}

export async function getCreditsAggregate() {
  const totalUsersWithCredits = await prisma.credits.count();
  const sum = await prisma.credits.aggregate({ _sum: { balance: true } });
  return {
    totalUsersWithCredits,
    totalCredits: sum._sum.balance ?? 0,
  };
}


