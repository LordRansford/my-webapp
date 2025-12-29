import { deductCreditsFromLots } from "@/lib/credits/deductFromLots";
import { createCreditUsageEvent } from "@/lib/credits/store";

/**
 * Deducts credits after a successful operation.
 * This should be called AFTER the operation completes successfully.
 * 
 * @param userId - User ID
 * @param credits - Actual credits to deduct (not estimate)
 * @param toolId - Tool/operation ID (e.g., "certificate-pdf", "template-download")
 * @param metadata - Optional metadata about the operation
 * @returns Updated balance or error
 */
export async function deductCredits(params: {
  userId: string;
  credits: number;
  toolId: string;
  metadata?: Record<string, any>;
}): Promise<{ ok: true; remainingBalance: number } | { ok: false; remainingBalance: number | null; error: string }> {
  const creditsToDeduct = Math.max(0, Math.round(Number(params.credits) || 0));
  
  if (creditsToDeduct <= 0) {
    // No credits to deduct, but still return success
    return { ok: true, remainingBalance: null as any };
  }

  try {
    // Deduct from credit lots
    const result = await deductCreditsFromLots({
      userId: params.userId,
      credits: creditsToDeduct,
    });

    if (!result.ok) {
      return {
        ok: false,
        remainingBalance: result.remainingBalance,
        error: "Insufficient credits for deduction",
      };
    }

    // Create credit usage event
    await createCreditUsageEvent({
      userId: params.userId,
      toolId: params.toolId,
      consumed: creditsToDeduct,
      units: creditsToDeduct,
      freeUnits: 0,
      paidUnits: creditsToDeduct,
      baseFree: false,
      estimatedCredits: creditsToDeduct,
      actualCredits: creditsToDeduct,
      meteringUnit: "fixed",
      durationMs: 0,
      inputBytes: 0,
      outputBytes: 0,
      freeTierAppliedMs: 0,
      paidMs: 0,
    }).catch(() => null); // Don't fail if event creation fails

    return {
      ok: true,
      remainingBalance: result.remainingBalance ?? 0,
    };
  } catch (error) {
    return {
      ok: false,
      remainingBalance: null,
      error: error instanceof Error ? error.message : "Unknown error during credit deduction",
    };
  }
}

