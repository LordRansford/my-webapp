import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { rateLimit } from "@/lib/security/rateLimit";
import { requireSameOrigin } from "@/lib/security/origin";
import { withRequestLogging } from "@/lib/security/requestLog";
import { getOrCreateCredits, getCreditsAggregate } from "@/lib/credits/store";
import { isAdmin } from "@/lib/admin/isAdmin";

export async function GET(req: Request) {
  return withRequestLogging(req, { route: "GET /api/credits/status" }, async () => {
    const originBlock = requireSameOrigin(req);
    if (originBlock) return originBlock;

    const limited = rateLimit(req, { keyPrefix: "credits-status", limit: 30, windowMs: 60_000 });
    if (limited) return limited;

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const credits = await getOrCreateCredits(session.user.id);
    const result: any = { balance: credits.balance, updatedAt: credits.updatedAt };

    if (isAdmin(session.user)) {
      result.aggregate = await getCreditsAggregate();
    }

    return NextResponse.json(result);
  });
}


