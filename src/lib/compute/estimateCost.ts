import { COMPUTE_TIER, type ComputeClass, getToolComputeProfile } from "@/config/computeLimits";

export type ComputeCostInput = {
  toolId?: string;
  computeClass?: ComputeClass;
  // Rough inputs for estimation.
  inputBytes?: number;
  steps?: number;
  expectedWallMs?: number;
  // Available balances.
  sessionFreeUsedUnits?: number;
  creditsBalance?: number | null;
};

export type ComputeCostBreakdown = {
  toolId?: string;
  computeClass: ComputeClass;
  estimate: {
    units: number;
    freeUnitsAvailable: number;
    freeUnitsUsed: number;
    paidUnitsUsed: number;
    estimatedCredits: number;
    creditsBalanceKnown: boolean;
    creditShortfall: boolean;
  };
  explanation: string[];
  warnings: string[];
};

function clampInt(n: unknown, min: number, max: number) {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v)) return min;
  return Math.max(min, Math.min(max, Math.round(v)));
}

function estimateUnits(input: ComputeCostInput): { units: number; computeClass: ComputeClass; label?: string } {
  const profile = input.toolId ? getToolComputeProfile(input.toolId) : null;
  const computeClass: ComputeClass = input.computeClass || profile?.computeClass || "A";

  const inputBytes = clampInt(input.inputBytes ?? profile?.typicalInputBytes ?? 0, 0, 10_000_000);
  const steps = clampInt(input.steps ?? profile?.typicalSteps ?? 1, 1, 50_000);
  const expectedWallMs = clampInt(input.expectedWallMs ?? 900, 0, 120_000);

  // Simple, deterministic estimation model:
  // - Class A is local and should not consume credits.
  // - Class B uses a mix of network + bounded server compute.
  // - Class C is server-bound, heavy, and always paid above free tier.
  if (computeClass === "A") {
    const units = Math.max(200, Math.round(inputBytes / 4) + Math.round(steps * 3));
    return { units, computeClass, label: profile?.label };
  }

  if (computeClass === "B") {
    const units = Math.max(500, Math.round(expectedWallMs * 2) + Math.round(inputBytes / 2) + Math.round(steps * 25));
    return { units, computeClass, label: profile?.label };
  }

  const units = Math.max(1500, Math.round(expectedWallMs * 6) + Math.round(inputBytes / 2) + Math.round(steps * 60));
  return { units, computeClass, label: profile?.label };
}

export function estimatePreRunCost(input: ComputeCostInput): ComputeCostBreakdown {
  const { units, computeClass, label } = estimateUnits(input);
  const sessionUsed = clampInt(input.sessionFreeUsedUnits ?? 0, 0, COMPUTE_TIER.freeUnitsPerSession);
  const freeRemainingSession = Math.max(0, COMPUTE_TIER.freeUnitsPerSession - sessionUsed);
  const freeAvailable = Math.min(COMPUTE_TIER.freeUnitsPerRun, freeRemainingSession);

  const freeUnitsUsed = Math.min(units, freeAvailable);
  const paidUnitsUsed = Math.max(0, units - freeUnitsUsed);

  const estimatedCredits = paidUnitsUsed > 0 ? Math.ceil(paidUnitsUsed / COMPUTE_TIER.creditUnitsPerCredit) : 0;
  const creditsBalanceKnown = typeof input.creditsBalance === "number";
  const creditShortfall = creditsBalanceKnown ? (input.creditsBalance as number) < estimatedCredits : false;

  const explanation: string[] = [];
  const warnings: string[] = [];

  explanation.push(`${label || "This tool"} uses an estimated ${units} compute units for this run.`);
  explanation.push(`Free tier covers up to ${freeAvailable} units right now.`);
  if (paidUnitsUsed > 0) {
    explanation.push(`Above the free tier, this run would use about ${estimatedCredits} credits as an estimate.`);
  } else {
    explanation.push("This run should fit within the free tier.");
  }

  if (computeClass === "A") {
    explanation.push("Browser-only work does not consume credits.");
  }

  if (paidUnitsUsed > 0 && !creditsBalanceKnown) {
    warnings.push("Credits are only visible when signed in.");
  }
  if (paidUnitsUsed > 0 && creditShortfall) {
    warnings.push("You may not have enough credits for the paid portion. You can still run it, but results may be partial.");
  }

  return {
    toolId: input.toolId,
    computeClass,
    estimate: {
      units,
      freeUnitsAvailable: freeAvailable,
      freeUnitsUsed,
      paidUnitsUsed,
      estimatedCredits,
      creditsBalanceKnown,
      creditShortfall,
    },
    explanation,
    warnings,
  };
}

export type ComputeActualInput = ComputeCostInput & { actualWallMs: number };

export function estimatePostRunCost(input: ComputeActualInput): ComputeCostBreakdown {
  const pre = estimatePreRunCost({ ...input, expectedWallMs: input.actualWallMs });

  const explanation = [...pre.explanation];
  explanation.push(`Actual run time was about ${Math.round(input.actualWallMs)} ms.`);

  return { ...pre, explanation };
}


