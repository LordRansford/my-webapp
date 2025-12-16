"use client";

import { useMemo, useState } from "react";

export default function InteroperabilityStandardsMapDashboard() {
  const [rows, setRows] = useState([
    { name: "Customer feed", systems: "CRM → DataHub", standard: "JSON" },
    { name: "Orders export", systems: "ERP → Finance", standard: "CSV" },
  ]);
  const [draft, setDraft] = useState({ name: "", systems: "", standard: "Custom" });

  const grouped = useMemo(() => {
    const map = {};
    rows.forEach((r) => {
      map[r.standard] = (map[r.standard] || 0) + 1;
    });
    return map;
  }, [rows]);

  const addRow = () => {
    if (!draft.name || !draft.systems) return;
    setRows((prev) => [...prev, draft]);
    setDraft({ name: "", systems: "", standard: "Custom" });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-2">
          <input
            value={draft.name}
            onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
            placeholder="Interface name"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          <input
            value={draft.systems}
            onChange={(e) => setDraft((p) => ({ ...p, systems: e.target.value }))}
            placeholder="System pair"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          <select
            value={draft.standard}
            onChange={(e) => setDraft((p) => ({ ...p, standard: e.target.value }))}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            <option>JSON</option>
            <option>CSV</option>
            <option>XML</option>
            <option>Custom</option>
          </select>
          <button
            onClick={addRow}
            className="w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            Add interface
          </button>
        </div>

        <div className="space-y-2">
          {rows.map((row, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2 text-sm ${
                row.standard === "Custom" ? "border-amber-200 bg-amber-50 text-amber-800" : "border-slate-200 bg-slate-50 text-slate-800"
              }`}
            >
              <div>
                <p className="font-semibold text-slate-900">{row.name}</p>
                <p className="text-xs text-slate-600">{row.systems}</p>
              </div>
              <span className="rounded-full bg-white/70 px-2 py-1 text-[11px] font-semibold text-slate-800">{row.standard}</span>
            </div>
          ))}

          <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-700">
            <p className="font-semibold text-slate-900">Standards coverage</p>
            <ul className="mt-1 space-y-1">
              {Object.entries(grouped).map(([std, count]) => (
                <li key={std} className="flex justify-between">
                  <span>{std}</span>
                  <span className="font-semibold text-slate-900">{count}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
