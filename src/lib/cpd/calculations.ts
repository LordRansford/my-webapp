import type { CPDState, CPDTrackId } from "@/lib/cpd";
import {
  CPD_RULES_VERSION,
  minutesToHours,
  hoursToMinutes,
  validateCpdState,
  explainCredits,
} from "@/lib/cpd/calculations.core";

export { CPD_RULES_VERSION, minutesToHours, hoursToMinutes };

export type CpdValidationResult = { ok: true } | { ok: false; error: string };

export function validateCpdStateOrThrow(state: CPDState): void {
  const result = validateCpdState(state) as CpdValidationResult;
  if (!result.ok) throw new Error(result.error);
}

export type CpdCreditExplanation = ReturnType<typeof explainCredits>;

export function explainTrackCredits(state: CPDState, trackId: CPDTrackId): CpdCreditExplanation {
  return explainCredits(state as any, trackId);
}


