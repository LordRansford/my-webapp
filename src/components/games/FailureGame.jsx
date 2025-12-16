"use client";

import { useMemo, useState } from "react";

const SCENARIOS = [
  { id: "partial", name: "Partial outage", desc: "One service is degraded but others are fine." },
  { id: "total", name: "Total outage", desc: "Core dependency is unavailable." },
  { id: "data", name: "Data corruption", desc: "A write path corrupts shared data." },
];

export default function FailureGame() {
  const [scenario, setScenario] = useState(SCENARIOS[0]);
  const [degrade, setDegrade] = useState(true);
  const [fallback, setFallback] = useState(false);
  const [isolate, setIsolate] = useState(true);

  const summary = useMemo(() => {
    let resilience = 40;
    if (degrade) resilience += 20;
    if (fallback) resilience += 20;
    if (isolate) resilience += 15;
    const msg =
      resilience >= 80
        ? "Resilience is strong. Users still get value while you recover."
        : resilience >= 60
        ? "Impact is reduced but still visible. You recover with effort."
        : "Impact is high. Failure modes likely cascade.";
    return { resilience, msg };
  }, [degrade, fallback, isolate]);

  return (
    <div className="rn-tool">
      <div className="rn-tool-head">
        <div className="rn-tool-title">When things fail</div>
        <div className="rn-tool-sub">Pick a failure scenario and mitigation controls. Watch how resilience changes.</div>
      </div>

      <div className="rn-grid rn-grid-2 rn-mt">
        <div className="rn-card space-y-2">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              className={`rn-choice ${scenario.id === s.id ? "rn-choice-active" : ""}`}
              onClick={() => setScenario(s)}
            >
              <div className="rn-choice-title">{s.name}</div>
              <div className="rn-choice-body text-sm text-gray-700">{s.desc}</div>
            </button>
          ))}
        </div>

        <div className="rn-card space-y-3">
          <div className="rn-card-title">Controls</div>
          <label className="rn-field rn-flex-between">
            <span>Graceful degradation</span>
            <input type="checkbox" checked={degrade} onChange={(e) => setDegrade(e.target.checked)} />
          </label>
          <label className="rn-field rn-flex-between">
            <span>Fallback paths</span>
            <input type="checkbox" checked={fallback} onChange={(e) => setFallback(e.target.checked)} />
          </label>
          <label className="rn-field rn-flex-between">
            <span>Isolation/segmentation</span>
            <input type="checkbox" checked={isolate} onChange={(e) => setIsolate(e.target.checked)} />
          </label>

          <div className="rn-mini rn-mt">
            <div className="rn-mini-title">Resilience score</div>
            <div className="rn-mini-body">{summary.resilience}/100</div>
          </div>
          <div className="rn-mini">
            <div className="rn-mini-title">Debrief</div>
            <div className="rn-mini-body">{summary.msg}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
