"use client";

import { useMemo, useState } from "react";

export default function AIUseCasePortfolio() {
  const [items, setItems] = useState([
    { name: "Support summarisation", value: 7, complexity: 3, risk: 2, data: 8 },
    { name: "Fraud signals", value: 8, complexity: 6, risk: 5, data: 6 },
  ]);
  const [draft, setDraft] = useState({ name: "", value: 5, complexity: 5, risk: 5, data: 5 });

  const add = () => {
    if (!draft.name.trim()) return;
    setItems((p) => [...p, draft]);
    setDraft({ name: "", value: 5, complexity: 5, risk: 5, data: 5 });
  };

  const quadrant = (i) => {
    if (i.value >= 7 && i.complexity <= 5) return "Quick win";
    if (i.value >= 7) return "Strategic bet";
    if (i.complexity <= 4) return "Easy improvement";
    return "Later";
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-2 md:grid-cols-2 text-sm text-slate-700">
        <input
          value={draft.name}
          onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
          placeholder="Use case name"
          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
        {["value", "complexity", "risk", "data"].map((key) => (
          <label key={key} className="flex items-center gap-2">
            <span className="w-24 capitalize text-xs font-semibold text-slate-900">{key}</span>
            <input
              type="range"
              min="1"
              max="10"
              value={draft[key]}
              onChange={(e) => setDraft((p) => ({ ...p, [key]: Number(e.target.value) }))}
              className="flex-1 accent-blue-600"
            />
            <span className="w-6 text-xs text-slate-600">{draft[key]}</span>
          </label>
        ))}
        <button
          onClick={add}
          className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 md:col-span-2"
        >
          Add use case
        </button>
      </div>

      <div className="mt-4 grid gap-2 md:grid-cols-2">
        {items.map((i, idx) => (
          <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800">
            <p className="font-semibold text-slate-900">{i.name}</p>
            <p className="text-xs text-slate-600">
              Value {i.value} · Complexity {i.complexity} · Risk {i.risk} · Data {i.data}
            </p>
            <p className="mt-1 text-xs font-semibold text-emerald-700">{quadrant(i)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
