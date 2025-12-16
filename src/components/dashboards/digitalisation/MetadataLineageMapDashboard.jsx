"use client";

import { useState } from "react";

export default function MetadataLineageMapDashboard() {
  const [links, setLinks] = useState([
    { from: "CRM.email", to: "DataHub.customer_email", note: "Lowercase + trim" },
  ]);
  const [draft, setDraft] = useState({ from: "", to: "", note: "" });

  const addLink = () => {
    if (!draft.from || !draft.to) return;
    setLinks((prev) => [...prev, draft]);
    setDraft({ from: "", to: "", note: "" });
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-3">
          <input
            value={draft.from}
            onChange={(e) => setDraft((p) => ({ ...p, from: e.target.value }))}
            placeholder="Source field (e.g., system.field)"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          <input
            value={draft.to}
            onChange={(e) => setDraft((p) => ({ ...p, to: e.target.value }))}
            placeholder="Target field"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          <input
            value={draft.note}
            onChange={(e) => setDraft((p) => ({ ...p, note: e.target.value }))}
            placeholder="Transformation note"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          <button
            onClick={addLink}
            className="w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            Add link
          </button>
        </div>

        <div className="space-y-2">
          {links.map((link, idx) => (
            <div key={idx} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800">
              <span className="font-semibold text-slate-900">{link.from}</span>
              <span className="text-slate-400">→</span>
              <span className="font-semibold text-slate-900">{link.to}</span>
              <span className="text-xs text-slate-600">({link.note || "No transform noted"})</span>
            </div>
          ))}
          <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800">
            Fields without a source or definition stand out—fill those gaps early to build trust.
          </div>
        </div>
      </div>
    </div>
  );
}
