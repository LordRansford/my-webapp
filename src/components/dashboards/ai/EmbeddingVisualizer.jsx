"use client";

import { useMemo, useState } from "react";

const corpus = [
  { text: "How to reset password", vec: [0.9, 0.1, 0.2] },
  { text: "Account security tips", vec: [0.8, 0.2, 0.3] },
  { text: "Refund policy details", vec: [0.1, 0.9, 0.1] },
  { text: "Shipping times", vec: [0.2, 0.8, 0.2] },
  { text: "Two factor setup", vec: [0.85, 0.15, 0.25] },
];

function cosine(a, b) {
  const dot = a.reduce((s, v, i) => s + v * b[i], 0);
  const na = Math.sqrt(a.reduce((s, v) => s + v * v, 0)) || 1;
  const nb = Math.sqrt(b.reduce((s, v) => s + v * v, 0)) || 1;
  return dot / (na * nb);
}

export default function EmbeddingVisualizer() {
  const [queryIdx, setQueryIdx] = useState(0);

  const neighbors = useMemo(() => {
    const q = corpus[queryIdx];
    return corpus
      .map((c, idx) => ({ ...c, idx, score: cosine(q.vec, c.vec) }))
      .sort((a, b) => b.score - a.score);
  }, [queryIdx]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <label className="text-sm text-slate-700">
        <span className="font-semibold text-slate-900">Example text</span>
        <select
          value={queryIdx}
          onChange={(e) => setQueryIdx(Number(e.target.value))}
          className="ml-2 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
        >
          {corpus.map((c, idx) => (
            <option key={idx} value={idx}>
              {c.text}
            </option>
          ))}
        </select>
      </label>

      <div className="mt-3 grid gap-2">
        {neighbors.map((n) => (
          <div
            key={n.idx}
            className={`flex items-center justify-between rounded-xl border px-3 py-2 text-sm ${
              n.idx === queryIdx ? "border-blue-200 bg-blue-50 text-blue-900" : "border-slate-200 bg-slate-50 text-slate-800"
            }`}
          >
            <span>{n.text}</span>
            <span className="text-xs font-semibold text-slate-700">sim {n.score.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
