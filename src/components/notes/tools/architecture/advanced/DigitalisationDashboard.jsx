"use client";

import { useMemo, useState } from "react";

const METRICS = [
  { key: "deploy", name: "Deployment frequency", hint: "Higher suggests flow is healthy." },
  { key: "lead", name: "Lead time for change", hint: "Lower suggests friction is low." },
  { key: "fail", name: "Change failure rate", hint: "Lower suggests quality and safety." },
  { key: "recover", name: "Time to restore", hint: "Lower suggests resilience." },
  { key: "cost", name: "Operational cost trend", hint: "Flat or down suggests sustainability." },
];

export default function DigitalisationDashboard() {
  const [selection, setSelection] = useState(["deploy", "lead", "fail"]);

  const summary = useMemo(() => {
    const hasBalance = selection.includes("deploy") && selection.includes("fail") && selection.includes("recover");
    if (hasBalance) return "You are watching flow, quality, and resilience together. This is a balanced lens for digitalisation.";
    if (selection.length <= 2) return "Add at least three metrics to avoid single-metric tunnel vision.";
    return "Good start. Ensure you include both speed and safety metrics to avoid hidden risk.";
  }, [selection]);

  const toggle = (key) => {
    setSelection((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  return (
    <div className="rn-tool">
      <div className="rn-tool-head">
        <div className="rn-tool-title">Digitalisation dashboard</div>
        <div className="rn-tool-sub">Pick the metrics you will watch. Notice how missing metrics hide risk.</div>
      </div>

      <div className="rn-grid rn-grid-2 rn-mt">
        <div className="rn-card space-y-2">
          {METRICS.map((m) => (
            <label key={m.key} className="rn-field rn-flex-between">
              <span>{m.name}</span>
              <input type="checkbox" checked={selection.includes(m.key)} onChange={() => toggle(m.key)} />
            </label>
          ))}
        </div>

        <div className="rn-card space-y-3">
          <div className="rn-card-title">Reflection</div>
          <div className="rn-card-body">{summary}</div>
          <div className="rn-mini">
            <div className="rn-mini-title">What to avoid</div>
            <div className="rn-mini-body">
              Watching only speed hides quality risk. Watching only quality hides delivery friction. Digitalisation without metrics is wishful thinking.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
