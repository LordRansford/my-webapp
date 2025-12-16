"use client";

import { useMemo, useState } from "react";

const docs = [
  { id: 1, title: "Refund policy", text: "Refunds within 30 days with receipt." },
  { id: 2, title: "Shipping", text: "Standard shipping 3-5 days, express 1-2 days." },
  { id: 3, title: "Security", text: "2FA recommended for all accounts." },
];

export default function RetrievalSandbox() {
  const [query, setQuery] = useState("refund");

  const matches = useMemo(() => {
    return docs
      .map((d) => ({
        ...d,
        score: query ? d.text.toLowerCase().includes(query.toLowerCase()) ? 1 : 0 : 0,
      }))
      .filter((d) => d.score > 0)
      .slice(0, 3);
  }, [query]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <label className="block text-sm text-slate-700">
        <span className="font-semibold text-slate-900">Query</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          placeholder="Ask about policy, shipping, security..."
        />
      </label>

      <div className="mt-3 space-y-2">
        {matches.length === 0 && <p className="text-xs text-slate-600">No documents retrieved yet.</p>}
        {matches.map((m) => (
          <div key={m.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800">
            <p className="font-semibold text-slate-900">{m.title}</p>
            <p className="text-xs text-slate-700">{m.text}</p>
          </div>
        ))}
      </div>

      {matches.length > 0 && (
        <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-700">
          <p className="font-semibold text-slate-900">Synthetic answer</p>
          <p>
            Based on retrieved context: {matches.map((m) => m.title).join(", ")}. This shows how retrieval shapes the answer
            without calling any external model.
          </p>
        </div>
      )}
    </div>
  );
}
