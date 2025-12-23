"use client";

import { BILLING_DISABLED_MESSAGE } from "@/lib/billing/billingEnabled";

export default function StripeReadinessClient() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
      <h2 className="text-lg font-semibold text-slate-900">Test billing flow</h2>
      <p className="text-sm text-slate-700">This does not contact Stripe. It only confirms the UI path is safely disabled.</p>
      <button
        type="button"
        onClick={() => window.alert("Billing is not enabled yet. Please try again later.")}
        className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        aria-label="Test billing flow"
      >
        Test billing flow
      </button>
      <p className="text-xs text-slate-600">{BILLING_DISABLED_MESSAGE}</p>
    </section>
  );
}


