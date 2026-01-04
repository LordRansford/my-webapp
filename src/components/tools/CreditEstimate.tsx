"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { ToolContract } from "./ToolShell";

interface CreditEstimateProps {
  contract: ToolContract;
  mode: "local" | "compute";
  inputs: Record<string, unknown>;
}

/**
 * Calculates and displays estimated credits for a tool run.
 * Updates live as inputs change.
 */
export default function CreditEstimate({ contract, mode, inputs }: CreditEstimateProps) {
  const [serverEstimate, setServerEstimate] = useState<{
    estimatedCreditCost: number;
    willChargeCredits: boolean;
    freeTierRemainingMs: number;
    estimatedWallTimeMs: number;
    reasons?: string[];
  } | null>(null);
  const [serverEstimateError, setServerEstimateError] = useState<string | null>(null);

  const inputBytes = useMemo(() => {
    let bytes = 0;
    for (const value of Object.values(inputs)) {
      if (value !== null && value !== undefined) {
        const str = typeof value === "string" ? value : JSON.stringify(value);
        bytes += new Blob([str]).size;
      }
    }
    return bytes;
  }, [inputs]);

  // Prefer the authoritative estimate engine for compute-mode tools.
  useEffect(() => {
    let alive = true;
    async function fetchEstimate() {
      if (mode !== "compute") {
        setServerEstimate(null);
        setServerEstimateError(null);
        return;
      }

      // Only estimate server-side runs (avoid noise for local-only tools).
      if (!contract.runner || !String(contract.runner).startsWith("/api/")) {
        setServerEstimate(null);
        setServerEstimateError(null);
        return;
      }

      try {
        setServerEstimateError(null);
        const res = await fetch("/api/compute/estimate", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            toolId: contract.id,
            inputBytes,
            requestedComplexityPreset: "light",
          }),
        });
        const data = await res.json().catch(() => null);
        if (!alive) return;
        if (!res.ok || !data?.ok) {
          setServerEstimate(null);
          setServerEstimateError(typeof data?.error === "string" ? data.error : "Estimate unavailable");
          return;
        }
        setServerEstimate({
          estimatedCreditCost: Number(data.estimatedCreditCost || 0),
          willChargeCredits: Boolean(data.willChargeCredits),
          freeTierRemainingMs: Number(data.freeTierRemainingMs || 0),
          estimatedWallTimeMs: Number(data.estimatedWallTimeMs || 0),
          reasons: Array.isArray(data.reasons) ? data.reasons : [],
        });
      } catch (e) {
        if (!alive) return;
        setServerEstimate(null);
        setServerEstimateError("Estimate unavailable");
      }
    }
    fetchEstimate();
    return () => {
      alive = false;
    };
  }, [contract.id, contract.runner, inputBytes, mode]);

  const estimatedCredits = useMemo(() => {
    if (mode === "local") {
      return 0;
    }

    if (serverEstimate) {
      return serverEstimate.estimatedCreditCost;
    }

    const { baseCredits, perKbCredits, complexityMultiplierHints = {} } = contract.creditModel;

    // Calculate input size in KB
    const inputKb = Math.ceil(inputBytes / 1024);

    // Calculate complexity multiplier
    let complexityMultiplier = 1;
    const codeInput = inputs.code as string | undefined;
    if (codeInput && typeof codeInput === "string") {
      const code = codeInput.toLowerCase();
      
      // JS/Python complexity hints
      if (complexityMultiplierHints.hasLoops) {
        const hasLoops = /\b(for|while|do\s*\{)\b/.test(code);
        if (hasLoops) complexityMultiplier *= complexityMultiplierHints.hasLoops;
      }
      
      if (complexityMultiplierHints.hasAsync) {
        const hasAsync = /\b(async|await|Promise|then|catch)\b/.test(code);
        if (hasAsync) complexityMultiplier *= complexityMultiplierHints.hasAsync;
      }
      
      if (complexityMultiplierHints.hasImports) {
        const hasImports = /\b(import|from|require)\b/.test(code);
        if (hasImports) complexityMultiplier *= complexityMultiplierHints.hasImports;
      }
      
      // SQL complexity hints
      if (complexityMultiplierHints.hasJoins) {
        const hasJoins = /\b(join|inner join|left join|right join)\b/i.test(code);
        if (hasJoins) complexityMultiplier *= complexityMultiplierHints.hasJoins;
      }
      
      if (complexityMultiplierHints.hasGroupBy) {
        const hasGroupBy = /\b(group by|having)\b/i.test(code);
        if (hasGroupBy) complexityMultiplier *= complexityMultiplierHints.hasGroupBy;
      }
    }

    const estimated = baseCredits + inputKb * perKbCredits * complexityMultiplier;
    return Math.ceil(estimated * 10) / 10; // Round to 1 decimal
  }, [contract, mode, inputs]);

  const explanation = useMemo(() => {
    if (mode === "local") {
      return "Local mode runs entirely in your browser. No credits required.";
    }

    if (serverEstimate) {
      const seconds = Math.max(0, Math.round(serverEstimate.estimatedWallTimeMs / 1000));
      const freeSeconds = Math.max(0, Math.round(serverEstimate.freeTierRemainingMs / 1000));
      const suffix = serverEstimate.willChargeCredits ? "This estimate may change based on runtime." : "This run is likely within your free tier.";
      return `Estimated runtime: ~${seconds}s. Free tier remaining today: ~${freeSeconds}s. ${suffix}`;
    }

    if (serverEstimateError) {
      return serverEstimateError;
    }

    const parts: string[] = [];
    if (contract.creditModel.baseCredits > 0) {
      parts.push(`Base: ${contract.creditModel.baseCredits} credits`);
    }
    if (contract.creditModel.perKbCredits > 0) {
      let inputBytes = 0;
      for (const val of Object.values(inputs)) {
        if (val !== null && val !== undefined) {
          const str = typeof val === "string" ? val : JSON.stringify(val);
          inputBytes += new Blob([str]).size;
        }
      }
      const inputKb = Math.ceil(inputBytes / 1024);
      if (inputKb > 0) {
        parts.push(`Input size: ${inputKb}KB × ${contract.creditModel.perKbCredits} credits/KB`);
      }
    }
    if (Object.keys(contract.creditModel.complexityMultiplierHints || {}).length > 0) {
      parts.push("Complexity multiplier applied");
    }

    return parts.length > 0 ? parts.join("; ") : "Standard compute cost";
  }, [contract, mode, inputs]);

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-slate-900">
              Estimated credits this run: <span className="text-lg">{estimatedCredits}</span>
            </p>
            {mode === "compute" && estimatedCredits > 0 && (
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">ESTIMATE</span>
            )}
          </div>
          <p className="mt-1 text-xs text-slate-600">{explanation}</p>
          {mode === "compute" && estimatedCredits > 0 && (
            <p className="mt-2 text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded px-2 py-1">
              ⚠️ This is an estimate. Actual cost may be higher or lower depending on actual execution time and complexity.
            </p>
          )}
        </div>
        {mode === "compute" && estimatedCredits > 0 && (
          <button
            type="button"
            className="text-xs text-slate-600 underline hover:text-slate-900 ml-2"
            title="Why this estimate"
            onClick={(e) => {
              e.preventDefault();
              alert(explanation);
            }}
          >
            ℹ️
          </button>
        )}
      </div>
    </div>
  );
}

