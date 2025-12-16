"use client";

import { useMemo, useState } from "react";

const RISKS = [
  { id: 1, name: "Identity compromise", baseLikelihood: 4, baseImpact: 5 },
  { id: 2, name: "Regulatory breach", baseLikelihood: 3, baseImpact: 5 },
  { id: 3, name: "Platform outage", baseLikelihood: 3, baseImpact: 4 },
  { id: 4, name: "Data quality failure", baseLikelihood: 4, baseImpact: 3 },
];

export default function RiskHeatmap() {
  const [controls, setControls] = useState({
    mfa: true,
    monitoring: true,
    backup: true,
  });

  const scores = useMemo(() => {
    return RISKS.map((r) => {
      let likelihood = r.baseLikelihood;
      let impact = r.baseImpact;

      if (controls.mfa && r.name === "Identity compromise") likelihood -= 1;
      if (controls.monitoring) likelihood -= 0.5;
      if (controls.backup && r.name === "Platform outage") impact -= 1;

      likelihood = clamp(likelihood);
      impact = clamp(impact);

      return { ...r, likelihood, impact, score: likelihood * impact };
    }).sort((a, b) => b.score - a.score);
  }, [controls]);

  const toggle = (key) => setControls((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="rn-tool">
      <div className="rn-tool-head">
        <div className="rn-tool-title">Risk heatmap and resilience explorer</div>
        <div className="rn-tool-sub">Toggle simple controls and see how likelihood and impact change for common digital risks.</div>
      </div>

      <div className="rn-grid rn-grid-3 rn-mt">
        <Toggle label="Multi-factor authentication" checked={controls.mfa} onChange={() => toggle("mfa")} />
        <Toggle label="Monitoring and alerting" checked={controls.monitoring} onChange={() => toggle("monitoring")} />
        <Toggle label="Backup and recovery" checked={controls.backup} onChange={() => toggle("backup")} />
      </div>

      <div className="rn-card rn-mt">
        <div className="rn-card-title">Risk view</div>
        <div className="rn-card-body space-y-2">
          {scores.map((r) => (
            <div key={r.id} className="rn-mini">
              <div className="rn-mini-title">
                {r.name} - Likelihood {r.likelihood}, Impact {r.impact}, Score {r.score}
              </div>
              <div className="rn-mini-body text-sm text-gray-700">Higher scores need more attention. Controls can reduce but rarely eliminate risk.</div>
            </div>
          ))}
        </div>
        <div className="rn-mini rn-mt">
          <div className="rn-mini-title">Reflection</div>
          <div className="rn-mini-body">Risk changes when controls change. Some risks remain high even with controls. Those may need design changes, not only mitigations.</div>
        </div>
      </div>
    </div>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="rn-card rn-flex rn-justify-between rn-items-center gap-2">
      <span className="text-sm">{label}</span>
      <input type="checkbox" checked={checked} onChange={onChange} />
    </label>
  );
}

function clamp(n) {
  return Math.max(1, Math.min(5, Math.round(n)));
}
