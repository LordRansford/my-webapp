"use client";

import { useMemo, useState } from "react";
import { Bot, ClipboardCheck, Route, ShieldCheck } from "lucide-react";

const PLANNERS = [
  { id: "one-shot", label: "One shot", note: "Single step with a clear goal." },
  { id: "reactive", label: "Reactive", note: "Plan step by step with feedback." },
  { id: "tree", label: "Tree search", note: "Branch and explore options before acting." },
];

const TOOLS = [
  { id: "search", label: "Search and browse" },
  { id: "calculator", label: "Calculator or code" },
  { id: "datastore", label: "Internal knowledge base" },
];

const MEMORY = [
  { id: "short", label: "Short term only" },
  { id: "vector", label: "Vector store lookups" },
  { id: "notes", label: "Scratchpad during the run" },
];

const GUARDS = [
  { id: "approval", label: "Human approval on actions" },
  { id: "filters", label: "Input and output filters" },
  { id: "logging", label: "Audit logs and alerts" },
];

export default function AgentFlowBuilder() {
  const [planner, setPlanner] = useState("reactive");
  const [tool, setTool] = useState(["search", "calculator"]);
  const [memory, setMemory] = useState("vector");
  const [guardrails, setGuardrails] = useState(["filters", "logging"]);

  const toggleTool = (id) => {
    setTool((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));
  };

  const toggleGuard = (id) => {
    setGuardrails((prev) => (prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]));
  };

  const preview = useMemo(() => {
    const plannerLabel = PLANNERS.find((p) => p.id === planner)?.label || "Planner";
    const memoryLabel = MEMORY.find((m) => m.id === memory)?.label || "Memory";
    const toolList = TOOLS.filter((t) => tool.includes(t.id)).map((t) => t.label).join(", ") || "No tools";
    const guardList = GUARDS.filter((g) => guardrails.includes(g.id)).map((g) => g.label).join(", ") || "No guardrails";
    return { plannerLabel, memoryLabel, toolList, guardList };
  }, [planner, tool, memory, guardrails]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 ring-1 ring-amber-100">
          <Bot className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">Design an agent flow</p>
          <p className="text-xs text-slate-600">Pick planner, tools, memory, and guardrails, then see the flow.</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-700">
          <p className="text-xs font-semibold text-slate-800">Planner</p>
          <div className="mt-2 grid gap-2">
            {PLANNERS.map((item) => (
              <label key={item.id} className="flex items-start gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                <input
                  type="radio"
                  name="planner"
                  value={item.id}
                  checked={planner === item.id}
                  onChange={() => setPlanner(item.id)}
                  className="mt-[2px] accent-amber-600"
                />
                <div>
                  <p className="text-[11px] font-semibold text-slate-900">{item.label}</p>
                  <p className="text-[11px] text-slate-600">{item.note}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700">
          <p className="text-xs font-semibold text-slate-800">Tools</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {TOOLS.map((item) => (
              <label key={item.id} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2">
                <input
                  type="checkbox"
                  value={item.id}
                  checked={tool.includes(item.id)}
                  onChange={() => toggleTool(item.id)}
                  className="accent-amber-600"
                />
                <span className="text-[11px] font-semibold text-slate-800">{item.label}</span>
              </label>
            ))}
          </div>

          <div className="mt-4 grid gap-2">
            <label className="text-[11px] font-semibold text-slate-800">Memory</label>
            <select
              value={memory}
              onChange={(event) => setMemory(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-800"
            >
              {MEMORY.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="rounded-2xl border border-slate-200 bg-white p-3">
          <p className="text-xs font-semibold text-slate-900">Agent route</p>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-700">
            <span className="rounded-xl bg-slate-100 px-3 py-2 font-semibold text-slate-800">User</span>
            <span className="text-slate-400">→</span>
            <span className="rounded-xl bg-amber-50 px-3 py-2 font-semibold text-amber-800">{preview.plannerLabel}</span>
            <span className="text-slate-400">→</span>
            <span className="rounded-xl bg-slate-100 px-3 py-2 font-semibold text-slate-800">{preview.toolList}</span>
            <span className="text-slate-400">→</span>
            <span className="rounded-xl bg-slate-100 px-3 py-2 font-semibold text-slate-800">{preview.memoryLabel}</span>
            <span className="text-slate-400">→</span>
            <span className="rounded-xl bg-emerald-50 px-3 py-2 font-semibold text-emerald-800">Answer with citations</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-[11px] text-slate-700">
          <p className="flex items-center gap-2 text-xs font-semibold text-slate-900">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Guardrails
          </p>
          <div className="mt-2 space-y-2">
            {GUARDS.map((item) => (
              <label key={item.id} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                <input
                  type="checkbox"
                  value={item.id}
                  checked={guardrails.includes(item.id)}
                  onChange={() => toggleGuard(item.id)}
                  className="accent-emerald-600"
                />
                <span className="text-[11px] font-semibold text-slate-800">{item.label}</span>
              </label>
            ))}
          </div>
          <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-2 text-[11px] text-emerald-800">
            <p className="font-semibold">Flow summary</p>
            <p>
              Tools: {preview.toolList}. Memory: {preview.memoryLabel}. Guardrails: {preview.guardList}.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-slate-600">
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700">
          <Route className="h-3.5 w-3.5" aria-hidden="true" />
          Planner runs the loop
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700">
          <ClipboardCheck className="h-3.5 w-3.5" aria-hidden="true" />
          Keep logs for every tool call
        </span>
      </div>
    </div>
  );
}
