import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { requireSameOrigin } from "@/lib/security/origin";
import { rateLimit } from "@/lib/security/rateLimit";
import { withRequestLogging } from "@/lib/security/requestLog";
import { prisma } from "@/lib/db/prisma";
import { meterRun } from "@/lib/compute/metering";
import { createCreditUsageEvent, enforceCreditExpiry } from "@/lib/credits/store";

const DISABLED = process.env.CREDITS_METERING_ENABLED === "false";

function bad(message: string, status = 400) {
  return NextResponse.json({ message }, { status });
}

export async function POST(req: Request) {
  return withRequestLogging(req, { route: "POST /api/credits/consume" }, async () => {
    if (DISABLED) return bad("Credits metering is disabled right now.", 503);

    const originBlock = requireSameOrigin(req);
    if (originBlock) return originBlock;

    const limited = rateLimit(req, { keyPrefix: "credits-consume", limit: 30, windowMs: 60_000 });
    if (limited) return limited;

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return bad("Unauthorized", 401);

    const body = (await req.json().catch(() => null)) as any;
    const toolId = typeof body?.toolId === "string" ? body.toolId.trim().slice(0, 80) : "";
    const inputBytes = typeof body?.inputBytes === "number" ? body.inputBytes : Number(body?.inputBytes || 0);
    const durationMs = typeof body?.durationMs === "number" ? body.durationMs : Number(body?.durationMs || 0);
    const featureFlags = body?.featureFlags && typeof body.featureFlags === "object" ? body.featureFlags : undefined;
    const hadPreview = Boolean(body?.hadPreview);

    if (!toolId) return bad("Missing toolId");
    if (!hadPreview) return bad("Preview required before consume", 400);
    if (!Number.isFinite(inputBytes) || inputBytes < 0) return bad("Invalid inputBytes");
    if (!Number.isFinite(durationMs) || durationMs < 0) return bad("Invalid durationMs");

    const metered = meterRun({ toolId, inputBytes, durationMs, featureFlags });

    // Free tier is always free.
    if (metered.creditsToConsume <= 0) {
      return NextResponse.json({
        ok: true,
        consumed: 0,
        remaining: null,
        metered,
      });
    }

    // Transaction: ensure no surprise overspend and return updated balance.
    const userId = session.user.id;
    await enforceCreditExpiry(userId);
    const result = await prisma.$transaction(async (tx) => {
      const credits = await tx.credits.findUnique({ where: { userId } });
      const balance = credits?.balance ?? 0;
      const expiresAt = credits?.expiresAt ?? null;
      if (expiresAt && expiresAt.getTime() <= Date.now()) {
        return { ok: false as const, balance: 0, metered };
      }

      if (balance < metered.creditsToConsume) {
        return { ok: false as const, balance, metered };
      }

      const updated = await tx.credits.upsert({
        where: { userId },
        update: { balance: balance - metered.creditsToConsume },
        create: { userId, balance: Math.max(0, balance - metered.creditsToConsume) },
      });

      return { ok: true as const, balance: updated.balance, metered };
    });

    if (!result.ok) {
      return NextResponse.json(
        {
          message: "Insufficient credits for the paid portion of this run. Reduce input size or disable expensive options.",
          metered: result.metered,
          remaining: result.balance,
        },
        { status: 402 }
      );
    }

    // Best-effort usage log (non-blocking for the client response).
    createCreditUsageEvent({
      userId,
      toolId: metered.toolId,
      consumed: metered.creditsToConsume,
      units: metered.units,
      freeUnits: metered.freeUnitsUsed,
      paidUnits: metered.paidUnitsUsed,
    }).catch(() => null);

    return NextResponse.json({
      ok: true,
      consumed: metered.creditsToConsume,
      remaining: result.balance,
      metered,
    });
  });
}


