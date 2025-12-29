"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import AccessGate from "@/components/AccessGate";
import CreditConsent, { useCreditConsent } from "@/components/credits/CreditConsent";

const OPTIONS = [
  { value: "internal_use", label: "Internal use", helper: "Personal or team use. You may remove the signature." },
  { value: "commercial_use_keep_signature", label: "Commercial use with signature", helper: "Commercial use is fine if the signature stays." },
  { value: "commercial_use_remove_signature", label: "Commercial use without signature", helper: "Requires a donation or written permission first." },
];

function useFocusTrap(open) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const focusable = dialog.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])");
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();
    const handleKey = (e) => {
      if (e.key === "Escape") {
        dialog.dispatchEvent(new CustomEvent("close-modal", { bubbles: true }));
      }
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    dialog.addEventListener("keydown", handleKey);
    return () => dialog.removeEventListener("keydown", handleKey);
  }, [open]);

  return dialogRef;
}

export function DownloadOptionsModal({ open, onClose, template }) {
  const [requestedUse, setRequestedUse] = useState("internal_use");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const dialogRef = useFocusTrap(open);
  const previewEnabled = process.env.NEXT_PUBLIC_PREVIEW_MODE === "true";
  const [balance, setBalance] = useState(null);
  const ESTIMATED_CREDITS = 2; // Template download cost
  const { accepted, canProceed } = useCreditConsent(ESTIMATED_CREDITS, balance);

  useEffect(() => {
    if (open) {
      setStatus(null);
      setRequestedUse("internal_use");
      // Fetch credit balance
      fetch("/api/credits/status")
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          setBalance(typeof d?.balance === "number" ? d.balance : 0);
        })
        .catch(() => setBalance(0));
    }
  }, [open]);

  if (!open) return null;

  const submit = async () => {
    if (!template?.id) return;
    if (!canProceed) {
      setStatus({ type: "error", message: "Please accept the credit estimate and ensure sufficient credits." });
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      const licenseChoice = requestedUse === "internal_use" ? "internal_use" : "commercial_use";
      const keepSignature = requestedUse === "commercial_use_keep_signature";
      const res = await fetch("/api/templates/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId: template.id, licenseChoice, keepSignature }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setStatus({ type: "error", message: data?.message || "Download not available." });
      } else {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        setStatus({ type: "success", message: "Download started." });
      }
    } catch (error) {
      setStatus({ type: "error", message: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4" role="dialog" aria-modal="true">
      <div
        ref={dialogRef}
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200"
        onClose={onClose}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose?.();
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Download options</p>
            <h2 className="text-xl font-semibold text-slate-900">{template?.title || "Template download"}</h2>
            <p className="text-sm text-slate-700">Choose how you plan to use this template. Browsing stays open.</p>
          </div>
          <button
            type="button"
            className="rounded-full border border-slate-200 px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {OPTIONS.map((opt) => (
            <label key={opt.value} className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-3">
              <input
                type="radio"
                name="requestedUse"
                value={opt.value}
                checked={requestedUse === opt.value}
                onChange={() => setRequestedUse(opt.value)}
                className="mt-1"
              />
              <div>
                <div className="text-sm font-semibold text-slate-900">{opt.label}</div>
                <p className="text-sm text-slate-700">{opt.helper}</p>
              </div>
            </label>
          ))}
        </div>

        <div className="mt-4 space-y-2 rounded-2xl bg-slate-50 p-3 text-sm text-slate-800">
          <p className="font-semibold">What this means</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Internal use is free.</li>
            <li>Commercial use with signature keeps my credit in the file.</li>
            <li>Commercial use without signature needs a donation or written permission.</li>
          </ul>
        </div>

        <div className="mt-4 space-y-3">
          <CreditConsent
            estimatedCredits={ESTIMATED_CREDITS}
            currentBalance={balance}
            onAccept={() => {}}
            onDecline={() => {}}
          />
          <div className="flex flex-wrap gap-3">
            {template?.gatingLevel && template.gatingLevel !== "none" ? (
              <AccessGate
                requiredLevel="supporter"
                fallbackMessage="Supporters can download templates. Browsing stays open for everyone."
              >
                <button
                  type="button"
                  onClick={submit}
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
                  disabled={loading || !canProceed}
                >
                  {loading ? "Preparing..." : "Download"}
                </button>
              </AccessGate>
            ) : (
              <button
                type="button"
                onClick={submit}
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
                disabled={loading || !canProceed}
              >
                {loading ? "Preparing..." : "Download"}
              </button>
            )}
          <Link
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            href="/support"
          >
            Support this site
          </Link>
          {previewEnabled ? (
            <Link className="text-sm font-semibold text-slate-700 underline" href="/admin/template-permissions">
              I already have permission
            </Link>
          ) : null}
        </div>

        {status ? (
          <div
            className={`mt-3 rounded-2xl border px-3 py-2 text-sm ${
              status.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-800"
            }`}
            role="status"
          >
            {status.message}
          </div>
        ) : null}
      </div>
    </div>
  );
}
