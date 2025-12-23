import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/security/rateLimit";
import { getStripeEnv } from "@/lib/stripe/config";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { requireSameOrigin } from "@/lib/security/origin";
import { withRequestLogging } from "@/lib/security/requestLog";
import { getBillingProvider } from "@/lib/billing/providers/stripeProvider";
import { isBillingEnabled, BILLING_DISABLED_MESSAGE } from "@/lib/billing/billingEnabled";

type Body = {
  amount?: number;
  priceId?: string;
  returnUrl?: string;
};

const MIN_PENCE = 200;
const MAX_PENCE = 50_000;

function isSafeReturnUrl(value: string) {
  try {
    const url = new URL(value);
    const site = new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000");
    return url.origin === site.origin;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  return withRequestLogging(req, { route: "POST /api/stripe/donation/checkout" }, async () => {
    if (!isBillingEnabled()) {
      return NextResponse.json({ message: BILLING_DISABLED_MESSAGE }, { status: 503 });
    }
    const originBlock = requireSameOrigin(req);
    if (originBlock) return originBlock;

    const limited = rateLimit(req, { keyPrefix: "stripe-donation-checkout", limit: 10, windowMs: 60_000 });
    if (limited) return limited;

  const stripeEnv = getStripeEnv();
  if (!stripeEnv) return NextResponse.json({ message: "Donations are not enabled." }, { status: 503 });

  const body = (await req.json().catch(() => null)) as Body | null;
  const returnUrl = body?.returnUrl;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const successUrl = `${siteUrl}/support/success?session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${siteUrl}/support/cancel`;

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || null;

  try {
    const amount = body?.priceId ? null : Number(body?.amount);
    const unitAmount = amount === null ? null : Math.round(amount);
    if (unitAmount !== null && (unitAmount < MIN_PENCE || unitAmount > MAX_PENCE)) {
      throw new Error("Amount out of bounds");
    }

    const provider = getBillingProvider();
    if (!provider) return NextResponse.json({ message: "Donations are not enabled." }, { status: 503 });

    const result = await provider.createDonationCheckoutSession({
      amountPence: unitAmount ?? undefined,
      priceId: body?.priceId,
      successUrl,
      cancelUrl,
      metadata: {
        type: "donation",
        userId: userId || "",
        sessionVersion: "v1",
        returnUrl: returnUrl && isSafeReturnUrl(returnUrl) ? returnUrl : "",
      },
    });

    return NextResponse.json({ url: result.url });
    } catch (error: any) {
      console.error("Stripe checkout creation failed", { message: error?.message || "unknown" });
      return NextResponse.json({ message: "Unable to start checkout right now. Please try again later." }, { status: 502 });
    }
  });
}


