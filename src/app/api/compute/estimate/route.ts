import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { requireSameOrigin } from "@/lib/security/origin";
import { rateLimit } from "@/lib/security/rateLimit";
import { withRequestLogging } from "@/lib/security/requestLog";
import { estimateRunCost, type ComplexityPreset } from "@/lib/billing/estimateRunCost";
import { getToolComputeProfile } from "@/config/computeLimits";

type Body = {
  toolId?: string;
  inputBytes?: number;
  requestedComplexityPreset?: ComplexityPreset;
};

function clampInt(n: unknown, min: number, max: number) {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v)) return min;
  return Math.max(min, Math.min(max, Math.round(v)));
}

function buildResponse(estimate: any) {
  const estimatedWallTimeMs = clampInt(estimate?.estimatedDurationMs, 0, 1_000_000_000);
  const freeTierRemainingMs = clampInt(estimate?.freeTierRemainingMs, 0, 1_000_000_000);
  const freeTierAppliedMs = Math.min(estimatedWallTimeMs, freeTierRemainingMs);
  const paidMs = Math.max(0, estimatedWallTimeMs - freeTierAppliedMs);
  const estimatedCreditCost = clampInt(estimate?.estimatedCredits, 0, 1_000_000_000);
  const allowed = Boolean(estimate?.allowed);
  const reason = typeof estimate?.reason === "string" ? estimate.reason : null;
  const reasons = reason ? [reason] : [];

  return {
    ok: true,
    allowed,
    estimatedCpuMs: estimatedWallTimeMs, // simple mapping for now
    estimatedWallTimeMs,
    estimatedCreditCost,
    freeTierAppliedMs,
    paidMs,
    freeTierRemainingMs,
    willChargeCredits: Boolean(estimate?.willChargeCredits),
    requiredCreditsIfAny: clampInt(estimate?.requiredCreditsIfAny, 0, 1_000_000_000),
    reasons,
  };
}

export async function POST(req: Request) {
  return withRequestLogging(req, { route: "POST /api/compute/estimate" }, async () => {
    const originBlock = requireSameOrigin(req);
    if (originBlock) return originBlock;

    const limited = rateLimit(req, { keyPrefix: "compute-estimate", limit: 90, windowMs: 60_000 });
    if (limited) return limited;

    const session = await getServerSession(authOptions).catch(() => null);
    const userId = session?.user?.id || null;

    const body = (await req.json().catch(() => null)) as Body | null;
    const toolId = typeof body?.toolId === "string" ? body.toolId.trim().slice(0, 80) : "";
    const inputBytes = clampInt(body?.inputBytes, 0, 25_000_000);
    const requestedComplexityPreset = (body?.requestedComplexityPreset || "standard") as ComplexityPreset;
    if (!toolId) return NextResponse.json({ ok: false, error: "Missing toolId" }, { status: 400 });

    const profile = getToolComputeProfile(toolId);
    const costHints = Array.isArray(profile?.guidance) ? profile.guidance.slice(0, 6) : [];

    const estimate = await estimateRunCost({
      req,
      userId,
      toolId,
      inputBytes,
      requestedComplexityPreset,
    });

    // If blocked, compute an alternative "light" estimate to offer a free-tier attempt.
    const alt =
      estimate?.allowed || requestedComplexityPreset === "light"
        ? null
        : await estimateRunCost({
            req,
            userId,
            toolId,
            inputBytes,
            requestedComplexityPreset: "light",
          });

    return NextResponse.json(
      {
        ...buildResponse(estimate),
        requestedComplexityPreset,
        alternativeFreeTier: alt ? { ...buildResponse(alt), requestedComplexityPreset: "light" } : null,
        costHints,
      },
      { status: 200 }
    );
  });
}


