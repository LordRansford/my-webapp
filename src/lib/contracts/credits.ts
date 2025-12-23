export type CreditsEstimateRequest = {
  toolId: string;
  inputBytes: number;
  requestedComplexityPreset?: "light" | "standard" | "heavy";
};

export type CreditsEstimateResponse =
  | { message: string }
  | {
      allowed: boolean;
      reason?: string | null;
      estimatedDurationMs: number;
      estimatedCredits: number;
      freeTierRemainingMs: number;
      willChargeCredits: boolean;
      requiredCreditsIfAny: number;
      freeTierMsPerDay?: number;
      creditMsPer1?: number;
    };

export type CreditsWalletResponse =
  | { message: string }
  | {
      balance: number;
      expiresAt: string | null;
      freeTierRemainingMs: number;
      lots?: any[];
      usage?: any[];
    };


