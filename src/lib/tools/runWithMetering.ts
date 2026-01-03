import crypto from "node:crypto";
import { prisma } from "@/lib/db/prisma";
import { estimateRunCost, type ComplexityPreset } from "@/lib/billing/estimateRunCost";
import { CREDIT_MS_PER_1, MAX_RUN_MS_HARD_CAP } from "@/lib/billing/creditsConfig";
import { addAnonUsageMs, getAnonFreeMsRemainingToday, getUserFreeMsRemainingToday } from "@/lib/billing/freeTier";
import { deductCreditsFromLots } from "@/lib/credits/deductFromLots";
import { createCreditUsageEvent, getOrCreateCredits } from "@/lib/credits/store";
import { getToolComputeProfile } from "@/config/computeLimits";
import type { UnifiedRunReceipt } from "@/lib/compute/receipts";

export type RunReceipt = UnifiedRunReceipt;

function nowMs() {
  return Date.now();
}

function safeInt(n: unknown) {
  const v = typeof n === "number" ? n : Number(n);
  return Number.isFinite(v) ? Math.max(0, Math.round(v)) : 0;
}

export async function runWithMetering<T>(params: {
  req: Request;
  userId: string | null;
  toolId: string;
  inputBytes: number;
  requestedComplexityPreset: ComplexityPreset;
  execute: () => Promise<{ output: T; outputBytes?: number }>;
}): Promise<{ ok: true; receipt: RunReceipt; output: T } | { ok: false; status: number; message: string; estimate: any }> {
  const runId = crypto.randomUUID();
  const toolId = String(params.toolId || "").trim();
  const inputBytes = safeInt(params.inputBytes);

  const estimate = await estimateRunCost({
    req: params.req,
    userId: params.userId,
    toolId,
    inputBytes,
    requestedComplexityPreset: params.requestedComplexityPreset,
  });

  if (!estimate.allowed) {
    return { ok: false, status: 400, message: estimate.reason || "Run not allowed", estimate };
  }

  // Establish free tier remaining at start for deterministic accounting.
  const freeTierRemainingAtStart = params.userId
    ? await getUserFreeMsRemainingToday(params.userId)
    : getAnonFreeMsRemainingToday(params.req);

  if (estimate.willChargeCredits && !params.userId) {
    return { ok: false, status: 401, message: "Sign in required for runs above the free tier.", estimate };
  }

  // Execute tool
  const start = nowMs();
  const result = await params.execute();
  const durationMs = Math.min(MAX_RUN_MS_HARD_CAP, Math.max(0, nowMs() - start));

  const outputBytes = safeInt(result.outputBytes);
  const freeTierAppliedMs = Math.min(durationMs, freeTierRemainingAtStart);
  const paidMs = Math.max(0, durationMs - freeTierAppliedMs);
  const creditsCharged = paidMs > 0 ? Math.ceil(paidMs / CREDIT_MS_PER_1) : 0;

  const profile = getToolComputeProfile(toolId);
  const guidanceTips = profile?.guidance?.slice(0, 4) || [
    "Reduce input size.",
    "Use the light preset.",
    "Limit iterations or scope.",
    "Use sampling for large datasets.",
  ];

  if (!params.userId) {
    // Anonymous: record ephemeral usage only.
    addAnonUsageMs(params.req, freeTierAppliedMs);
    const receipt: RunReceipt = {
      runId,
      toolId,
      durationMs,
      inputBytes,
      outputBytes,
      freeTierAppliedMs,
      paidMs: 0,
      creditsCharged: 0,
      remainingCredits: null,
      guidanceTips,
    };
    return { ok: true, receipt, output: result.output };
  }

  const userId = params.userId;
  await getOrCreateCredits(userId);

  let remainingCredits: number | null = null;

  // Append-only usage ledger: always write a CreditUsageEvent. Deduct credits transactionally when needed.
  if (creditsCharged > 0) {
    const deducted = await deductCreditsFromLots({ userId, credits: creditsCharged });
    if (!deducted.ok) {
      // No partial charges; treat as not allowed.
      return {
        ok: false,
        status: 402,
        message: "Insufficient credits for the paid portion. Use a lighter preset or reduce input size.",
        estimate,
      };
    }
    remainingCredits = deducted.remainingBalance;
  } else {
    const row = await prisma.credits.findUnique({ where: { userId } });
    remainingCredits = row?.balance ?? 0;
  }

  await createCreditUsageEvent({
    userId,
    toolId,
    consumed: creditsCharged,
    units: durationMs,
    freeUnits: freeTierAppliedMs,
    paidUnits: paidMs,
    runId,
    baseFree: creditsCharged === 0,
    estimatedCredits: estimate.estimatedCredits || 0,
    actualCredits: creditsCharged,
    meteringUnit: "ms",
    durationMs,
    inputBytes,
    outputBytes,
    freeTierAppliedMs,
    paidMs,
  });

  const receipt: RunReceipt = {
    runId,
    toolId,
    durationMs,
    inputBytes,
    outputBytes,
    freeTierAppliedMs,
    paidMs,
    creditsCharged,
    remainingCredits,
    guidanceTips,
  };

  return { ok: true, receipt, output: result.output };
}


