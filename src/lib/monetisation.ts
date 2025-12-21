import type { Capability } from "./entitlements";

export type SupportIntent = {
  reason: string;
  capability?: Capability;
  timestamp: string;
};

export function checkEligibility(capabilities: Capability[], required: Capability) {
  return capabilities.includes(required);
}

export function buildSupportIntent(required: Capability): SupportIntent {
  return {
    reason: `User expressed interest in ${required}`,
    capability: required,
    timestamp: new Date().toISOString(),
  };
}

export function logSupportAction(intent: SupportIntent) {
  console.info("support:intent", { reason: intent.reason, capability: intent.capability, ts: intent.timestamp });
}


