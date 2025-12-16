"use client";

import { useState } from "react";

const CONTROLS = [
  { id: "authn", label: "Strong authentication", effect: "Reduces stolen credential risk" },
  { id: "least", label: "Least privilege", effect: "Limits blast radius" },
  { id: "segment", label: "Network segmentation", effect: "Constrains lateral movement" },
  { id: "logs", label: "Monitoring", effect: "Improves detection and response" },
];

export default function ZeroTrustPlannerTool() {
  const [enabled, setEnabled] = useState({});

  const missing = CONTROLS.filter((c) => !enabled[c.id]);

  return (
    <div className="rn-tool">
      <div className="rn-tool-head">
        <div className="rn-tool-title">Zero trust planning</div>
        <div className="rn-tool-sub">Select the controls you would apply to an internal service.</div>
      </div>

      <div className="rn-grid rn-grid-2">
        {CONTROLS.map((c) => (
          <label key={c.id} className="rn-card rn-game-row">
            <input
              type="checkbox"
              checked={!!enabled[c.id]}
              onChange={() => setEnabled((prev) => ({ ...prev, [c.id]: !prev[c.id] }))}
            />
            <span>
              <div className="font-semibold">{c.label}</div>
              <div className="text-sm text-gray-700">{c.effect}</div>
            </span>
          </label>
        ))}
      </div>

      <div className="rn-card rn-mt">
        <div className="rn-card-title">What is left exposed</div>
        <div className="rn-card-body">
          {missing.length === 0 ? (
            "Controls are in place, but remember: zero trust is a stance, not a checkbox. Continual verification is required."
          ) : (
            <ul className="list-disc pl-4 space-y-1">
              {missing.map((m) => (
                <li key={m.id} className="rn-body">
                  Missing {m.label.toLowerCase()}: {m.effect.toLowerCase()}.
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
