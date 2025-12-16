"use client";

import { useState } from "react";

const STYLES = [
  { id: "monolith", label: "Layered monolith", note: "Simple to understand, can be hard to scale teams independently." },
  { id: "services", label: "Services", note: "Independent deployment, but boundaries must be clear or coupling returns." },
  { id: "event", label: "Event driven", note: "Looser coupling, harder to trace flows, requires strong observability." },
];

export default function SystemDashboard() {
  const [style, setStyle] = useState("monolith");

  const current = STYLES.find((s) => s.id === style);

  return (
    <div className="rn-tool">
      <div className="rn-tool-head">
        <div className="rn-tool-title">Architecture view</div>
        <div className="rn-tool-sub">Pick a style to see the primary risk to watch.</div>
      </div>

      <div className="rn-grid rn-grid-3">
        {STYLES.map((s) => (
          <button
            key={s.id}
            className={`rn-choice ${style === s.id ? "rn-choice-active" : ""}`}
            onClick={() => setStyle(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="rn-card rn-mt">
        <div className="rn-card-title">Key consideration</div>
        <div className="rn-card-body">{current?.note}</div>
      </div>
    </div>
  );
}
