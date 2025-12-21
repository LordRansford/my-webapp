import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY || "";

export function getStripeTestClient() {
  if (typeof window !== "undefined") {
    throw new Error("Stripe server client must not be imported in client bundles");
  }
  if (!process.env.STRIPE_TEST_ENABLED || process.env.STRIPE_TEST_ENABLED !== "true") {
    throw new Error("Stripe test mode is not enabled");
  }
  if (!key || !key.startsWith("sk_test_")) {
    throw new Error("Test mode requires sk_test key");
  }
  return new Stripe(key, { apiVersion: "2025-12-15.clover" });
}


