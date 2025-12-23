import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { requireSameOrigin } from "@/lib/security/origin";
import { rateLimit } from "@/lib/security/rateLimit";
import { withRequestLogging } from "@/lib/security/requestLog";
import { prisma } from "@/lib/db/prisma";
import { enforceCreditExpiry, getOrCreateCredits } from "@/lib/credits/store";

function safeStr(v: unknown, max = 80) {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function GET(req: Request) {
  return withRequestLogging(req, { route: "GET /api/compute/history" }, async () => {
    const originBlock = requireSameOrigin(req);
    if (originBlock) return originBlock;

    const limited = rateLimit(req, { keyPrefix: "compute-history", limit: 30, windowMs: 60_000 });
    if (limited) return limited;

    const session = await getServerSession(authOptions).catch(() => null);
    const userId = session?.user?.id || null;
    if (!userId) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const toolId = safeStr(searchParams.get("toolId"));

    await getOrCreateCredits(userId);
    const credits = await enforceCreditExpiry(userId);

    const jobModel = (prisma as any).job as { findMany: (args: any) => Promise<any[]> };
    const jobs = await jobModel.findMany({
      where: { userId, ...(toolId ? { toolId } : {}) },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        toolId: true,
        status: true,
        createdAt: true,
        startedAt: true,
        finishedAt: true,
        durationMs: true,
        estimatedCostCredits: true,
        chargedCredits: true,
        freeTierAppliedMs: true,
        inputBytes: true,
        errorCode: true,
        errorMessage: true,
      },
    });

    return NextResponse.json(
      {
        ok: true,
        balance: credits?.balance ?? 0,
        expiresAt: credits?.expiresAt ?? null,
        jobs,
      },
      { status: 200 }
    );
  });
}


