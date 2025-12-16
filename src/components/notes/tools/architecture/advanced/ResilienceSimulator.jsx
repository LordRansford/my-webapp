"use client";

import { useMemo, useState } from "react";

const SCENARIOS = [
  { id: "node", title: "Component failure", desc: "A critical service instance crashes during peak." },
  { id: "network", title: "Network partition", desc: "A region link degrades and packets drop intermittently." },
  { id: "dependency", title: "Third party outage", desc: "An external identity provider slows down dramatically." },
];

export default function ResilienceSimulator() {
  const [scenario, setScenario] = useState(SCENARIOS[0]);
  const [redundancy, setRedundancy] = useState(true);
  const [isolation, setIsolation] = useState(true);
  const [observability, setObservability] = useState(true);

  const outcome = useMemo(() => {
    let impact = 70;
    if (redundancy) impact -= 20;
    if (isolation) impact -= 20;
    if (observability) impact -= 10;
    const summary =
      impact <= 20
        ? "The system rides through the failure. Users barely notice. Recovery is controlled."
        : impact <= 45
        ? "There is user impact, but blast radius is contained. Recovery is possible with clear runbooks."
        : "Impact is high. The system was too coupled or under-instrumented to recover quickly.";
    return { impact, summary };
  }, [redundancy, isolation, observability]);

  return (
    <div className="rn-tool">
      <div className="rn-tool-head">
        <div className="rn-tool-title">Resilience and failure simulator</div>
        <div className="rn-tool-sub">Toggle resilience controls and see how impact changes for different failure modes.</div>
      </div>

      <div className="rn-grid rn-grid-2 rn-mt">
        <div className="rn-card space-y-2">
          <div className="rn-card-title">Scenario</div>
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              className={`rn-choice ${scenario.id === s.id ? "rn-choice-active" : ""}`}
              onClick={() => setScenario(s)}
            >
              <div className="rn-choice-title">{s.title}</div>
              <div className="rn-choice-body text-sm text-gray-700">{s.desc}</div>
            </button>
          ))}
        </div>

        <div className="rn-card space-y-3">
          <div className="rn-card-title">Controls</div>
          <label className="rn-field rn-flex-between">
            <span>Redundancy</span>
            <input type="checkbox" checked={redundancy} onChange={(e) => setRedundancy(e.target.checked)} />
          </label>
          <label className="rn-field rn-flex-between">
            <span>Isolation/segmentation</span>
            <input type="checkbox" checked={isolation} onChange={(e) => setIsolation(e.target.checked)} />
          </label>
          <label className="rn-field rn-flex-between">
            <span>Observability</span>
            <input type="checkbox" checked={observability} onChange={(e) => setObservability(e.target.checked)} />
          </label>

          <div className="rn-mini rn-mt">
            <div className="rn-mini-title">Impact score</div>
            <div className="rn-mini-body">{outcome.impact}/100 (lower is better)</div>
          </div>
          <div className="rn-mini rn-mt">
            <div className="rn-mini-title">Debrief</div>
            <div className="rn-mini-body">{outcome.summary}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
