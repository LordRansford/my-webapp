"use client";

import { useState, useEffect } from "react";
import { formatCreditsSafe } from "@/lib/credits/format";

interface CreditConsentProps {
  estimatedCredits: number;
  currentBalance: number | null;
  onAccept?: () => void;
  onDecline?: () => void;
  disabled?: boolean;
  safetyBuffer?: number; // Multiplier for safety buffer (default 1.25)
}

/**
 * CreditConsent Component
 * 
 * Reusable component that:
 * - Shows estimated credits with clear ESTIMATE disclaimer
 * - Displays current credit balance
 * - Requires explicit user acceptance
 * - Validates sufficient credits (with safety buffer)
 * - Blocks execution if insufficient credits
 */
export default function CreditConsent({
  estimatedCredits,
  currentBalance,
  onAccept,
  onDecline,
  disabled = false,
  safetyBuffer = 1.25,
}: CreditConsentProps) {
  const [accepted, setAccepted] = useState(false);
  const requiredCredits = Math.ceil(estimatedCredits * safetyBuffer);
  const hasEnoughCredits = currentBalance !== null && currentBalance >= requiredCredits;
  const canProceed = accepted && hasEnoughCredits && !disabled;

  // Reset acceptance when estimate changes
  useEffect(() => {
    setAccepted(false);
  }, [estimatedCredits]);

  const handleAccept = () => {
    if (!hasEnoughCredits) return;
    setAccepted(true);
    onAccept?.();
  };

  const handleDecline = () => {
    setAccepted(false);
    onDecline?.();
  };

  if (estimatedCredits <= 0) {
    // No credits required, no consent needed
    return null;
  }

  if (currentBalance === null) {
    // Balance not loaded yet
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm text-slate-700">Loading credit balance...</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
      <div className="space-y-3">
        {/* Header with ESTIMATE badge */}
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-900">Credit Cost Estimate</h3>
          <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">ESTIMATE</span>
        </div>

        {/* Estimate display */}
        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <div className="flex items-baseline justify-between">
            <span className="text-xs font-medium text-slate-700">Estimated credits:</span>
            <span className="text-lg font-bold text-slate-900">{formatCreditsSafe(estimatedCredits)}</span>
          </div>
          <div className="mt-1 flex items-baseline justify-between text-xs">
            <span className="text-slate-600">Required (with safety buffer):</span>
            <span className="font-semibold text-slate-700">{formatCreditsSafe(requiredCredits)}</span>
          </div>
          <div className="mt-1 flex items-baseline justify-between text-xs">
            <span className="text-slate-600">Current balance:</span>
            <span className={`font-semibold ${hasEnoughCredits ? "text-slate-900" : "text-rose-600"}`}>
              {formatCreditsSafe(currentBalance)}
            </span>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="rounded-lg border border-amber-300 bg-amber-100/50 p-3">
          <p className="text-xs font-medium text-amber-900">
            ⚠️ <strong>This is an ESTIMATE.</strong> Actual cost may be higher or lower depending on actual execution time, complexity, and system load.
          </p>
        </div>

        {/* Insufficient credits warning */}
        {!hasEnoughCredits && (
          <div className="rounded-lg border border-rose-300 bg-rose-50 p-3">
            <p className="text-xs font-semibold text-rose-900">Insufficient Credits</p>
            <p className="mt-1 text-xs text-rose-800">
              You need at least {formatCreditsSafe(requiredCredits)} credits to proceed. Current balance: {formatCreditsSafe(currentBalance)}.
            </p>
          </div>
        )}

        {/* Acceptance checkbox */}
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="credit-consent"
            checked={accepted}
            onChange={(e) => {
              if (e.target.checked && hasEnoughCredits) {
                setAccepted(true);
                onAccept?.();
              } else {
                setAccepted(false);
              }
            }}
            disabled={!hasEnoughCredits || disabled}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <label htmlFor="credit-consent" className="text-xs text-slate-700">
            <span className="font-medium">I accept that this operation will consume credits.</span>
            <br />
            <span className="text-slate-600">
              I understand this is an estimate and actual cost may vary. I have sufficient credits to proceed.
            </span>
          </label>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          {accepted && hasEnoughCredits ? (
            <button
              type="button"
              onClick={handleDecline}
              className="text-xs text-slate-600 underline hover:text-slate-900"
            >
              Revoke acceptance
            </button>
          ) : (
            <button
              type="button"
              onClick={handleAccept}
              disabled={!hasEnoughCredits || disabled}
              className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Accept and Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Hook to check if credit consent is required and accepted
 */
export function useCreditConsent(
  estimatedCredits: number,
  currentBalance: number | null,
  safetyBuffer = 1.25
) {
  const [accepted, setAccepted] = useState(false);
  const requiredCredits = Math.ceil(estimatedCredits * safetyBuffer);
  const hasEnoughCredits = currentBalance !== null && currentBalance >= requiredCredits;
  const canProceed = estimatedCredits > 0 ? accepted && hasEnoughCredits : true; // No consent needed if no credits required

  useEffect(() => {
    if (estimatedCredits <= 0) {
      setAccepted(true); // Auto-accept if no credits needed
    }
  }, [estimatedCredits]);

  return {
    accepted,
    setAccepted,
    canProceed,
    hasEnoughCredits,
    requiredCredits,
    needsConsent: estimatedCredits > 0,
  };
}

