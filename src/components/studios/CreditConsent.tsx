"use client";

import React, { useState, memo, useMemo } from "react";
import { AlertCircle, Zap, X, CheckCircle2 } from "lucide-react";
import SecureErrorBoundary from "@/components/studios/SecureErrorBoundary";

interface CreditConsentProps {
  creditsRequired: number;
  operation: string;
  onConsent: () => void;
  onCancel: () => void;
  estimatedCost?: string;
  className?: string;
}

const CreditConsent = memo(function CreditConsent({
  creditsRequired,
  operation,
  onConsent,
  onCancel,
  estimatedCost,
  className = ""
}: CreditConsentProps) {
  const [understood, setUnderstood] = useState(false);

  // Get user's current credit balance (would come from API in production)
  const currentCredits = 1000; // Placeholder

  // Memoize computed values
  const canProceed = useMemo(() => 
    understood && currentCredits >= creditsRequired,
    [understood, currentCredits, creditsRequired]
  );
  
  const hasInsufficientCredits = useMemo(() => 
    currentCredits < creditsRequired,
    [currentCredits, creditsRequired]
  );
  
  const creditsNeeded = useMemo(() => 
    creditsRequired - currentCredits,
    [creditsRequired, currentCredits]
  );

  return (
    <SecureErrorBoundary studio="studios">
      <div className={`rounded-2xl border-2 border-amber-200 bg-amber-50/50 p-6 ${className}`}>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
              <Zap className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Compute Credit Required
            </h3>
            <p className="text-sm text-slate-700 mb-4">
              This operation requires <strong>{creditsRequired} credits</strong> to execute.
            </p>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-sm text-slate-700">Operation:</span>
                <span className="text-sm font-semibold text-slate-900">{operation}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-sm text-slate-700">Credits Required:</span>
                <span className="text-sm font-semibold text-amber-600">{creditsRequired}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-sm text-slate-700">Your Balance:</span>
                <span className={`text-sm font-semibold ${currentCredits >= creditsRequired ? "text-emerald-600" : "text-rose-600"}`}>
                  {currentCredits}
                </span>
              </div>
              {estimatedCost && (
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-sm text-slate-700">Estimated Cost:</span>
                  <span className="text-sm font-semibold text-slate-900">{estimatedCost}</span>
                </div>
              )}
            </div>

            {hasInsufficientCredits && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-rose-900">Insufficient Credits</p>
                    <p className="text-xs text-rose-700 mt-1">
                      You need {creditsNeeded} more credits to proceed. 
                      <a href="/compute" className="underline ml-1 hover:text-rose-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 rounded">Purchase credits</a>
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-4">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={understood}
                  onChange={(e) => setUnderstood(e.target.checked)}
                  className="mt-1 w-4 h-4 text-amber-600 border-slate-300 rounded focus:ring-amber-500"
                />
                <span className="text-sm text-slate-700">
                  I understand that <strong>{creditsRequired} credits</strong> will be deducted from my account when I proceed.
                </span>
              </label>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onConsent}
                disabled={!canProceed}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 ${
                  canProceed
                    ? "bg-amber-600 hover:bg-amber-700 text-white shadow-sm"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
                aria-label="Proceed with operation"
                type="button"
              >
                Proceed with Operation
              </button>
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded-lg font-semibold text-sm bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
                aria-label="Cancel operation"
                type="button"
              >
                Cancel
              </button>
            </div>

            <p className="text-xs text-slate-600 mt-4">
              <a 
                href="/compute" 
                className="underline hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 rounded"
              >
                Learn more about compute credits
              </a>
            </p>
          </div>
        </div>
      </div>
    </SecureErrorBoundary>
  );
});

export default CreditConsent;


