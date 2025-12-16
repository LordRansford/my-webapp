"use client";

import { useMemo, useState } from "react";

const FEATURES = [
  { key: "id", label: "Customer ID", leakage: 0, note: "Identifier only. Safe if random." },
  { key: "age", label: "Age", leakage: 1, note: "Usually safe, but can correlate with sensitive traits." },
  { key: "postcode", label: "Postcode", leakage: 3, note: "Proxy for income, race, or health access." },
  { key: "device", label: "Device type", leakage: 2, note: "Can proxy for location, wealth, or habits." },
  { key: "outcome", label: "Target leakage", leakage: 4, note: "Anything recorded after the label event." },
];

export default function FeatureLeakageTool() {
  const [selected, setSelected] = useState(["age", "postcode", "device"]);

  const score = useMemo(() => {
    const total = selected
      .map((k) => FEATURES.find((f) => f.key === k)?.leakage || 0)
      .reduce((a, b) => a + b, 0);
    if (total >= 7) return { label: "High leakage risk", desc: "Model may peek at the answer. Redesign features." };
    if (total >= 4) return { label: "Moderate leakage risk", desc: "Review proxies and remove label-adjacent data." };
    return { label: "Low leakage risk", desc: "Features look independent of the label timing." };
  }, [selected]);

  const toggle = (key) => {
    setSelected((cur) => (cur.includes(key) ? cur.filter((k) => k !== key) : [...cur, key]));
  };

  return (
    <div className="space-y-3 text-sm text-gray-800">
      <p className="text-sm text-gray-700">Pick features and see how much leakage risk you introduce.</p>
      <div className="grid gap-2 md:grid-cols-2">
        {FEATURES.map((f) => (
          <button
            key={f.key}
            onClick={() => toggle(f.key)}
            className={`rounded-xl border p-3 text-left transition hover:bg-black/5 focus:outline-none focus:ring focus:ring-blue-200 ${
              selected.includes(f.key) ? "bg-black text-white" : "bg-white/80 text-gray-900"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold">{f.label}</span>
              <span className="text-xs">{selected.includes(f.key) ? "On" : "Off"}</span>
            </div>
            <div className="mt-1 text-xs opacity-80">{f.note}</div>
          </button>
        ))}
      </div>

      <div className="rounded-2xl border bg-white/70 p-3">
        <div className="text-xs uppercase tracking-wide text-gray-600">Assessment</div>
        <div className="mt-1 text-lg font-semibold text-gray-900">{score.label}</div>
        <p className="mt-1 text-sm text-gray-700">{score.desc}</p>
        <p className="mt-1 text-xs text-gray-600">Leakage appears when a feature directly or indirectly encodes the answer.</p>
      </div>
    </div>
  );
}
