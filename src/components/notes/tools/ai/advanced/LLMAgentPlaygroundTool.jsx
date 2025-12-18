"use client";

import AgentWorkflowBuilder from "@/components/dashboards/ai/AgentWorkflowBuilder";

export default function LLMAgentPlaygroundTool() {
  return (
    <div className="space-y-3">
      <AgentWorkflowBuilder />
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
        <p className="font-semibold text-slate-900">Design notes</p>
        <p>Keep tool lists short, set clear stop conditions, and log every tool call.</p>
      </div>
    </div>
  );
}
