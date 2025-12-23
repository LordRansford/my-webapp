export type ComputeRunStatus = "success" | "blocked" | "aborted" | "error";

export type ComputeErrorCode =
  | "FILE_TOO_LARGE"
  | "FILE_TYPE_NOT_SUPPORTED"
  | "PARSE_FAILED"
  | "TIMEOUT"
  | "INSUFFICIENT_CREDITS"
  | "FREE_TIER_EXHAUSTED"
  | "AUTH_REQUIRED"
  | "RUN_BLOCKED"
  | "TOOL_DENIED"
  | "INTERNAL_ERROR";

export type ComputeError = {
  code: ComputeErrorCode;
  message: string; // safe for UI
  details?: string; // safe for UI, optional
  hint?: string; // safe suggestion
};

export type ComputeEstimateRequest = {
  toolId: string;
  inputBytes: number;
  requestedComplexityPreset?: "light" | "standard" | "heavy";
};

export type ComputeEstimate = {
  estimatedCpuMs: number;
  estimatedWallTimeMs: number;
  estimatedCreditCost: number;
  freeTierAppliedMs: number;
  paidMs: number;
  allowed: boolean;
  reasons: string[];
};

export type ComputeActual = {
  durationMs: number;
  freeTierAppliedMs: number;
  paidMs: number;
  creditsCharged: number;
};

export type ComputeEstimateResponse = {
  ok: true;
  allowed: boolean;
  estimatedCpuMs: number;
  estimatedWallTimeMs: number;
  estimatedCreditCost: number;
  freeTierAppliedMs: number;
  paidMs: number;
  freeTierRemainingMs: number;
  willChargeCredits: boolean;
  requiredCreditsIfAny: number;
  reasons: string[];
  requestedComplexityPreset: "light" | "standard" | "heavy";
  alternativeFreeTier: null | { preset: "light"; estimate: any };
  costHints: string[];
};

export type ComputeHistoryItem = {
  id: string;
  toolId: string;
  status: string;
  createdAt: string;
  startedAt: string | null;
  finishedAt: string | null;
  durationMs: number | null;
  estimatedCostCredits: number | null;
  chargedCredits: number | null;
  freeTierAppliedMs: number | null;
  inputBytes: number | null;
  errorCode: string | null;
  errorMessage: string | null;
};

export type ComputeHistoryResponse =
  | { ok: false; error: string }
  | { ok: true; balance: number; expiresAt: string | null; jobs: ComputeHistoryItem[] };


