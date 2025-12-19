"use client";

import { useState } from "react";
import { isStripeConfigured, processDonation } from "@/lib/payments/provider";
import { setDonationToken } from "@/lib/entitlements/entitlements";

const suggested = [10, 25, 50];

export default function DonatePage() {
  const [amount, setAmount] = useState(25);
  const [recurring, setRecurring] = useState(false);
  const [status, setStatus] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const stripeReady = isStripeConfigured();

  const handleDonate = async (event) => {
    event.preventDefault();
    setStatus("");
    setLoading(true);
    try {
      const result = await processDonation({ amount, currency: "USD", recurring });
      setDonationToken(result.token);
      setToken(result.token);
      setStatus("Thank you. Donation noted and token saved locally.");
    } catch (error) {
      setStatus(error.message || "Donation failed. Try a different amount.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 md:px-6 lg:px-8">
      <section className="space-y-3 rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-sm backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Support</p>
        <h1 className="text-3xl font-semibold text-slate-900">Donate to keep the templates thriving</h1>
        <p className="text-base text-slate-700">
          Donations are optional. They fund maintenance, accessibility, and new template development. No card details are stored
          here; payments are handled by the provider.
        </p>
        {!stripeReady && (
          <p className="text-sm font-semibold text-amber-800">
            Stripe is not configured yet. This page issues a local donation token for testing only.
          </p>
        )}
        <p className="text-sm text-slate-700">
          These resources are educational and planning aids. They are not legal advice and do not replace professional security
          testing. Only use them on systems you are permitted to work on.
        </p>
      </section>

      <form onSubmit={handleDonate} className="mt-8 space-y-4 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-900">Select an amount</p>
          <div className="flex flex-wrap gap-2">
            {suggested.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setAmount(value)}
                className={`rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition ${
                  amount === value
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                }`}
              >
                ${value}
              </button>
            ))}
          </div>
          <label className="block text-sm text-slate-700">
            Custom amount
            <input
              type="number"
              min="1"
              step="1"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
          </label>
          <label className="mt-2 flex items-center gap-2 text-sm text-slate-800">
            <input type="checkbox" checked={recurring} onChange={(e) => setRecurring(e.target.checked)} />
            Make this a monthly donation (optional)
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {loading ? "Processing..." : "Donate"}
        </button>

        {status && <p className="text-sm font-semibold text-slate-800">{status}</p>}
        {token && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800">
            <p className="font-semibold">Donation token</p>
            <p className="break-all text-xs text-slate-700">{token}</p>
            <p className="mt-2 text-xs text-slate-700">
              This token is saved in your browser. It unlocks commercial exports without attribution in the export modal.
            </p>
          </div>
        )}
      </form>
    </main>
  );
}
