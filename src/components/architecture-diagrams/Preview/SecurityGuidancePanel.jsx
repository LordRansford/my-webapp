"use client";

import { useMemo, useState } from "react";
import { STRIDE_ITEMS } from "@/lib/architecture-diagrams/security/stride";
import SwitchRow from "@/components/ui/SwitchRow";

export default function SecurityGuidancePanel({ inputVersion, goal }) {
  const storageKey = useMemo(() => `arch-stride-considered:${inputVersion}`, [inputVersion]);
  const [open, setOpen] = useState(false);
  const [considered, setConsidered] = useState(() => {
    try {
      if (typeof window === "undefined") return {};
      const raw = window.localStorage.getItem(storageKey);
      const parsed = raw ? JSON.parse(raw) : {};
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  });

  const setChecked = (id, checked) => {
    const next = { ...considered, [id]: Boolean(checked) };
    setConsidered(next);
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const show = goal === "security-review" || goal === "data-review";

  if (!show) return null;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Security thinking aid</p>
          <p className="mt-1 text-sm text-slate-700">STRIDE checklist is guidance only. It does not score or block generation.</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
          aria-expanded={open}
        >
          {open ? "Hide" : "Show"}
        </button>
      </div>

      {open ? (
        <div className="mt-4 space-y-3">
          {STRIDE_ITEMS.map((item) => (
            <SwitchRow
              key={item.id}
              label={item.label}
              description={item.explanation}
              checked={Boolean(considered[item.id])}
              onCheckedChange={(checked) => setChecked(item.id, checked)}
              tone="slate"
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}


