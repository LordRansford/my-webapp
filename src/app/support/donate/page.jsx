"use client";

import { useState } from "react";

const suggestedPounds = [5, 15, 30, 75];

export default function DonatePage() {
  const [amount, setAmount] = useState(15);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDonate = async (event) => {
    event.preventDefault();
    setStatus("");
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/donation/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(Number(amount) * 100),
          returnUrl: window.location.origin + "/support/success",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.url) {
        throw new Error(data?.message || "Unable to start checkout. Please try again later.");
      }
      window.location.href = data.url;
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
          Donations are optional. They fund hosting, maintenance, tool improvements, and security updates. Stripe handles payment details and we do
          not store card data.
        </p>
        <p className="text-sm text-slate-700">
          Donations do not guarantee services, support, or response times. This is a public education site, not a consulting contract.
        </p>
        <p className="text-sm text-slate-700">
          These resources are educational and planning aids. They are not legal advice and do not replace professional security
          testing. Only use them on systems you are permitted to work on.
        </p>
        <p className="text-xs text-slate-600">
          Privacy note: Stripe processes payments. We store donation status and amount, plus a user link if you are signed in. We do not store card
          details.
        </p>
      </section>

      <form onSubmit={handleDonate} className="mt-8 space-y-4 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-900">Select an amount</p>
          <div className="flex flex-wrap gap-2">
            {suggestedPounds.map((value) => (
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
                £{value}
              </button>
            ))}
          </div>
          <label className="block text-sm text-slate-700">
            Custom amount
            <input
              type="number"
              min="2"
              step="1"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            />
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
      </form>
    </main>
  );
}
