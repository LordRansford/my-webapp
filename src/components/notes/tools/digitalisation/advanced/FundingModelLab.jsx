"use client";

import { useMemo, useState } from "react";

export default function FundingModelLab() {
  const [central, setCentral] = useState(3);
  const [projectBased, setProjectBased] = useState(3);
  const [chargeback, setChargeback] = useState(2);

  const view = useMemo(() => {
    const platformHealth = central - projectBased * 0.4 + (5 - chargeback) * 0.2;
    const teamAutonomy = 5 - central * 0.6 + (5 - chargeback) * 0.3;
    const adoption = 5 - chargeback * 0.5 + central * 0.3;

    return {
      platformHealth: clamp(platformHealth),
      teamAutonomy: clamp(teamAutonomy),
      adoption: clamp(adoption),
    };
  }, [central, projectBased, chargeback]);

  return (
    <div className="rn-tool">
      <div className="rn-tool-head">
        <div className="rn-tool-title">Funding model lab</div>
        <div className="rn-tool-sub">Adjust central funding, project funding, and chargeback. See how platforms and teams respond.</div>
      </div>

      <div className="rn-grid rn-grid-3 rn-mt">
        <Slider label="Central platform funding" value={central} onChange={setCentral} />
        <Slider label="Project-based funding" value={projectBased} onChange={setProjectBased} />
        <Slider label="Chargeback to teams" value={chargeback} onChange={setChargeback} />
      </div>

      <div className="rn-card rn-mt">
        <div className="rn-card-title">Implications</div>
        <div className="rn-grid rn-grid-3 rn-mt">
          <Metric title="Platform health" value={view.platformHealth} />
          <Metric title="Team autonomy" value={view.teamAutonomy} />
          <Metric title="Platform adoption" value={view.adoption} />
        </div>
        <div className="rn-mini rn-mt">
          <div className="rn-mini-title">Reflection</div>
          <div className="rn-mini-body">
            Extreme chargeback can create shadow systems. No chargeback can create unplanned load. Balanced models keep shared platforms funded and trusted.
          </div>
        </div>
      </div>
    </div>
  );
}

function Slider({ label, value, onChange }) {
  return (
    <div className="rn-card space-y-2">
      <div className="rn-card-title text-sm">{label}</div>
      <input className="rn-range" type="range" min={1} max={5} value={value} onChange={(e) => onChange(Number(e.target.value))} />
      <div className="rn-mini-body text-sm text-gray-700">Value {value}</div>
    </div>
  );
}

function Metric({ title, value }) {
  return (
    <div className="rn-mini">
      <div className="rn-mini-title">
        {title}: {value}
      </div>
      <div className="rn-mini-body text-sm text-gray-700">Higher is better in this simple model.</div>
    </div>
  );
}

function clamp(n) {
  return Math.max(1, Math.min(5, Math.round(n)));
}
