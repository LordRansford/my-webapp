"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Grid3X3 } from "lucide-react";

const TOKENS = [
  "API gateway",
  "Circuit breaker",
  "Bounded context",
  "Event stream",
  "Cache invalidation",
  "Service mesh",
  "Read model",
  "Feature flag",
  "Deployment pipeline",
];

export default function ArchitectureBingoTool() {
  const [picked, setPicked] = useState({});

  const toggle = (token) => {
    setPicked((prev) => ({ ...prev, [token]: !prev[token] }));
  };

  const score = useMemo(() => Object.values(picked).filter(Boolean).length, [picked]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
          <Grid3X3 className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">Architecture bingo</p>
          <p className="text-xs text-slate-600">Tap the patterns you can explain without notes.</p>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {TOKENS.map((token) => (
          <button
            key={token}
            type="button"
            onClick={() => toggle(token)}
            aria-pressed={!!picked[token]}
            className={`rounded-2xl border px-3 py-2 text-left text-xs font-semibold transition ${
              picked[token]
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-slate-200 bg-slate-50/70 text-slate-700 hover:border-slate-300 hover:bg-white"
            }`}
          >
            {token}
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          {score} of {TOKENS.length} checked
        </div>
        <p className="mt-2 text-xs text-slate-600">
          Aim for at least five. Circle back to the ones you could not explain yet.
        </p>
      </div>
    </div>
  );
}
