"use client";

import { useMemo, useState } from "react";

const BASE_CAPABILITIES = [
  { id: 1, name: "Customer/citizen services", importance: 5 },
  { id: 2, name: "Data and analytics", importance: 5 },
  { id: 3, name: "Identity and access", importance: 5 },
  { id: 4, name: "Digital delivery", importance: 4 },
  { id: 5, name: "Risk and compliance", importance: 4 },
];

export default function CapabilityMapper() {
  const [scores, setScores] = useState(
    BASE_CAPABILITIES.map((c) => ({ ...c, current: 2, target: c.importance }))
  );

  const update = (id, field, value) => {
    setScores((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: Number(value) } : c))
    );
  };

  const gaps = useMemo(
    () =>
      scores
        .map((c) => ({ ...c, gap: c.target - c.current }))
        .sort((a, b) => b.gap - a.gap),
    [scores]
  );

  return (
    <div className="rn-tool">
      <div className="rn-tool-head">
        <div className="rn-tool-title">Capability mapper</div>
        <div className="rn-tool-sub">
          Score current and target strength for key capabilities. Notice where the gaps are largest.
        </div>
      </div>

      <div className="rn-grid rn-grid-2 rn-mt">
        <div className="rn-card space-y-3">
          {scores.map((c) => (
            <div key={c.id} className="rn-mini space-y-1">
              <div className="rn-mini-title">{c.name}</div>
              <div className="rn-mini-body">
                <label className="rn-label">
                  Current: <strong>{c.current}</strong>
                </label>
                <input
                  className="rn-range"
                  type="range"
                  min={1}
                  max={5}
                  value={c.current}
                  onChange={(e) => update(c.id, "current", e.target.value)}
                />
              </div>
              <div className="rn-mini-body">
                <label className="rn-label">
                  Target: <strong>{c.target}</strong>
                </label>
                <input
                  className="rn-range"
                  type="range"
                  min={1}
                  max={5}
                  value={c.target}
                  onChange={(e) => update(c.id, "target", e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="rn-card">
          <div className="rn-card-title">Where to invest first</div>
          <div className="rn-card-body space-y-2">
            {gaps.map((g) => (
              <div key={g.id} className="rn-mini">
                <div className="rn-mini-title">
                  {g.name} - Gap {g.gap >= 0 ? g.gap : 0}
                </div>
                <div className="rn-mini-body">
                  Current {g.current} / Target {g.target}. Larger gaps usually deserve earlier attention if they align to outcomes.
                </div>
              </div>
            ))}
          </div>
          <div className="rn-mini rn-mt">
            <div className="rn-mini-title">Reflection</div>
            <div className="rn-mini-body">
              Do the biggest gaps line up with the outcomes you care about. If not, reconsider either the target or the outcome.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
