"use client";

import { useState } from "react";

const seed = [
  { name: "Support bot", purpose: "Assist customers", data: "Chat transcripts", risk: "Medium", mitigations: "Human review" },
  { name: "Fraud scorer", purpose: "Flag risky transactions", data: "Payments", risk: "High", mitigations: "Explainability + audit" },
];

export default function AIGovernanceBoard() {
  const [items, setItems] = useState(seed);
  const [draft, setDraft] = useState({ name: "", purpose: "", data: "", risk: "Medium", mitigations: "" });

  const add = () => {
    if (!draft.name.trim()) return;
    setItems((p) => [...p, draft]);
    setDraft({ name: "", purpose: "", data: "", risk: "Medium", mitigations: "" });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-2 md:grid-cols-2 text-sm text-slate-700">
        <input
          value={draft.name}
          onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
          placeholder="System name"
          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
        <input
          value={draft.purpose}
          onChange={(e) => setDraft((p) => ({ ...p, purpose: e.target.value }))}
          placeholder="Purpose"
          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
        <input
          value={draft.data}
          onChange={(e) => setDraft((p) => ({ ...p, data: e.target.value }))}
          placeholder="Data used"
          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
        <select
          value={draft.risk}
          onChange={(e) => setDraft((p) => ({ ...p, risk: e.target.value }))}
          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
        >
          {["Low", "Medium", "High"].map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
        <input
          value={draft.mitigations}
          onChange={(e) => setDraft((p) => ({ ...p, mitigations: e.target.value }))}
          placeholder="Mitigations"
          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 md:col-span-2"
        />
        <button
          onClick={add}
          className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 md:col-span-2"
        >
          Add entry
        </button>
      </div>

      <div className="mt-4 grid gap-2 md:grid-cols-2">
        {items.map((i, idx) => (
          <div
            key={idx}
            className={`rounded-xl border px-3 py-2 text-sm shadow-sm ${
              i.risk === "High" ? "border-rose-200 bg-rose-50" : i.risk === "Medium" ? "border-amber-200 bg-amber-50" : "border-slate-200 bg-slate-50"
            }`}
          >
            <p className="font-semibold text-slate-900">{i.name}</p>
            <p className="text-xs text-slate-700">Purpose: {i.purpose}</p>
            <p className="text-xs text-slate-700">Data: {i.data}</p>
            <p className="text-xs text-slate-700">Mitigations: {i.mitigations || "Add mitigations"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
