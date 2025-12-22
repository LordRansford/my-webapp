import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { rateLimit } from "@/lib/security/rateLimit";
import { requireSameOrigin } from "@/lib/security/origin";
import { withRequestLogging } from "@/lib/security/requestLog";
import { enforceCreditExpiry, getOrCreateCredits, getCreditsAggregate, listCreditUsage } from "@/lib/credits/store";
import { isAdmin } from "@/lib/admin/isAdmin";

export async function GET(req: Request) {
  return withRequestLogging(req, { route: "GET /api/credits/status" }, async () => {
    const originBlock = requireSameOrigin(req);
    if (originBlock) return originBlock;

    const limited = rateLimit(req, { keyPrefix: "credits-status", limit: 30, windowMs: 60_000 });
    if (limited) return limited;

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    await getOrCreateCredits(session.user.id);
    const credits = await enforceCreditExpiry(session.user.id);
    const result: any = { balance: credits?.balance ?? 0, expiresAt: credits?.expiresAt ?? null, updatedAt: credits?.updatedAt ?? null };

    // Lightweight history for signed-in users (read-only view).
    result.usage = await listCreditUsage(session.user.id, 25).catch(() => []);

    if (isAdmin(session.user)) {
      result.aggregate = await getCreditsAggregate();
    }

    return NextResponse.json(result);
  });
}


