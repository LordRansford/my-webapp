import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { isBillingEnabled, BILLING_DISABLED_MESSAGE } from "@/lib/billing/billingEnabled";

type Body = {
  priceId?: string;
  productId?: string;
};

export async function POST(req: Request) {
  if (!isBillingEnabled()) {
    return NextResponse.json({ error: BILLING_DISABLED_MESSAGE }, { status: 503 });
  }
  if (process.env.STRIPE_ENABLED !== "true") {
    return NextResponse.json({ error: "Stripe is not enabled" }, { status: 503 });
  }

  const session = await getServerSession(authOptions).catch(() => null);
  const userId = session?.user?.id || "";
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY || "";
  const fixedPriceId = process.env.STRIPE_PRICE_ID || "";
  if (!secretKey || !fixedPriceId) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 });
  }

  const body = (await req.json().catch(() => null)) as Body | null;
  if (body && typeof body === "object" && "amount" in (body as any)) {
    return NextResponse.json({ error: "Amounts are not allowed" }, { status: 400 });
  }
  const priceId = typeof body?.priceId === "string" ? body.priceId.trim() : "";
  const productId = typeof body?.productId === "string" ? body.productId.trim() : "";

  if (!priceId || priceId !== fixedPriceId) {
    return NextResponse.json({ error: "Invalid priceId" }, { status: 400 });
  }
  if (!productId) {
    return NextResponse.json({ error: "Missing productId" }, { status: 400 });
  }

  const stripe = new Stripe(secretKey);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const sessionResult = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/checkout/cancel`,
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: {
      userId,
      productId,
    },
  });

  return NextResponse.json({ url: sessionResult.url });
}
