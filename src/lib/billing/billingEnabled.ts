export function isBillingEnabled() {
  return process.env.BILLING_ENABLED === "true";
}

export const BILLING_DISABLED_MESSAGE = "Payments are not enabled yet. You can still use the free tools today.";


