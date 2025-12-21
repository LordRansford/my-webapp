"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { donationIntents } from "@/data/donationIntents";
import { currency, donationTiers } from "@/data/donations";

type DonationModalProps = {
  open: boolean;
  onClose: () => void;
  successPath?: string;
  cancelPath?: string;
};

const currencySymbol = {
  GBP: "£",
  USD: "$",
  EUR: "€",
};

function formatAmount(amount: number) {
  const symbol = currencySymbol[currency as keyof typeof currencySymbol] || "";
  return `${symbol}${amount.toFixed(2)}`;
}

export default function DonationModal({
  open,
  onClose,
  successPath = "/donate/success",
  cancelPath = "/donate/cancel",
}: DonationModalProps) {
  const [selectedTier, setSelectedTier] = useState(donationTiers[1]);
  const [selectedIntent, setSelectedIntent] = useState(donationIntents[0]);
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const modalRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const lastFocused = useRef<Element | null>(null);

  useEffect(() => {
    if (open) {
      lastFocused.current = document.activeElement;
      const timer = setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 0);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [open]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
    return undefined;
  }, [open, onClose]);

  useEffect(() => {
    if (!open && lastFocused.current instanceof HTMLElement) {
      lastFocused.current.focus();
    }
  }, [open]);

  const amountToSend = useMemo(() => {
    const parsed = parseFloat(customAmount || "");
    if (!Number.isNaN(parsed) && parsed > 0) return parsed;
    return selectedTier?.amount ?? donationTiers[0].amount;
  }, [customAmount, selectedTier]);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      setError("");
      // Stage 7: monetisation scaffolding only. No payments enabled.
      throw new Error("Donations are not enabled in this build yet.");
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4" role="dialog" aria-modal="true">
      <div ref={modalRef} className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-slate-200">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Donations</p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-900">Support this work</h2>
            <p className="mt-2 text-sm text-slate-700 leading-relaxed">
              This site takes a lot of time, coffee and testing. If you find it useful, you can support its maintenance and growth here.
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
            aria-label="Close donation dialog"
          >
            Close
          </button>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {donationTiers.map((tier) => {
            const selected = selectedTier?.id === tier.id;
            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => setSelectedTier(tier)}
                className={`h-full rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 ${
                  selected ? "border-slate-900 bg-slate-900/5 shadow-sm" : "border-slate-200 bg-slate-50/60 hover:border-slate-300"
                }`}
                aria-pressed={selected}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-slate-900">{tier.label}</span>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-800 shadow-sm">{formatAmount(tier.amount)}</span>
                </div>
                <p className="mt-1 text-sm text-slate-700">{tier.description}</p>
                <ul className="mt-2 space-y-1 text-xs text-slate-700">
                  {tier.impact.map((line) => (
                    <li key={line} className="flex items-start gap-2">
                      <span aria-hidden="true">•</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">Custom amount (optional)</label>
            <div className="mt-2 flex items-center gap-2">
              <span className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800">
                {currencySymbol[currency as keyof typeof currencySymbol] || currency}
              </span>
              <input
                type="number"
                min={1}
                step="1"
                inputMode="decimal"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                placeholder={selectedTier ? selectedTier.amount.toString() : "10"}
              />
            </div>
            <p className="mt-2 text-xs text-slate-700">
              Suggested: {formatAmount(amountToSend)}. Custom amounts replace the selected tier.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">Intent (optional)</label>
            <select
              value={selectedIntent?.id}
              onChange={(e) => setSelectedIntent(donationIntents.find((i) => i.id === e.target.value) || donationIntents[0])}
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              {donationIntents.map((intent) => (
                <option key={intent.id} value={intent.id}>
                  {intent.label}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs text-slate-700">{selectedIntent?.description}</p>
          </div>
        </div>

        {error ? <p className="mt-3 text-sm font-semibold text-rose-700">{error}</p> : null}

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-slate-700">
            Total: <span className="font-semibold text-slate-900">{formatAmount(amountToSend)}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400"
              disabled={loading}
            >
              {loading ? "Preparing..." : "Donations coming soon"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
