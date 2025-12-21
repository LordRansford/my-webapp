import { NextResponse } from "next/server";
import { getStripeEnv } from "@/lib/stripe/config";
import { markProcessedEvent, hasProcessedEvent } from "@/lib/stripe/eventsStore";
import crypto from "crypto";
import { addDonation, upsertUserPlan } from "@/lib/billing/store";
import { addUserEntitlement } from "@/lib/auth/store";
import { withRequestLogging } from "@/lib/security/requestLog";
import { getBillingProvider } from "@/lib/billing/providers/stripeProvider";

export async function POST(req: Request) {
  return withRequestLogging(req, { route: "POST /api/stripe/webhook" }, async () => {
    const stripeEnv = getStripeEnv();
    if (!stripeEnv) return NextResponse.json({ message: "Stripe disabled" }, { status: 503 });

    const signature = req.headers.get("stripe-signature");
    if (!signature) return NextResponse.json({ message: "Missing signature" }, { status: 400 });

    const rawBody = await req.text();
    let event: any = null;
    try {
      const provider = getBillingProvider();
      if (!provider) return NextResponse.json({ message: "Stripe disabled" }, { status: 503 });
      const parsed = await provider.parseWebhookEvent({ rawBody, signature });
      event = { id: parsed.id, type: parsed.type, data: parsed.data } as any;
    } catch (err: any) {
      console.error("Stripe webhook signature verification failed", { message: err?.message || "unknown" });
      return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
    }

    if (hasProcessedEvent(event.id)) return NextResponse.json({ ok: true, deduped: true });

    try {
      if (event.type === "checkout.session.completed") {
        const session = event.data.object as any;
        const userId = String(session.metadata?.userId || "").trim() || null;
        const amount = session.amount_total || 0;
        const currency = (session.currency || "gbp").toUpperCase();

        addDonation({
          id: crypto.randomUUID(),
          stripeEventId: event.id,
          stripeSessionId: session.id,
          stripePaymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : null,
          amount,
          currency,
          status: "paid",
          userId,
          createdAt: new Date().toISOString(),
        });

        if (userId) {
          addUserEntitlement({ userId, entitlement: "supporter", source: "donation" });
          upsertUserPlan({ userId, plan: "supporter", source: "donation", updatedAt: new Date().toISOString() });
          console.info("entitlement:granted", { userId, entitlement: "supporter", source: "donation" });
        }
      }

      if (event.type === "payment_intent.payment_failed") {
        const pi = event.data.object as any;
        addDonation({
          id: crypto.randomUUID(),
          stripeEventId: event.id,
          stripeSessionId: null,
          stripePaymentIntentId: pi.id,
          amount: pi.amount || 0,
          currency: (pi.currency || "gbp").toUpperCase(),
          status: "failed",
          userId: null,
          createdAt: new Date().toISOString(),
        });
      }

      markProcessedEvent(event.id);
      return NextResponse.json({ ok: true });
    } catch (err: any) {
      console.error("Stripe webhook processing failed", { message: err?.message || "unknown", eventType: event.type });
      return NextResponse.json({ message: "Webhook processing failed" }, { status: 500 });
    }
  });
}


