import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;

let stripeSingleton: Stripe | null = null;

export function getStripeClient() {
  if (typeof window !== "undefined") {
    throw new Error("Stripe server client must not be imported in client bundles");
  }

  if (stripeSingleton) return stripeSingleton;

  const safeKey = secretKey || "sk_test_dummy";
  if (safeKey.startsWith("sk_live")) {
    throw new Error("Live Stripe keys are not allowed. Use test keys only.");
  }

  stripeSingleton = new Stripe(safeKey, {
    apiVersion: "2025-12-15.clover",
  });

  return stripeSingleton;
}

export default getStripeClient;
