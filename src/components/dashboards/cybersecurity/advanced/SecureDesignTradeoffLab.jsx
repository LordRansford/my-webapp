"use client";

import { useMemo, useState } from "react";

const PATTERNS = [
  {
    id: "flat-db",
    name: "Flat network with shared database",
    desc: "Single network zone, all services share one database.",
    attributes: { surface: 4, blast: 5, ops: 2 },
  },
  {
    id: "segmented",
    name: "Segmented network, service per function",
    desc: "Services are split by function with network segments and per-service stores.",
    attributes: { surface: 2, blast: 2, ops: 3 },
  },
  {
    id: "queue-reporting",
    name: "Service + message queue + reporting store",
    desc: "Write path via queue; reporting uses a separate read store.",
    attributes: { surface: 3, blast: 2, ops: 4 },
  },
];

export default function SecureDesignTradeoffLab() {
  const [current, setCurrent] = useState("flat-db");
  const [proposed, setProposed] = useState("segmented");

  const summary = useMemo(() => {
    const cur = PATTERNS.find((p) => p.id === current);
    const prop = PATTERNS.find((p) => p.id === proposed);
    if (!cur || !prop) return null;
    const deltas = {
      surface: prop.attributes.surface - cur.attributes.surface,
      blast: prop.attributes.blast - cur.attributes.blast,
      ops: prop.attributes.ops - cur.attributes.ops,
    };
    return { cur, prop, deltas };
  }, [current, proposed]);

  return (
    <div className="rounded-2xl bg-white p-4 shadow-md ring-1 ring-slate-200">
      <h4 className="text-base font-semibold text-slate-900">Compare design options</h4>
      <p className="text-sm text-slate-700">Pick a current design and a proposed design. See how risk and complexity shift.</p>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <PatternSelect title="Current" value={current} onChange={setCurrent} />
        <PatternSelect title="Proposed" value={proposed} onChange={setProposed} />
      </div>

      {summary && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
          <h5 className="text-sm font-semibold text-slate-900">Comparison</h5>
          <div className="mt-2 grid gap-2 text-sm text-slate-800 md:grid-cols-3">
            <Delta label="Attack surface" value={summary.deltas.surface} />
            <Delta label="Blast radius" value={summary.deltas.blast} />
            <Delta label="Operational complexity" value={summary.deltas.ops} />
          </div>
          <p className="mt-3 text-sm text-slate-800">
            Moving from <strong>{summary.cur.name}</strong> to <strong>{summary.prop.name}</strong>{" "}
            {summary.deltas.surface < 0 ? "reduces exposed surface" : "increases exposed surface slightly"},{" "}
            {summary.deltas.blast < 0 ? "shrinks blast radius" : "expands blast radius"} and{" "}
            {summary.deltas.ops > 0 ? "adds operational overhead" : "keeps operations lean"}.
          </p>
        </div>
      )}
    </div>
  );
}

function PatternSelect({ title, value, onChange }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <h5 className="text-sm font-semibold text-slate-900">{title}</h5>
      <div className="mt-2 space-y-2">
        {PATTERNS.map((p) => (
          <button
            key={p.id}
            onClick={() => onChange(p.id)}
            className={`w-full rounded-lg border px-3 py-2 text-left text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-sky-300 ${
              value === p.id ? "border-sky-300 bg-sky-50 text-slate-900" : "border-slate-200 bg-white text-slate-800 hover:border-sky-200"
            }`}
          >
            <div className="font-semibold">{p.name}</div>
            <div className="text-xs text-slate-700">{p.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Delta({ label, value }) {
  const text =
    value === 0 ? "No change" : value < 0 ? `Improves by ${Math.abs(value)}` : `Worsens by ${value}`;
  const tone = value <= 0 ? "text-emerald-800" : "text-amber-800";
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <div className="text-xs font-semibold text-slate-700">{label}</div>
      <div className={`text-sm font-semibold ${tone}`}>{text}</div>
    </div>
  );
}
