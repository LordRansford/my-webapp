/**
 * Credit Estimate Component
 * 
 * Displays credit estimation for tool runs, with min/typical/max values
 * and explanations. Handles client-side vs server-side tools.
 */

"use client";

import React, { useState, useEffect } from "react";
import { CreditCard, Zap, Info, Loader2 } from "lucide-react";
import { getToolDefinition, isClientSideOnly } from "@/lib/tools/registry";

interface CreditEstimate {
  min: number;
  typical: number;
  max: number;
  explanation: string;
}

interface CreditEstimateProps {
  toolId: string;
  requestedLimits?: {
    cpuMs?: number;
    memMb?: number;
    durationMs?: number;
  };
  onEstimateChange?: (estimate: CreditEstimate | null) => void;
  className?: string;
}

export default function CreditEstimate({
  toolId,
  requestedLimits,
  onEstimateChange,
  className = "",
}: CreditEstimateProps) {
  const [estimate, setEstimate] = useState<CreditEstimate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEstimate() {
      const tool = getToolDefinition(toolId);
      if (!tool) {
        setError("Tool not found");
        return;
      }

      // Client-side only tools: 0 credits
      if (isClientSideOnly(toolId)) {
        const clientSideEstimate: CreditEstimate = {
          min: 0,
          typical: 0,
          max: 0,
          explanation: "Client-side tool: no credits required",
        };
        setEstimate(clientSideEstimate);
        onEstimateChange?.(clientSideEstimate);
        return;
      }

      // Server-side tools: fetch from API
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/billing/estimate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            toolId,
            requestedLimits,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to estimate credits");
        }

        const data = await response.json();
        setEstimate(data.estimate);
        onEstimateChange?.(data.estimate);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load estimate");
        onEstimateChange?.(null);
      } finally {
        setLoading(false);
      }
    }

    fetchEstimate();
  }, [toolId, JSON.stringify(requestedLimits), onEstimateChange]);

  if (loading) {
    return (
      <div className={`flex items-center gap-2 text-sm text-slate-600 ${className}`}>
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Calculating credits...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 ${className}`}>
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Estimate unavailable</p>
            <p className="text-xs mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!estimate) {
    return null;
  }

  // Client-side tool: show "0 credits" badge
  if (estimate.min === 0 && estimate.max === 0) {
    return (
      <div className={`inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm text-emerald-800 ${className}`}>
        <Zap className="w-4 h-4" />
        <span className="font-semibold">Local mode, 0 credits</span>
      </div>
    );
  }

  // Server-side tool: show credit range
  const isVariable = estimate.min !== estimate.max;
  const displayValue = isVariable ? `${estimate.min}-${estimate.max}` : estimate.typical.toString();

  return (
    <div className={`rounded-lg border border-slate-200 bg-slate-50 p-3 ${className}`}>
      <div className="flex items-start gap-3">
        <CreditCard className="w-5 h-5 text-slate-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-sm font-semibold text-slate-900">
              Estimated credits:
            </span>
            <span className="text-lg font-bold text-slate-900">
              {displayValue}
            </span>
            {isVariable && (
              <span className="text-xs text-slate-500">
                (typical: {estimate.typical})
              </span>
            )}
          </div>
          {estimate.explanation && (
            <p className="text-xs text-slate-600 mt-1">{estimate.explanation}</p>
          )}
        </div>
      </div>
    </div>
  );
}
