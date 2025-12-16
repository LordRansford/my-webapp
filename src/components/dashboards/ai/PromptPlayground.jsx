"use client";

import { useMemo, useState } from "react";

const rules = [
  { tag: "Clear intent", check: (p) => p.length > 30 && p.includes("please") },
  { tag: "Ambiguous", check: (p) => p.length < 20 },
  { tag: "Has constraints", check: (p) => /(limit|max|min|within)/i.test(p) },
];

export default function PromptPlayground() {
  const [prompt, setPrompt] = useState("Summarise this article for a busy exec in 3 bullets, please.");
  const [intent, setIntent] = useState("Summarisation");

  const tags = useMemo(
    () =>
      rules
        .filter((r) => r.check(prompt))
        .map((r) => r.tag),
    [prompt]
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <label className="block text-sm text-slate-700">
        <span className="font-semibold text-slate-900">Prompt</span>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
      </label>
      <label className="mt-3 block text-sm text-slate-700">
        <span className="font-semibold text-slate-900">Intent tag</span>
        <input
          value={intent}
          onChange={(e) => setIntent(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
      </label>

      <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-700">
        <p className="font-semibold text-slate-900">Local classification</p>
        <p>Intent: {intent || "Unspecified"}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.length ? (
            tags.map((t) => (
              <span key={t} className="rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-semibold text-emerald-800">
                {t}
              </span>
            ))
          ) : (
            <span className="text-slate-500">No rule matches yet-clarify the ask.</span>
          )}
        </div>
      </div>
    </div>
  );
}

