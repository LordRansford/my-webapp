export type UnifiedRunReceipt = {
  runId: string;
  /**
   * For metered server runs this will be the toolId.
   * For local-only runs (e.g. AI Studio local), it may be a synthetic id like "ai-studio:story-generator".
   */
  toolId?: string;
  mode: "local" | "compute";
  durationMs: number;
  inputBytes: number;
  outputBytes: number;
  freeTierAppliedMs: number;
  paidMs: number;
  creditsCharged: number;
  remainingCredits: number | null;
  guidanceTips: string[];
};

function safeInt(n: unknown) {
  const v = typeof n === "number" ? n : Number(n);
  return Number.isFinite(v) ? Math.max(0, Math.round(v)) : 0;
}

export function createLocalReceipt(params: {
  runId: string;
  toolId?: string;
  durationMs: number;
  inputBytes: number;
  outputBytes: number;
  guidanceTips?: string[];
}): UnifiedRunReceipt {
  return {
    runId: params.runId,
    toolId: params.toolId,
    mode: "local",
    durationMs: safeInt(params.durationMs),
    inputBytes: safeInt(params.inputBytes),
    outputBytes: safeInt(params.outputBytes),
    freeTierAppliedMs: safeInt(params.durationMs),
    paidMs: 0,
    creditsCharged: 0,
    remainingCredits: null,
    guidanceTips: Array.isArray(params.guidanceTips) ? params.guidanceTips.slice(0, 4) : [],
  };
}

