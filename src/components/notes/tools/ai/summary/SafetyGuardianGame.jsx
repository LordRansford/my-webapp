"use client";

import { useMemo, useState } from "react";
import { ShieldCheck, AlertTriangle } from "lucide-react";

const PROMPTS = [
  { id: "policy", text: "Summarise the company data policy for staff.", risky: false },
  { id: "privacy", text: "Share a list of customers with full addresses.", risky: true },
  { id: "misuse", text: "Explain how to bypass a safety control.", risky: true },
  { id: "help", text: "Draft a friendly note about energy saving tips.", risky: false },
];

export default function SafetyGuardianGame() {
  const [flags, setFlags] = useState({});

  const score = useMemo(() => {
    return PROMPTS.reduce((count, prompt) => {
      const flagged = !!flags[prompt.id];
      return flagged === prompt.risky ? count + 1 : count;
    }, 0);
  }, [flags]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">Safety guardian</p>
          <p className="text-xs text-slate-600">Flag prompts that should trigger a safety check.</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {PROMPTS.map((prompt) => (
          <label
            key={prompt.id}
            className={`flex items-center justify-between gap-3 rounded-2xl border px-3 py-2 text-xs ${
              flags[prompt.id]
                ? "border-rose-200 bg-rose-50 text-rose-800"
                : "border-slate-200 bg-slate-50/70 text-slate-700"
            }`}
          >
            <span>{prompt.text}</span>
            <input
              type="checkbox"
              checked={!!flags[prompt.id]}
              onChange={(event) =>
                setFlags((prev) => ({ ...prev, [prompt.id]: event.target.checked }))
              }
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
              aria-label={`Flag prompt: ${prompt.text}`}
            />
          </label>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700">
        <p className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
          Score: {score} of {PROMPTS.length}
        </p>
        <p className="mt-2 text-xs text-slate-600">Flag privacy, misuse, or high risk prompts every time.</p>
      </div>
    </div>
  );
}
