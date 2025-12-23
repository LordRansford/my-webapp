import StripeReadinessClient from "./ui.client";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin: Stripe readiness",
  robots: { index: false, follow: false },
};

function badge(isReady: boolean) {
  return isReady ? "Ready" : "Not ready";
}

export default async function AdminStripeReadinessPage() {
  const stripeSecretPresent = Boolean(process.env.STRIPE_SECRET_KEY);
  const webhookSecretPresent = Boolean(process.env.STRIPE_WEBHOOK_SECRET);
  const stripeEnabledFlag = Boolean(process.env.STRIPE_ENABLED);

  let lastWebhookAt: string | null = null;
  try {
    const row = await (prisma as any).stripeWebhookEvent.findFirst({
      orderBy: { receivedAt: "desc" },
      select: { receivedAt: true, eventType: true },
    });
    if (row?.receivedAt) lastWebhookAt = new Date(row.receivedAt).toISOString();
  } catch {
    lastWebhookAt = null;
  }

  const isReady = stripeSecretPresent && webhookSecretPresent;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 md:px-6 lg:px-8 space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold text-slate-600">Billing</p>
        <h1 className="text-2xl font-semibold text-slate-900">Stripe readiness</h1>
        <p className="text-slate-700">Status only. No real payments in this phase.</p>
      </header>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-900">Status</p>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isReady ? "bg-emerald-50 text-emerald-900 border border-emerald-200" : "bg-amber-50 text-amber-900 border border-amber-200"}`}>
            {badge(isReady)}
          </span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <p className="text-xs font-semibold text-slate-700">Stripe enabled flag</p>
            <p className="mt-1 text-sm text-slate-900">{stripeEnabledFlag ? "present" : "missing"}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <p className="text-xs font-semibold text-slate-700">Webhook secret</p>
            <p className="mt-1 text-sm text-slate-900">{webhookSecretPresent ? "present" : "missing"}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <p className="text-xs font-semibold text-slate-700">Secret key</p>
            <p className="mt-1 text-sm text-slate-900">{stripeSecretPresent ? "present" : "missing"}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <p className="text-xs font-semibold text-slate-700">Last webhook received</p>
            <p className="mt-1 text-sm text-slate-900">{lastWebhookAt ? new Date(lastWebhookAt).toLocaleString() : "No webhooks recorded"}</p>
          </div>
        </div>
      </section>

      <StripeReadinessClient />
    </main>
  );
}


