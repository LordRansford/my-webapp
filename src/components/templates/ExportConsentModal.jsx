"use client";

import { useEffect } from "react";

export default function ExportConsentModal({
  open,
  onClose,
  onConfirm,
  intendedUse,
  setIntendedUse,
  includeAttribution,
  setIncludeAttribution,
  consentChecked,
  setConsentChecked,
  hasDonation = false,
  hasPermission = false,
  permissionInput = "",
  onPermissionChange,
  unlocksNoAttribution = false,
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const attributionDisabled = intendedUse === "commercial-with";
  const requiresEntitlement = intendedUse === "commercial-no-attr";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-consent-title"
    >
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl ring-1 ring-slate-900/5">
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="space-y-1">
            <p className="text-2xs font-semibold uppercase tracking-wide text-slate-500">Export consent</p>
            <h2 id="export-consent-title" className="text-lg font-semibold text-slate-900">
              Choose intended use
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="mt-3 grid gap-2 rounded-xl bg-slate-50/80 p-3 text-2xs text-slate-700">
          <div className="flex items-center gap-2 text-slate-800">
            <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full bg-slate-400" />
            <p>Planning aid only. Not legal advice. Use only where you have permission.</p>
          </div>
          <div className="flex items-center gap-2 text-slate-800">
            <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full bg-slate-400" />
            <p>Commercial exports keep attribution unless unlocked with donation or permission token.</p>
          </div>
        </div>

        <div className="mt-4 grid gap-2">
          <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm hover:border-slate-300">
            <input
              type="radio"
              name="intended-use"
              value="internal"
              checked={intendedUse === "internal"}
              onChange={() => setIntendedUse("internal")}
              className="mt-1 accent-sky-600"
            />
            <div>
              <p className="text-sm font-semibold text-slate-900">Internal / personal</p>
              <p className="text-xs text-slate-700">Attribution optional; keep provenance where practical.</p>
            </div>
          </label>

          <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm hover:border-slate-300">
            <input
              type="radio"
              name="intended-use"
              value="commercial-with"
              checked={intendedUse === "commercial-with"}
              onChange={() => {
                setIntendedUse("commercial-with");
                setIncludeAttribution(true);
              }}
              className="mt-1 accent-sky-600"
            />
            <div>
              <p className="text-sm font-semibold text-slate-900">Commercial or client facing</p>
              <p className="text-xs text-slate-700">Attribution footer required and locked on export.</p>
            </div>
          </label>

          <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm hover:border-slate-300">
            <input
              type="radio"
              name="intended-use"
              value="commercial-no-attr"
              checked={intendedUse === "commercial-no-attr"}
              onChange={() => {
                setIntendedUse("commercial-no-attr");
                setIncludeAttribution(false);
              }}
              className="mt-1 accent-sky-600"
            />
            <div>
              <p className="text-sm font-semibold text-slate-900">Commercial without attribution</p>
              <p className="text-xs text-slate-700">Needs donation receipt or permission token before export unlocks.</p>
            </div>
          </label>
        </div>

        <div className="mt-4 grid gap-2 rounded-xl bg-slate-50 p-3">
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={includeAttribution || attributionDisabled}
              disabled={attributionDisabled}
              onChange={(e) => setIncludeAttribution(e.target.checked)}
              className="mt-1 accent-sky-600"
            />
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Attribution footer {attributionDisabled && "(locked for commercial)"}
              </p>
              <p className="text-xs text-slate-700">Includes author, brand, version, timestamp.</p>
            </div>
          </label>

          <div className="rounded-xl border border-dashed border-sky-200 bg-white/70 p-3">
            <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full bg-slate-400" />
              Permission / donation token
            </p>
            <p className="text-xs text-slate-700">
              Paste a donation receipt token or permission code to unlock commercial exports without attribution.
            </p>
            <input
              type="text"
              value={permissionInput}
              onChange={(e) => onPermissionChange && onPermissionChange(e.target.value)}
              placeholder="Paste token"
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
            />
            <p className="mt-2 text-xs text-slate-700">
              Donation token: {hasDonation ? "Yes" : "No"} | Permission token: {hasPermission ? "Yes" : "No"}
            </p>
            {requiresEntitlement && !unlocksNoAttribution && (
              <p className="mt-1 text-xs font-semibold text-amber-700">Add a valid token to enable this option.</p>
            )}
          </div>
        </div>

        <div className="mt-3 rounded-xl bg-slate-50 p-3">
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={consentChecked}
              onChange={(e) => setConsentChecked(e.target.checked)}
              className="mt-1 accent-sky-600"
            />
            <div>
              <p className="text-sm font-semibold text-slate-900">I accept these terms</p>
              <p className="text-xs text-slate-700">
                Exports match the selected use. Attribution locks for commercial exports. Metadata is clean of AI markers.
              </p>
            </div>
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:border-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!consentChecked || (requiresEntitlement && !unlocksNoAttribution)}
            onClick={() => consentChecked && onConfirm(intendedUse, attributionDisabled ? true : includeAttribution)}
            className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            Confirm and export
          </button>
        </div>
      </div>
    </div>
  );
}
