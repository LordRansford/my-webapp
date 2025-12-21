import { NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";
import { rateLimit } from "@/lib/security/rateLimit";

type Body = {
  amount?: number;
  tierId?: string;
  intentId?: string;
  successPath?: string;
  cancelPath?: string;
};

const MIN_AMOUNT_PENCE = 100;
const MAX_AMOUNT_PENCE = 50000;

export async function POST(req: Request) {
  // Stage 7: Stripe is wired but disabled by default.
  // Payments must not be possible until explicitly enabled.
  if (process.env.STRIPE_ENABLED !== "true") {
    return NextResponse.json({ error: "Donations are not enabled yet." }, { status: 503 });
  }

  const limited = rateLimit(req, { keyPrefix: "stripe-checkout", limit: 10, windowMs: 60_000 });
  if (limited) return limited;

  try {
    const body = (await req.json()) as Body;
    const amount = Number(body.amount);

    if (!Number.isFinite(amount)) {
      return NextResponse.json({ error: "Amount must be a number in GBP" }, { status: 400 });
    }

    const unitAmount = Math.round(amount);

    if (unitAmount < MIN_AMOUNT_PENCE || unitAmount > MAX_AMOUNT_PENCE) {
      return NextResponse.json(
        { error: "Amount must be between £1 and £500" },
        { status: 400 }
      );
    }

    const stripe = getStripeClient();

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const successUrl = body.successPath ? `${siteUrl}${body.successPath}` : `${siteUrl}/donate/success`;
    const cancelUrl = body.cancelPath ? `${siteUrl}${body.cancelPath}` : `${siteUrl}/donate/cancel`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: "Ransfords Notes Donation",
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        tierId: body.tierId || "custom",
        intentId: body.intentId || "general",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json({ error: "Unable to create checkout session" }, { status: 500 });
  }
}
