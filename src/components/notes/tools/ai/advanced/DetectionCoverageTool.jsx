"use client";

import { useMemo, useState } from "react";

const SIGNALS = [
  { id: "auth", label: "Auth anomalies", catch: ["access"], noise: 2 },
  { id: "priv", label: "Privilege changes", catch: ["escalation"], noise: 1 },
  { id: "db", label: "Sensitive reads", catch: ["data"], noise: 2 },
  { id: "net", label: "Network spikes", catch: ["recon"], noise: 3 },
];

export default function DetectionCoverageTool() {
  const [enabled, setEnabled] = useState({});

  const coverage = useMemo(() => {
    const phases = new Set();
    let noise = 0;
    SIGNALS.forEach((s) => {
      if (enabled[s.id]) {
        s.catch.forEach((c) => phases.add(c));
        noise += s.noise;
      }
    });
    return { phases: Array.from(phases), noise };
  }, [enabled]);

  return (
    <div className="rn-tool">
      <div className="rn-tool-head">
        <div className="rn-tool-title">Detection coverage</div>
        <div className="rn-tool-sub">Pick signals. See which attack phases you can see and the noise you incur.</div>
      </div>

      <div className="rn-grid rn-grid-2">
        {SIGNALS.map((s) => (
          <label key={s.id} className="rn-card rn-game-row">
            <input
              type="checkbox"
              checked={!!enabled[s.id]}
              onChange={() => setEnabled((prev) => ({ ...prev, [s.id]: !prev[s.id] }))}
            />
            <span>
              <div className="font-semibold">{s.label}</div>
              <div className="text-sm text-gray-700">Noise cost {s.noise}</div>
            </span>
          </label>
        ))}
      </div>

      <div className="rn-card rn-mt">
        <div className="rn-card-title">What you can see</div>
        <div className="rn-card-body">
          {coverage.phases.length === 0 ? "No detection. Attacks are invisible." : coverage.phases.join(", ")}
          <div className="mt-2 text-sm text-gray-700">Estimated alert noise: {coverage.noise}</div>
        </div>
      </div>
    </div>
  );
}
