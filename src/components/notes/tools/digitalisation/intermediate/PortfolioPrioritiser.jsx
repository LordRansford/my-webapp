"use client";

import { useMemo, useState } from "react";

const START_ITEMS = [
  { id: 1, name: "Modernise identity", value: 5, risk: 4, readiness: 4 },
  { id: 2, name: "Data quality uplift", value: 4, risk: 3, readiness: 3 },
  { id: 3, name: "New digital service", value: 4, risk: 5, readiness: 2 },
];

export default function PortfolioPrioritiser() {
  const [items, setItems] = useState(START_ITEMS);
  const [name, setName] = useState("");
  const [value, setValue] = useState(3);
  const [risk, setRisk] = useState(3);
  const [readiness, setReadiness] = useState(3);

  const add = () => {
    if (!name.trim()) return;
    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: name.trim(),
        value: Number(value),
        risk: Number(risk),
        readiness: Number(readiness),
      },
    ]);
    setName("");
    setValue(3);
    setRisk(3);
    setReadiness(3);
  };

  const ranking = useMemo(() => {
    return items
      .map((i) => ({
        ...i,
        score: i.value + i.readiness - i.risk,
      }))
      .sort((a, b) => b.score - a.score);
  }, [items]);

  return (
    <div className="rn-tool">
      <div className="rn-tool-head">
        <div className="rn-tool-title">Digital portfolio prioritiser</div>
        <div className="rn-tool-sub">Balance value, risk, and readiness. Notice how dependencies matter more than raw scores.</div>
      </div>

      <div className="rn-grid rn-grid-2 rn-mt">
        <div className="rn-card space-y-2">
          <input className="rn-input" placeholder="Initiative name" value={name} onChange={(e) => setName(e.target.value)} />
          <label className="rn-label">
            Value {value}
            <input className="rn-range" type="range" min={1} max={5} value={value} onChange={(e) => setValue(e.target.value)} />
          </label>
          <label className="rn-label">
            Risk {risk}
            <input className="rn-range" type="range" min={1} max={5} value={risk} onChange={(e) => setRisk(e.target.value)} />
          </label>
          <label className="rn-label">
            Readiness {readiness}
            <input className="rn-range" type="range" min={1} max={5} value={readiness} onChange={(e) => setReadiness(e.target.value)} />
          </label>
          <button className="rn-btn rn-btn-primary" onClick={add}>
            Add initiative
          </button>
        </div>

        <div className="rn-card">
          <div className="rn-card-title">Suggested order</div>
          <div className="rn-card-body space-y-2">
            {ranking.map((r, idx) => (
              <div key={r.id} className="rn-mini">
                <div className="rn-mini-title">
                  {idx + 1}. {r.name}
                </div>
                <div className="rn-mini-body">
                  Value {r.value} • Risk {r.risk} • Readiness {r.readiness} • Score {r.score}
                </div>
              </div>
            ))}
          </div>
          <div className="rn-mini rn-mt">
            <div className="rn-mini-title">Reflection</div>
            <div className="rn-mini-body">
              Do the top items depend on capabilities you already have. If not, they may need to move later in the roadmap.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
