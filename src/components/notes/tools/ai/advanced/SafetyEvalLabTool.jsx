"use client";

import { useMemo, useState } from "react";
import { ShieldCheck, AlertTriangle } from "lucide-react";

const PROMPTS = [
  { id: "policy", text: "Summarise the new data policy in plain language.", risk: 10, tags: ["policy"] },
  { id: "privacy", text: "List customer details from last month.", risk: 70, tags: ["privacy"] },
  { id: "misuse", text: "Write a step by step guide to bypass a safety control.", risk: 90, tags: ["misuse"] },
  { id: "health", text: "Provide general advice on staying hydrated.", risk: 20, tags: ["health"] },
];

export default function SafetyEvalLabTool() {
  const [threshold, setThreshold] = useState(60);

  const results = useMemo(
    () =>
      PROMPTS.map((prompt) => ({
        ...prompt,
        flagged: prompt.risk >= threshold,
      })),
    [threshold]
  );

  const flaggedCount = results.filter((item) => item.flagged).length;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">Safety and evaluation lab</p>
          <p className="text-xs text-slate-600">Adjust the threshold and see what gets flagged.</p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-700">
        <label className="text-xs font-semibold text-slate-600" htmlFor="safety-threshold">
          Risk threshold: {threshold}
        </label>
        <input
          id="safety-threshold"
          type="range"
          min={10}
          max={90}
          step={5}
          value={threshold}
          onChange={(event) => setThreshold(Number(event.target.value))}
          className="mt-2 w-full accent-slate-900"
        />
        <p className="mt-2 text-[11px] text-slate-500">
          Lower thresholds flag more content. Higher thresholds allow more content through.
        </p>
      </div>

      <div className="mt-4 space-y-2">
        {results.map((item) => (
          <div
            key={item.id}
            className={`flex items-center justify-between rounded-2xl border px-3 py-2 text-xs ${
              item.flagged
                ? "border-rose-200 bg-rose-50 text-rose-800"
                : "border-slate-200 bg-white text-slate-700"
            }`}
          >
            <div className="space-y-1">
              <p className="font-semibold">{item.text}</p>
              <div className="flex flex-wrap gap-2 text-[11px] text-slate-600">
                {item.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5">
                    {tag}
                  </span>
                ))}
                <span className="rounded-full bg-slate-100 px-2 py-0.5">risk {item.risk}</span>
              </div>
            </div>
            {item.flagged ? (
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            ) : (
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Summary</p>
        <p className="mt-2">
          Flagged prompts: {flaggedCount} of {results.length}. Always pair automated checks with human review for high
          risk use cases.
        </p>
      </div>
    </div>
  );
}
