"use client";

import { useState } from "react";

const STEPS = [
  { id: "detect", label: "Detect", help: "Do you see it quickly?" },
  { id: "contain", label: "Contain", help: "Can you stop spread?" },
  { id: "eradicate", label: "Eradicate", help: "Remove root cause." },
  { id: "recover", label: "Recover", help: "Restore safely." },
];

export default function IncidentTimelineTool() {
  const [done, setDone] = useState({});

  return (
    <div className="rn-tool">
      <div className="rn-tool-head">
        <div className="rn-tool-title">Incident thinking</div>
        <div className="rn-tool-sub">Mark which steps you have rehearsed. See where risk concentrates.</div>
      </div>

      <div className="rn-grid rn-grid-2">
        {STEPS.map((s) => (
          <label key={s.id} className="rn-card rn-game-row">
            <input
              type="checkbox"
              checked={!!done[s.id]}
              onChange={() => setDone((prev) => ({ ...prev, [s.id]: !prev[s.id] }))}
            />
            <span>
              <div className="font-semibold">{s.label}</div>
              <div className="text-sm text-gray-700">{s.help}</div>
            </span>
          </label>
        ))}
      </div>

      <div className="rn-card rn-mt">
        <div className="rn-card-title">Where to drill next</div>
        <div className="rn-card-body">
          {STEPS.filter((s) => !done[s.id]).length === 0
            ? "All stages rehearsed. Keep logs, runbooks, and on-call rotations fresh."
            : `Missing: ${STEPS.filter((s) => !done[s.id])
                .map((s) => s.label)
                .join(", ")}. Drill these before the next incident drills you.`}
        </div>
      </div>
    </div>
  );
}
