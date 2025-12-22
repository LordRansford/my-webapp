import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db/prisma";
import { grantCredits } from "@/lib/credits/store";

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secretKey || !webhookSecret) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 });
  }

  const stripe = new Stripe(secretKey, {
    apiVersion: "2025-12-15.clover",
  });

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Temporary: just log events
  console.log("Stripe event received:", event.type);

  // DB-backed idempotency (safe on Vercel/serverless).
  try {
    await prisma.stripeWebhookEvent.create({ data: { id: event.id, type: event.type } });
  } catch (err: any) {
    // Unique constraint means we've already processed this event.
    if (err?.code === "P2002") {
      return NextResponse.json({ received: true, deduped: true });
    }
    console.error("stripe:webhook idempotency store failed", err?.message || err);
    return NextResponse.json({ error: "Webhook store failure" }, { status: 500 });
  }

  // Minimal checkpoint extension: issue credits for successful credit purchases.
  // Default mapping: 1 credit per 1 penny unless overridden by CREDITS_PER_PENCE.
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = typeof session.metadata?.userId === "string" ? session.metadata.userId.trim() : "";

    if (!userId) {
      console.log("stripe:webhook checkout.session.completed missing userId metadata; skipping credit issuance", {
        eventId: event.id,
        sessionId: session.id,
      });
      return NextResponse.json({ received: true, skipped: "missing_userId" });
    }

    try {
      const perPenceRaw = process.env.CREDITS_PER_PENCE;
      const perPence = perPenceRaw ? Number(perPenceRaw) : 1;
      const multiplier = Number.isFinite(perPence) && perPence > 0 ? perPence : 1;

      // Pull line items so we can record the price id (if present).
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 10 });
      const first = lineItems.data?.[0];
      const priceId = typeof (first as any)?.price?.id === "string" ? (first as any).price.id : null;

      const amountTotal = typeof session.amount_total === "number" ? session.amount_total : 0;
      const creditsToGrant = Math.max(0, Math.round(amountTotal * multiplier));

      if (!creditsToGrant) {
        console.log("stripe:webhook checkout.session.completed has no chargeable amount; skipping credit issuance", {
          eventId: event.id,
          sessionId: session.id,
          amountTotal,
        });
        return NextResponse.json({ received: true, skipped: "no_amount" });
      }

      const result = await grantCredits({
        userId,
        credits: creditsToGrant,
        source: "stripe_checkout",
        stripeEventId: event.id,
        stripePriceId: priceId,
      });

      console.log("credits:granted", { userId, credits: creditsToGrant, balance: result.balance, eventId: event.id, priceId });
    } catch (err: any) {
      console.error("stripe:webhook credit issuance failed", { message: err?.message || "unknown", eventId: event.id });
      return NextResponse.json({ error: "Credit issuance failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
