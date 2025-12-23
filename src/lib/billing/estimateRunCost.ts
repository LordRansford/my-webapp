import { prisma } from "@/lib/db/prisma";
import { getToolComputeProfile } from "@/config/computeLimits";
import {
  CREDIT_MS_PER_1,
  FREE_TIER_MS_PER_DAY,
  MAX_RUN_MS_HARD_CAP,
  MAX_UPLOAD_BYTES_FREE,
  MAX_UPLOAD_BYTES_PAID,
} from "@/lib/billing/creditsConfig";
import { getAnonFreeMsRemainingToday, getUserFreeMsRemainingToday } from "@/lib/billing/freeTier";

export type ComplexityPreset = "light" | "standard" | "heavy";

function clampInt(n: unknown, min: number, max: number) {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v)) return min;
  return Math.max(min, Math.min(max, Math.round(v)));
}

function estimateDurationMs(params: { toolId: string; inputBytes: number; preset: ComplexityPreset }) {
  const profile = getToolComputeProfile(params.toolId);
  const base = profile ? Math.max(200, profile.typicalSteps * 120) : 600;
  const inputFactor = profile ? Math.max(0.5, params.inputBytes / Math.max(1, profile.typicalInputBytes)) : Math.max(0.5, params.inputBytes / 1000);
  const presetFactor = params.preset === "light" ? 0.6 : params.preset === "heavy" ? 1.8 : 1.0;
  return clampInt(base * inputFactor * presetFactor, 50, MAX_RUN_MS_HARD_CAP);
}

export async function estimateRunCost(params: {
  req: Request;
  userId: string | null;
  toolId: string;
  inputBytes: number;
  requestedComplexityPreset: ComplexityPreset;
}) {
  const toolId = String(params.toolId || "").trim();
  const inputBytes = clampInt(params.inputBytes, 0, 25_000_000);
  const preset = params.requestedComplexityPreset;

  const estimatedDurationMs = estimateDurationMs({ toolId, inputBytes, preset });

  if (estimatedDurationMs > MAX_RUN_MS_HARD_CAP) {
    return {
      allowed: false as const,
      reason: "This run is too large for safety limits. Reduce input size or use a lighter preset.",
      estimatedDurationMs,
      estimatedCredits: 0,
      freeTierRemainingMs: 0,
      willChargeCredits: false,
      requiredCreditsIfAny: 0,
    };
  }

  const userId = params.userId;
  const freeTierRemainingMs = userId ? await getUserFreeMsRemainingToday(userId) : getAnonFreeMsRemainingToday(params.req);

  // Upload hard limits. Anonymous users get smaller cap and cannot go paid.
  const maxUpload = userId ? MAX_UPLOAD_BYTES_PAID : MAX_UPLOAD_BYTES_FREE;
  if (inputBytes > maxUpload) {
    return {
      allowed: false as const,
      reason: "Input is too large for this run. Reduce the size and try again.",
      estimatedDurationMs,
      estimatedCredits: 0,
      freeTierRemainingMs,
      willChargeCredits: false,
      requiredCreditsIfAny: 0,
    };
  }

  const paidMsEstimate = Math.max(0, estimatedDurationMs - freeTierRemainingMs);
  const estimatedCredits = paidMsEstimate > 0 ? Math.ceil(paidMsEstimate / CREDIT_MS_PER_1) : 0;
  const willChargeCredits = estimatedCredits > 0;

  if (!userId && willChargeCredits) {
    return {
      allowed: false as const,
      reason: "Sign in to run beyond the free tier. Free usage stays free.",
      estimatedDurationMs,
      estimatedCredits,
      freeTierRemainingMs,
      willChargeCredits: true,
      requiredCreditsIfAny: estimatedCredits,
    };
  }

  if (userId && willChargeCredits) {
    const creditsRow = await prisma.credits.findUnique({ where: { userId } });
    const balance = creditsRow?.balance ?? 0;

    // Safety buffer so actual runtime spikes don't cause surprise overspend.
    const buffered = Math.ceil(estimatedCredits * 1.25);
    if (balance < buffered) {
      return {
        allowed: false as const,
        reason: "Not enough credits for the expected paid portion. Use a lighter preset or reduce input size.",
        estimatedDurationMs,
        estimatedCredits,
        freeTierRemainingMs,
        willChargeCredits: true,
        requiredCreditsIfAny: buffered,
      };
    }
  }

  return {
    allowed: true as const,
    reason: null as string | null,
    estimatedDurationMs,
    estimatedCredits,
    freeTierRemainingMs,
    willChargeCredits,
    requiredCreditsIfAny: estimatedCredits,
    freeTierMsPerDay: FREE_TIER_MS_PER_DAY,
    creditMsPer1: CREDIT_MS_PER_1,
  };
}


