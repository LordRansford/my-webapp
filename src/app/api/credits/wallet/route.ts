import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { requireSameOrigin } from "@/lib/security/origin";
import { rateLimit } from "@/lib/security/rateLimit";
import { withRequestLogging } from "@/lib/security/requestLog";
import { prisma } from "@/lib/db/prisma";
import { enforceCreditExpiry, getOrCreateCredits } from "@/lib/credits/store";
import { getUserFreeMsRemainingToday } from "@/lib/billing/freeTier";

export async function GET(req: Request) {
  return withRequestLogging(req, { route: "GET /api/credits/wallet" }, async () => {
    const originBlock = requireSameOrigin(req);
    if (originBlock) return originBlock;

    const limited = rateLimit(req, { keyPrefix: "credits-wallet", limit: 30, windowMs: 60_000 });
    if (limited) return limited;

    const session = await getServerSession(authOptions).catch(() => null);
    const userId = session?.user?.id || "";
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await getOrCreateCredits(userId);
    const credits = await enforceCreditExpiry(userId);
    const freeTierRemainingMs = await getUserFreeMsRemainingToday(userId);

    const lots = await prisma.creditLot.findMany({
      where: { userId },
      orderBy: [{ expiresAt: "asc" }, { purchasedAt: "desc" }, { createdAt: "desc" }],
      take: 200,
    });

    const usage = await prisma.creditUsageEvent.findMany({
      where: { userId },
      orderBy: { occurredAt: "desc" },
      take: 200,
    });

    return NextResponse.json(
      {
        balance: credits?.balance ?? 0,
        expiresAt: credits?.expiresAt ?? null,
        freeTierRemainingMs,
        lots,
        usage,
      },
      { status: 200 },
    );
  });
}


