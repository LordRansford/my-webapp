type StripeEnv = {
  secretKey: string;
  webhookSecret: string;
  publishableKey: string;
  donationProductId?: string;
  donationPriceIds?: string[];
};

export function getStripeEnv(): StripeEnv | null {
  if (process.env.STRIPE_ENABLED !== "true") return null;

  const secretKey = process.env.STRIPE_SECRET_KEY || "";
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

  const donationProductId = process.env.STRIPE_DONATION_PRODUCT_ID;
  const donationPriceIds = process.env.STRIPE_DONATION_PRICE_IDS
    ? process.env.STRIPE_DONATION_PRICE_IDS.split(",").map((s) => s.trim()).filter(Boolean)
    : undefined;

  if (process.env.NODE_ENV !== "production") {
    const missing: string[] = [];
    if (!secretKey) missing.push("STRIPE_SECRET_KEY");
    if (!webhookSecret) missing.push("STRIPE_WEBHOOK_SECRET");
    if (!publishableKey) missing.push("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY");
    if (!donationProductId && (!donationPriceIds || donationPriceIds.length === 0)) {
      missing.push("STRIPE_DONATION_PRODUCT_ID or STRIPE_DONATION_PRICE_IDS");
    }
    if (missing.length) {
      throw new Error(`Missing Stripe env vars: ${missing.join(", ")}`);
    }
    if (secretKey && secretKey.startsWith("sk_live")) {
      throw new Error("Live Stripe keys are not allowed. Use test keys only.");
    }
  }

  return { secretKey, webhookSecret, publishableKey, donationProductId, donationPriceIds };
}


