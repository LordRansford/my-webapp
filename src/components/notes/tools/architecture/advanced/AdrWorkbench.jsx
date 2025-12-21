"use client";

import { useState } from "react";
import { ClipboardList, Tag, AlertCircle } from "lucide-react";

const DEFAULT_DECISIONS = [
  { id: 1, title: "Adopt CQRS for billing", status: "Accepted", risk: "Medium" },
  { id: 2, title: "Introduce shared cache layer", status: "Proposed", risk: "Low" },
];

export default function AdrWorkbench() {
  const [decisions, setDecisions] = useState(DEFAULT_DECISIONS);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("Proposed");
  const [risk, setRisk] = useState("Low");

  const addDecision = () => {
    if (!title.trim()) return;
    const nextId = decisions.length ? Math.max(...decisions.map((d) => d.id)) + 1 : 1;
    setDecisions((prev) => [...prev, { id: nextId, title: title.trim(), status, risk }]);
    setTitle("");
    setStatus("Proposed");
    setRisk("Low");
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 ring-1 ring-amber-100">
          <ClipboardList className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">Architecture decision workbench</p>
          <p className="text-xs text-slate-600">Capture decisions with status and risk tags.</p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">New decision</p>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          placeholder="Decision summary"
        />
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            <option>Proposed</option>
            <option>Accepted</option>
            <option>Rejected</option>
          </select>
          <select
            value={risk}
            onChange={(event) => setRisk(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
        <button
          type="button"
          onClick={addDecision}
          className="mt-3 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-200"
        >
          Add decision
        </button>
      </div>

      <div className="mt-4 grid gap-2">
        {decisions.map((decision) => (
          <div key={decision.id} className="rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700">
            <p className="text-sm font-semibold text-slate-900">{decision.title}</p>
            <div className="mt-2 flex flex-wrap gap-2 text-sm text-slate-600">
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1">
                <Tag className="h-3 w-3" aria-hidden="true" />
                {decision.status}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-amber-700">
                <AlertCircle className="h-3 w-3" aria-hidden="true" />
                Risk {decision.risk}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
