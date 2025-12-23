import { prisma } from "@/lib/db/prisma";

/**
 * Compute consumption enforcement layer (authoritative).
 *
 * Why free compute exists:
 * - The platform must remain genuinely usable for learning without requiring payment.
 * - If a job is small enough (tokens/time/output) and the feature allows it, it should never touch credits.
 *
 * Why ALL compute must go through this function:
 * - A single choke point prevents cost leaks and ensures consistent enforcement.
 * - Tools must not implement ad-hoc credit checks; they should call this layer instead.
 *
 * Certificates are NOT handled here:
 * - Credits represent compute time only (not content access, not certificates).
 * - Certificate entitlements are handled separately (Step 3).
 */

export const FREE_TOKEN_LIMIT = 2_000;
export const FREE_SECONDS_LIMIT = 10;
export const FREE_OUTPUT_KB_LIMIT = 100;

export const ABSOLUTE_MAX_SECONDS = 300;

export type ComputeFeature = "ai_lab" | "ai_studio" | "export" | "certificate_validation";

type AssertInput = {
  userId: string;
  feature: ComputeFeature;
  estimatedTokens: number;
  estimatedSeconds: number;
  estimatedOutputKB: number;
};

type AssertFree = { mode: "free" };
type AssertMetered = { mode: "metered"; creditsRequired: number };

/**
 * Features that are explicitly credits-only (never eligible for free compute),
 * regardless of thresholds.
 *
 * Note: this is intentionally hardcoded to keep enforcement predictable.
 */
const CREDITS_ONLY_FEATURES: ReadonlySet<ComputeFeature> = new Set(["ai_studio", "export", "certificate_validation"]);

function toFiniteNumber(n: unknown): number {
  const v = typeof n === "number" ? n : Number(n);
  return Number.isFinite(v) ? v : 0;
}

/**
 * Determine whether a compute request is free, metered, or blocked.
 *
 * Throws typed errors (messages are authoritative):
 * - "COMPUTE_BLOCKED_HARD_LIMIT"
 * - "INSUFFICIENT_CREDITS"
 */
export async function assertComputeAllowance(input: AssertInput): Promise<AssertFree | AssertMetered> {
  const userId = String(input.userId || "").trim();
  const feature = input.feature;

  const estimatedTokens = Math.max(0, Math.floor(toFiniteNumber(input.estimatedTokens)));
  const estimatedSeconds = Math.max(0, toFiniteNumber(input.estimatedSeconds));
  const estimatedOutputKB = Math.max(0, Math.floor(toFiniteNumber(input.estimatedOutputKB)));

  // A) Absolute safety limit
  if (estimatedSeconds > ABSOLUTE_MAX_SECONDS) {
    throw new Error("COMPUTE_BLOCKED_HARD_LIMIT");
  }

  // B) Free compute classification
  const creditsOnly = CREDITS_ONLY_FEATURES.has(feature);
  const qualifiesFree =
    !creditsOnly &&
    estimatedTokens <= FREE_TOKEN_LIMIT &&
    estimatedSeconds <= FREE_SECONDS_LIMIT &&
    estimatedOutputKB <= FREE_OUTPUT_KB_LIMIT;

  if (qualifiesFree) {
    return { mode: "free" };
  }

  // C) Metered compute
  const creditsRequired = Math.max(0, Math.ceil(estimatedSeconds));

  const creditsRow = await prisma.credits.findUnique({ where: { userId } });
  const balance = creditsRow?.balance ?? 0;

  if (balance < creditsRequired) {
    throw new Error("INSUFFICIENT_CREDITS");
  }

  return { mode: "metered", creditsRequired };
}

type FinalizeInput = {
  userId: string;
  creditsUsed: number;
  source: ComputeFeature;
  /**
   * Optional idempotency key.
   * If provided, repeated calls with the same requestId will not double-deduct credits.
   *
   * Implementation detail:
   * - We reuse `CreditUsageEvent.id` as the idempotency key (primary key).
   */
  requestId?: string;
};

/**
 * Deduct credits AFTER execution (exact metering).
 *
 * Requirements:
 * - Deduct atomically
 * - Write a usage record (userId, creditsUsed, source, timestamp)
 * - Idempotent-safe if called twice with the same requestId
 */
export async function finalizeComputeUsage(input: FinalizeInput): Promise<{ ok: true; deduped: boolean }> {
  const userId = String(input.userId || "").trim();
  const source = input.source;
  const requestId = typeof input.requestId === "string" ? input.requestId.trim() : "";

  const creditsUsed = Math.max(0, Math.ceil(toFiniteNumber(input.creditsUsed)));
  if (!creditsUsed) return { ok: true, deduped: false };

  try {
    await prisma.$transaction(async (tx) => {
      // Write usage record first, but within the same transaction so a failure rolls back.
      await tx.creditUsageEvent.create({
        data: {
          id: requestId || undefined,
          userId,
          toolId: source,
          consumed: creditsUsed,
          units: creditsUsed,
          freeUnits: 0,
          paidUnits: creditsUsed,
          // occurredAt defaults to now()
        },
      });

      const updated = await tx.credits.updateMany({
        where: { userId, balance: { gte: creditsUsed } },
        data: { balance: { decrement: creditsUsed } },
      });

      if (updated.count !== 1) {
        throw new Error("INSUFFICIENT_CREDITS");
      }
    });
  } catch (err: any) {
    // Idempotency: if the usage record already exists (same requestId), treat as ok.
    if (err?.code === "P2002" && requestId) {
      return { ok: true, deduped: true };
    }
    if (err?.message === "INSUFFICIENT_CREDITS") {
      throw new Error("INSUFFICIENT_CREDITS");
    }
    throw err;
  }

  return { ok: true, deduped: false };
}


