import { COMPUTE_TIER, getToolComputeProfile, type ComputeClass } from "@/config/computeLimits";

export type MeteringInput = {
  toolId: string;
  inputBytes: number;
  durationMs: number;
  featureFlags?: Record<string, boolean>;
};

export type MeteringResult = {
  toolId: string;
  computeClass: ComputeClass;
  units: number;
  freeUnitsUsed: number;
  paidUnitsUsed: number;
  creditsToConsume: number;
  reasons: string[];
};

function clampInt(n: unknown, min: number, max: number) {
  const v = typeof n === "number" ? n : Number(n);
  if (!Number.isFinite(v)) return min;
  return Math.max(min, Math.min(max, Math.round(v)));
}

function estimateUnits(toolId: string, inputBytes: number, durationMs: number, featureFlags?: Record<string, boolean>) {
  const profile = getToolComputeProfile(toolId);
  const computeClass: ComputeClass = profile?.computeClass || "A";

  const b = clampInt(inputBytes, 0, 25_000_000);
  const ms = clampInt(durationMs, 0, 300_000);

  const flags = featureFlags || {};
  const advanced = Boolean(flags.advanced || flags.expensiveMode || flags.serverAssistPlus);

  if (computeClass === "A") {
    // Local compute never consumes credits.
    return { units: Math.max(200, Math.round(b / 4)), computeClass, advanced };
  }

  if (computeClass === "B") {
    const base = Math.max(500, Math.round(ms * 2) + Math.round(b / 2));
    return { units: advanced ? Math.round(base * 1.35) : base, computeClass, advanced };
  }

  const base = Math.max(1500, Math.round(ms * 6) + Math.round(b / 2));
  return { units: advanced ? Math.round(base * 1.4) : base, computeClass, advanced };
}

export function meterRun(input: MeteringInput): MeteringResult {
  const toolId = String(input.toolId || "").trim();
  const inputBytes = clampInt(input.inputBytes, 0, 25_000_000);
  const durationMs = clampInt(input.durationMs, 0, 300_000);
  const profile = getToolComputeProfile(toolId);

  const reasons: string[] = [];
  if (profile?.label) reasons.push(`Tool: ${profile.label}.`);

  const { units, computeClass, advanced } = estimateUnits(toolId, inputBytes, durationMs, input.featureFlags);

  if (computeClass === "A") {
    reasons.push("Browser-only compute does not consume credits.");
    return { toolId, computeClass, units, freeUnitsUsed: units, paidUnitsUsed: 0, creditsToConsume: 0, reasons };
  }

  const freeUnitsUsed = Math.min(COMPUTE_TIER.freeUnitsPerRun, units);
  const paidUnitsUsed = Math.max(0, units - freeUnitsUsed);
  const creditsToConsume = paidUnitsUsed > 0 ? Math.ceil(paidUnitsUsed / COMPUTE_TIER.creditUnitsPerCredit) : 0;

  reasons.push(`Runtime: ${durationMs} ms.`);
  reasons.push(`Input size: ${inputBytes} bytes.`);
  if (advanced) reasons.push("Advanced features increased compute.");
  if (paidUnitsUsed > 0) reasons.push("Above free tier compute is credit-eligible.");

  return { toolId, computeClass, units, freeUnitsUsed, paidUnitsUsed, creditsToConsume, reasons };
}


