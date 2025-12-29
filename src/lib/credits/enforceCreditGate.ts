import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/db/prisma";
import { enforceCreditExpiry } from "@/lib/credits/store";

export type CreditGateResult =
  | {
      ok: true;
      userId: string;
      balance: number;
      remainingAfter: number;
    }
  | {
      ok: false;
      status: number;
      message: string;
      requiredCredits?: number;
      currentBalance?: number;
    };

/**
 * Enforces credit gate for operations requiring server-side computation.
 * 
 * This utility:
 * - Validates user is authenticated
 * - Checks current credit balance
 * - Validates sufficient credits (with safety buffer)
 * - Returns standardized error responses
 * 
 * @param estimatedCredits - Estimated credit cost for the operation
 * @param safetyBuffer - Multiplier for safety buffer (default 1.25 = 25% buffer)
 * @returns CreditGateResult indicating if operation can proceed
 */
export async function enforceCreditGate(
  estimatedCredits: number,
  safetyBuffer = 1.25
): Promise<CreditGateResult> {
  // Get authenticated user
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return {
      ok: false,
      status: 401,
      message: "Authentication required. Please sign in to use this feature.",
    };
  }

  const userId = session.user.id;

  // If no credits required, allow operation
  if (estimatedCredits <= 0) {
    return {
      ok: true,
      userId,
      balance: 0,
      remainingAfter: 0,
    };
  }

  // Enforce credit expiry
  await enforceCreditExpiry(userId);

  // Get current balance
  const creditsRow = await prisma.credits.findUnique({ where: { userId } });
  const currentBalance = creditsRow?.balance ?? 0;

  // Check for expired credits
  if (creditsRow?.expiresAt && creditsRow.expiresAt.getTime() <= Date.now()) {
    return {
      ok: false,
      status: 402,
      message: "Your credits have expired. Please purchase more credits to continue.",
      requiredCredits: estimatedCredits,
      currentBalance: 0,
    };
  }

  // Calculate required credits with safety buffer
  const requiredCredits = Math.ceil(estimatedCredits * safetyBuffer);

  // Check if user has sufficient credits
  if (currentBalance < requiredCredits) {
    return {
      ok: false,
      status: 402,
      message: `Insufficient credits. This operation requires approximately ${estimatedCredits} credits (${requiredCredits} with safety buffer), but you only have ${currentBalance} credits available.`,
      requiredCredits,
      currentBalance,
    };
  }

  return {
    ok: true,
    userId,
    balance: currentBalance,
    remainingAfter: currentBalance - requiredCredits, // Note: actual deduction happens separately
  };
}

/**
 * Creates a standardized NextResponse for credit gate failures
 */
export function creditGateErrorResponse(result: Extract<CreditGateResult, { ok: false }>): NextResponse {
  return NextResponse.json(
    {
      code: result.status === 401 ? "UNAUTHORIZED" : "INSUFFICIENT_CREDITS",
      message: result.message,
      requiredCredits: result.requiredCredits,
      currentBalance: result.currentBalance,
    },
    { status: result.status }
  );
}

