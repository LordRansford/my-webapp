import React from "react";
import { confidenceFromCompletion } from "@/utils/templateMath";

type ConfidenceIndicatorProps = {
  completionRatio: number;
  validationErrors: number;
};

const badgeTone: Record<string, string> = {
  "High confidence": "bg-emerald-100 text-emerald-900 ring-emerald-200",
  "Medium confidence": "bg-amber-100 text-amber-900 ring-amber-200",
  "Low confidence": "bg-rose-100 text-rose-900 ring-rose-200",
};

export function ConfidenceIndicator({ completionRatio, validationErrors }: ConfidenceIndicatorProps) {
  const label = confidenceFromCompletion(completionRatio, validationErrors);
  const tone = badgeTone[label] || badgeTone["Medium confidence"];
  const percent = Math.round(completionRatio * 100);

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/80 p-3 shadow-sm">
      <div className="space-y-1">
        <p className="text-sm font-semibold text-slate-900">Confidence indicator</p>
        <p className="text-xs text-slate-600">
          Based on how many fields are completed and current validation results.
        </p>
      </div>
      <div className="text-right">
        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${tone}`}>
          {label}
        </span>
        <p className="text-sm text-slate-500 mt-1">{percent}% complete</p>
      </div>
    </div>
  );
}

export default ConfidenceIndicator;
