"use client";

import { BILLING_DISABLED_MESSAGE } from "@/lib/billing/billingEnabled";

export function ComingSoonPurchase({ label = "Buy credits" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        window.alert(BILLING_DISABLED_MESSAGE);
      }}
      className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:cursor-not-allowed disabled:bg-slate-300"
      aria-label={label}
      disabled
    >
      {label}
    </button>
  );
}



