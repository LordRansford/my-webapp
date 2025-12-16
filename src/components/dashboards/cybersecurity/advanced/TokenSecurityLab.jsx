"use client";

import { useMemo, useState } from "react";

const EXPIRY_OPTIONS = [
  { id: "short", label: "Short lived (15m)", risk: -2 },
  { id: "medium", label: "Medium (8h)", risk: 0 },
  { id: "long", label: "Long lived (7d)", risk: 3 },
];

const AUDIENCE_OPTIONS = [
  { id: "single", label: "Single service", risk: -1 },
  { id: "broad", label: "Multiple services", risk: 1 },
  { id: "wildcard", label: "Wildcard", risk: 3 },
];

const SCOPE_OPTIONS = [
  { id: "minimal", label: "Minimal scopes", risk: -2 },
  { id: "standard", label: "Standard scopes", risk: 0 },
  { id: "broad", label: "Broad scopes", risk: 2 },
];

export default function TokenSecurityLab() {
  const [expiry, setExpiry] = useState("short");
  const [aud, setAud] = useState("single");
  const [scope, setScope] = useState("standard");

  const riskScore = useMemo(() => {
    const e = EXPIRY_OPTIONS.find((o) => o.id === expiry)?.risk || 0;
    const a = AUDIENCE_OPTIONS.find((o) => o.id === aud)?.risk || 0;
    const s = SCOPE_OPTIONS.find((o) => o.id === scope)?.risk || 0;
    return Math.max(0, 5 + e + a + s);
  }, [expiry, aud, scope]);

  const summary = useMemo(() => {
    if (riskScore <= 4) return "Short lived, narrow scope token has lower blast radius if leaked.";
    if (riskScore <= 7) return "Balanced token: acceptable if rotated and monitored.";
    return "Long lived or broad tokens increase risk if stolen. Prefer narrowing scope or expiry.";
  }, [riskScore]);

  return (
    <div className="rounded-2xl bg-white p-4 shadow-md ring-1 ring-slate-200">
      <h4 className="text-base font-semibold text-slate-900">Adjust token properties</h4>
      <p className="text-sm text-slate-700">All values are synthetic; no real tokens are generated.</p>

      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <Selector
          title="Expiry"
          value={expiry}
          onChange={setExpiry}
          options={EXPIRY_OPTIONS}
        />
        <Selector
          title="Audience"
          value={aud}
          onChange={setAud}
          options={AUDIENCE_OPTIONS}
        />
        <Selector
          title="Scopes"
          value={scope}
          onChange={setScope}
          options={SCOPE_OPTIONS}
        />
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
        <div className="flex items-center justify-between text-sm text-slate-800">
          <span className="font-semibold text-slate-900">Risk indicator</span>
          <span className="font-semibold">{riskScore}/12</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-white">
          <div className="h-full rounded-full bg-rose-400" style={{ width: `${(riskScore / 12) * 100}%` }} />
        </div>
        <p className="mt-2 text-sm text-slate-800">{summary}</p>
      </div>
    </div>
  );
}

function Selector({ title, value, onChange, options }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <h5 className="text-sm font-semibold text-slate-900">{title}</h5>
      <div className="mt-2 space-y-2">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className={`w-full rounded-lg border px-3 py-2 text-left text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-sky-300 ${
              value === opt.id ? "border-sky-300 bg-sky-50 text-slate-900" : "border-slate-200 bg-white text-slate-800 hover:border-sky-200"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
