"use client";

import PromptPlayground from "@/components/dashboards/ai/PromptPlayground";

export default function PromptPatternLabTool() {
  return (
    <div className="space-y-3">
      <PromptPlayground />
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
        <p className="font-semibold text-slate-900">Pattern tip</p>
        <p>Try adding a clear output format, then remove it and notice the drift.</p>
      </div>
    </div>
  );
}
