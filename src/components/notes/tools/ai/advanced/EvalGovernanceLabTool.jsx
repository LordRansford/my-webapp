"use client";

import AIGovernanceBoard from "@/components/dashboards/ai/AIGovernanceBoard";

export default function EvalGovernanceLabTool() {
  return (
    <div className="space-y-3">
      <AIGovernanceBoard />
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
        <p className="font-semibold text-slate-900">Checklist</p>
        <p>Every entry should name a risk, an owner, and evidence that the control works.</p>
      </div>
    </div>
  );
}
