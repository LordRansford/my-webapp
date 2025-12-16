"use client";

import { useState } from "react";

const SCENARIOS = [
  {
    id: "replay",
    label: "Replay allowed",
    fix: "Add nonces or timestamps and reject reuse.",
  },
  {
    id: "downgrade",
    label: "Downgrade accepted",
    fix: "Pin minimum versions and fail closed.",
  },
  {
    id: "leaky_errors",
    label: "Detailed errors leak state",
    fix: "Return generic errors and log details internally.",
  },
];

export default function ProtocolAssumptionsTool() {
  const [picked, setPicked] = useState([]);

  const toggle = (id) => {
    setPicked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return (
    <div className="rn-tool">
      <div className="rn-tool-head">
        <div className="rn-tool-title">Protocol weak spots</div>
        <div className="rn-tool-sub">Select the assumptions you want to break. See what a safer variant would require.</div>
      </div>

      <div className="rn-grid rn-grid-1">
        {SCENARIOS.map((s) => (
          <label key={s.id} className="rn-game-row">
            <input type="checkbox" checked={picked.includes(s.id)} onChange={() => toggle(s.id)} />
            {s.label}
          </label>
        ))}
      </div>

      <div className="rn-card rn-mt">
        <div className="rn-card-title">What to tighten</div>
        <div className="rn-card-body">
          {picked.length === 0 ? (
            <p className="rn-body">Pick a weakness to see how to harden the protocol.</p>
          ) : (
            <ul className="list-disc pl-4 space-y-1">
              {SCENARIOS.filter((s) => picked.includes(s.id)).map((s) => (
                <li key={s.id} className="rn-body">
                  {s.fix}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
