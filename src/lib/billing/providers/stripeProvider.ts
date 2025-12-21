import Stripe from "stripe";
import { getStripeEnv } from "@/lib/stripe/config";
import { getStripeClient } from "@/lib/stripe";
import type { BillingProvider, DonationCheckoutParams, WebhookParseResult } from "@/lib/billing/provider";

export function getBillingProvider(): BillingProvider | null {
  const env = getStripeEnv();
  if (!env) return null;
  const stripe = getStripeClient();

  return {
    async createDonationCheckoutSession(params: DonationCheckoutParams) {
      const lineItem = (() => {
        if (params.priceId && env.donationPriceIds?.includes(params.priceId)) {
          return { price: params.priceId, quantity: 1 };
        }
        const unitAmount = Number(params.amountPence);
        if (!Number.isFinite(unitAmount)) throw new Error("Amount must be a number");
        return {
          price_data: {
            currency: "gbp",
            product_data: {
              name: "Support Ransfords Notes",
              metadata: { type: "donation" },
            },
            unit_amount: Math.round(unitAmount),
          },
          quantity: 1,
        };
      })();

      const checkoutSession = await stripe.checkout.sessions.create({
        mode: "payment",
        success_url: params.successUrl,
        cancel_url: params.cancelUrl,
        payment_method_types: ["card"],
        line_items: [lineItem as any],
        metadata: params.metadata,
      });
      return { url: checkoutSession.url || "" };
    },

    async parseWebhookEvent(params: { rawBody: string; signature: string }): Promise<WebhookParseResult> {
      const stripe = new Stripe(env.secretKey, { apiVersion: "2025-12-15.clover" });
      const event = stripe.webhooks.constructEvent(params.rawBody, params.signature, env.webhookSecret);
      return { id: event.id, type: event.type, data: event.data };
    },
  };
}


