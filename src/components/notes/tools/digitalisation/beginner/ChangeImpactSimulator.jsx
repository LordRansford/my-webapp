"use client";

import { useMemo, useState } from "react";

const SCENARIOS = {
  "digitisation-vs-digitalisation": [
    { id: "scan", title: "Scan forms", type: "Digitisation", impact: "Low", note: "You still have the old process plus scanning overhead." },
    { id: "online-flow", title: "Online workflow", type: "Digitalisation", impact: "Medium", note: "Process is redesigned and tracked automatically." },
    { id: "new-service", title: "New digital service", type: "Digital transformation", impact: "High", note: "Service and operating model change together." },
  ],
  culture: [
    { id: "train", title: "Train teams", change: "People", effect: "Trust and capability improve." },
    { id: "simplify", title: "Simplify process", change: "Process", effect: "Less friction, easier adoption." },
    { id: "tool-only", title: "Add tool only", change: "Technology", effect: "Low adoption, frustration rises." },
  ],
};

export default function ChangeImpactSimulator({ mode = "digitisation-vs-digitalisation" }) {
  const options = SCENARIOS[mode] || [];
  const [picked, setPicked] = useState(null);

  const summary = useMemo(() => {
    if (!picked) return "Pick an option to see the impact.";
    if (mode === "digitisation-vs-digitalisation") return `${picked.type}: ${picked.note}`;
    return `${picked.change}: ${picked.effect}`;
  }, [picked, mode]);

  return (
    <div className="rn-tool">
      <div className="rn-tool-head">
        <div className="rn-tool-title">Change impact simulator</div>
        <div className="rn-tool-sub">Select an approach and see how impact and adoption differ.</div>
      </div>

      <div className="rn-grid rn-grid-3 rn-mt">
        {options.map((o) => (
          <button
            key={o.id}
            className={`rn-choice ${picked?.id === o.id ? "rn-choice-active" : ""}`}
            onClick={() => setPicked(o)}
          >
            <div className="rn-choice-title">{o.title}</div>
            <div className="rn-choice-body text-sm text-gray-700">{o.effect || o.note}</div>
          </button>
        ))}
      </div>

      <div className="rn-card rn-mt">
        <div className="rn-card-title">What this shows</div>
        <div className="rn-card-body">{summary}</div>
        <div className="rn-mini rn-mt">
          <div className="rn-mini-title">Hint</div>
          <div className="rn-mini-body">Culture and process change are usually the hardest parts; tools alone rarely deliver value.</div>
        </div>
      </div>
    </div>
  );
}
