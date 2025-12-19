"use client";

import { useEffect, useMemo, useState } from "react";
import { ClipboardCheck, Shield } from "lucide-react";

const USE_CASES = [
  { id: "support", label: "Customer support assistant" },
  { id: "reports", label: "Internal reporting summariser" },
  { id: "code", label: "Developer helper" },
];

const CHECKS = [
  { id: "data", label: "Data permission and retention" },
  { id: "safety", label: "Prompt and output guardrails" },
  { id: "eval", label: "Offline and online evaluation" },
  { id: "monitor", label: "Logging, alerts, and rollback" },
  { id: "humans", label: "Human review for high risk paths" },
];

export default function GovernanceChecklistLab() {
  const [useCase, setUseCase] = useState(USE_CASES[0].id);
  const [selected, setSelected] = useState(["data", "safety", "monitor"]);
  const [owner, setOwner] = useState("AI team");
  const [plan, setPlan] = useState("");

  const toggle = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const planText = useMemo(() => {
    const title = USE_CASES.find((item) => item.id === useCase)?.label || "AI use case";
    const checks = CHECKS.filter((item) => selected.includes(item.id))
      .map((item) => `- ${item.label}`)
      .join("\n");
    return `${title}\nOwner: ${owner}\n\nControls to prove:\n${checks || "- Decide the controls first."}\n\nEvidence to capture:\n- Risks logged with status\n- Evaluation results with metrics\n- Monitoring runbook and alert channels`;
  }, [useCase, selected, owner]);

  useEffect(() => {
    setPlan(planText);
  }, [planText]);

  const copyPlan = async () => {
    if (!navigator?.clipboard?.writeText) return;
    try {
      await navigator.clipboard.writeText(planText);
    } catch (error) {
      console.error("Clipboard copy failed", error);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
          <Shield className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">Build an AI governance checklist</p>
          <p className="text-xs text-slate-600">Pick a use case, select controls, and export an action plan.</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-700">
          <label className="text-[11px] font-semibold text-slate-800">Use case</label>
          <select
            value={useCase}
            onChange={(event) => setUseCase(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800"
          >
            {USE_CASES.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>

          <label className="mt-3 block text-[11px] font-semibold text-slate-800">Owner</label>
          <input
            value={owner}
            onChange={(event) => setOwner(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800"
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700">
          <p className="text-xs font-semibold text-slate-800">Controls</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-1">
            {CHECKS.map((item) => (
              <label key={item.id} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2">
                <input
                  type="checkbox"
                  value={item.id}
                  checked={selected.includes(item.id)}
                  onChange={() => toggle(item.id)}
                  className="accent-emerald-600"
                />
                <span className="text-[11px] font-semibold text-slate-800">{item.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
          <p className="flex items-center gap-2 text-xs font-semibold text-slate-900">
            <ClipboardCheck className="h-4 w-4" aria-hidden="true" />
            Action plan
          </p>
          <textarea
            value={plan}
            readOnly
            rows={8}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800"
          />
          <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-600">
            <span className="rounded-full bg-slate-100 px-2 py-0.5 font-semibold text-slate-700">Red teaming</span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 font-semibold text-slate-700">Approvals</span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 font-semibold text-slate-700">Model card</span>
          </div>
        </div>

        <div className="space-y-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-[11px] text-emerald-800">
          <p className="font-semibold">Tips</p>
          <ul className="list-disc pl-4">
            <li>Make one person accountable for each control.</li>
            <li>Keep evidence small: screenshots, short notes, metrics.</li>
            <li>Run red teaming before launch and after big changes.</li>
          </ul>
          <button
            type="button"
            onClick={copyPlan}
            className="mt-2 inline-flex items-center justify-center rounded-full bg-emerald-600 px-3 py-1 text-[11px] font-semibold text-white hover:bg-emerald-700"
          >
            Copy plan
          </button>
        </div>
      </div>
    </div>
  );
}
