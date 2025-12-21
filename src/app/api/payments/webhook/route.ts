import { NextResponse } from "next/server";
import { getStripeTestClient } from "@/lib/payments/stripeTest";
import { hasProcessedEvent, markProcessedEvent } from "@/lib/stripe/eventsStore";
import { addUserEntitlement } from "@/lib/auth/store";
import { upsertUserPlan } from "@/lib/billing/store";

const activateSupporter = process.env.SUPPORTER_ACTIVATION_ENABLED === "true";

export async function POST(req: Request) {
  if (process.env.STRIPE_TEST_ENABLED !== "true") {
    return NextResponse.json({ message: "Stripe test mode disabled" }, { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ message: "Missing signature" }, { status: 400 });

  const rawBody = await req.text();
  let event: any = null;
  try {
    const stripe = getStripeTestClient();
    // Secret is inferred by test client; rely on webhook secret env.
    const secret = process.env.STRIPE_WEBHOOK_SECRET || "";
    if (!secret) throw new Error("Webhook secret missing");
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch (err: any) {
    console.error("stripe:webhook invalid signature", { message: err?.message || "unknown" });
    return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
  }

  if (hasProcessedEvent(event.id)) return NextResponse.json({ ok: true, deduped: true });

  try {
    if (event.type === "payment_intent.succeeded" || event.type === "charge.succeeded") {
      const obj: any = event.data.object;
      const userId = obj.metadata?.userId;
      if (userId && activateSupporter) {
        addUserEntitlement({ userId, entitlement: "supporter", source: "donation" });
        upsertUserPlan({ userId, plan: "supporter", source: "donation", updatedAt: new Date().toISOString() });
        console.info("supporter:activated", { userId, eventId: event.id });
      } else {
        console.info("supporter:skipped_activation_flag", { userId, eventId: event.id });
      }
    }
    markProcessedEvent(event.id);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("stripe:webhook processing failed", { message: err?.message || "unknown" });
    return NextResponse.json({ message: "Webhook processing failed" }, { status: 500 });
  }
}


