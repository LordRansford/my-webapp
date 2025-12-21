import { startStripeDonation } from "./stripe";

export function isStripeConfigured() {
  // Stage 7: Stripe is wired but disabled by default. Keys alone must not enable payments.
  return process.env.STRIPE_ENABLED === "true";
}

export async function processDonation({ amount, currency = "USD", recurring = false }) {
  if (!amount || Number.isNaN(Number(amount)) || Number(amount) <= 0) {
    throw new Error("Enter a valid amount");
  }

  if (isStripeConfigured()) {
    // Placeholder: swap to real Stripe session creation when keys are present.
    return startStripeDonation({ amount, currency, recurring });
  }

  // Provider-agnostic placeholder for local testing.
  await new Promise((resolve) => setTimeout(resolve, 300));
  const token = `donation-${currency.toLowerCase()}-${amount}-${recurring ? "recurring" : "one-time"}-${Date.now()}`;
  return { token };
}
