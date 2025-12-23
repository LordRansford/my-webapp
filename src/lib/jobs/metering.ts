import { computeMetering } from "@/lib/jobs/metering.core.js";

export type MeteringInput = {
  durationMs: number;
  freeRemainingMsAtStart: number;
  creditsPerMsPaid: number;
  maxRunMsHardCap: number;
};

export type MeteringResult = {
  durationMs: number;
  freeTierAppliedMs: number;
  paidMs: number;
  chargedCredits: number;
};

export function computeMeteringTs(input: MeteringInput): MeteringResult {
  return computeMetering(input) as MeteringResult;
}


