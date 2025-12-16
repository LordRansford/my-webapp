"use client";

import { useState } from "react";

const samples = [
  { text: ["I", "love", "simple", "examples"], weights: [[0.1,0.3,0.3,0.3],[0.2,0.2,0.3,0.3]] },
  { text: ["Security", "matters", "to", "everyone"], weights: [[0.4,0.2,0.2,0.2],[0.1,0.5,0.2,0.2]] },
];

export default function TransformerAttentionExplorer() {
  const [sampleIdx, setSampleIdx] = useState(0);
  const [headIdx, setHeadIdx] = useState(0);
  const sample = samples[sampleIdx];
  const weights = sample.weights[headIdx];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap gap-3 text-sm text-slate-700">
        <label>
          <span className="font-semibold text-slate-900">Sentence</span>
          <select
            value={sampleIdx}
            onChange={(e) => setSampleIdx(Number(e.target.value))}
            className="ml-2 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            {samples.map((s, idx) => (
              <option key={idx} value={idx}>
                {s.text.join(" ")}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="font-semibold text-slate-900">Head</span>
          <select
            value={headIdx}
            onChange={(e) => setHeadIdx(Number(e.target.value))}
            className="ml-2 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            {sample.weights.map((_, idx) => (
              <option key={idx} value={idx}>
                {idx + 1}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-3 space-y-2">
        {sample.text.map((token, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
            <span className="w-24 font-semibold text-slate-900">{token}</span>
            <div className="h-2 flex-1 rounded-full bg-slate-200">
              <div className="h-2 rounded-full bg-blue-600" style={{ width: `${weights[i] * 100}%` }} />
            </div>
            <span className="w-10 text-right">{(weights[i] * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-slate-700">Toy attention weights showing focus per token for the chosen head.</p>
    </div>
  );
}
