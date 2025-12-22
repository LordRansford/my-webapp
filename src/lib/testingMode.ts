/**
 * Temporary testing override.
 *
 * When enabled, access checks should treat everything as "allowed" so the site can be QA tested
 * on preview/prod environments without deleting or weakening the underlying access model.
 *
 * Turn off by removing the env var or setting it to "false".
 */
export const TESTING_MODE_ENABLED =
  process.env.NEXT_PUBLIC_TESTING_MODE === "true" || process.env.TESTING_MODE === "true";

export type TestingOverrideDecision =
  | { allowed: true; reason: "testing-mode" }
  | { allowed: false; reason: "disabled" };

/**
 * Single source of truth for the temporary QA/testing override.
 * Do not fake roles or delete access logic — just return early when enabled.
 */
export function getTestingOverrideDecision(): TestingOverrideDecision {
  if (process.env.NEXT_PUBLIC_TESTING_MODE === "true") {
    return { allowed: true, reason: "testing-mode" };
  }
  return { allowed: false, reason: "disabled" };
}



