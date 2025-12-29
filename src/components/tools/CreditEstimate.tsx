"use client";

import React, { useMemo } from "react";
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
  const estimatedCredits = useMemo(() => {
    if (mode === "local") {
      return 0;
    }

    const { baseCredits, perKbCredits, complexityMultiplierHints = {} } = contract.creditModel;

    // Calculate input size in KB
    let inputBytes = 0;
    for (const [key, value] of Object.entries(inputs)) {
      if (value !== null && value !== undefined) {
        const str = typeof value === "string" ? value : JSON.stringify(value);
        inputBytes += new Blob([str]).size;
      }
    }
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

