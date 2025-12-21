export type CheckoutSessionResult = { url: string };

export type DonationCheckoutParams = {
  amountPence?: number;
  priceId?: string;
  successUrl: string;
  cancelUrl: string;
  metadata: Record<string, string>;
};

export type WebhookParseResult = {
  id: string;
  type: string;
  data: any;
};

export interface BillingProvider {
  createDonationCheckoutSession(params: DonationCheckoutParams): Promise<CheckoutSessionResult>;
  parseWebhookEvent(params: { rawBody: string; signature: string }): Promise<WebhookParseResult>;
}


