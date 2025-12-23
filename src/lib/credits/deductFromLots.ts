import { prisma } from "@/lib/db/prisma";

export async function deductCreditsFromLots(params: { userId: string; credits: number }) {
  const creditsToDeduct = Math.max(0, Math.round(Number(params.credits) || 0));
  if (!creditsToDeduct) return { ok: true as const, remainingBalance: null as number | null };

  return prisma.$transaction(async (tx) => {
    const userId = params.userId;
    const creditsRow = await tx.credits.findUnique({ where: { userId } });
    const balance = creditsRow?.balance ?? 0;
    if (balance < creditsToDeduct) {
      return { ok: false as const, remainingBalance: balance };
    }

    // Prefer earliest expiry first, then oldest purchasedAt.
    const lots = await tx.creditLot.findMany({
      where: {
        userId,
        OR: [{ remainingCredits: { gt: 0 } }, { remainingCredits: 0, credits: { gt: 0 } }],
      },
      orderBy: [{ expiresAt: "asc" }, { purchasedAt: "asc" }, { createdAt: "asc" }],
      take: 200,
    });

    let remaining = creditsToDeduct;
    for (const lot of lots) {
      if (remaining <= 0) break;
      const available = Math.max(0, lot.remainingCredits || lot.credits || 0);
      if (!available) continue;
      const take = Math.min(available, remaining);
      remaining -= take;
      await tx.creditLot.update({
        where: { id: lot.id },
        data: {
          remainingCredits: Math.max(0, available - take),
          amountCredits: lot.amountCredits && lot.amountCredits > 0 ? lot.amountCredits : lot.credits,
        },
      });
    }

    if (remaining > 0) {
      return { ok: false as const, remainingBalance: balance };
    }

    const updated = await tx.credits.update({
      where: { userId },
      data: { balance: balance - creditsToDeduct },
    });

    return { ok: true as const, remainingBalance: updated.balance };
  });
}


