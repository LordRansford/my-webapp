"use client";

import { useMemo, useState } from "react";

export default function PolicyImpactSimulator() {
  const [governance, setGovernance] = useState(3);
  const [funding, setFunding] = useState(3);
  const [riskAppetite, setRiskAppetite] = useState(3);

  const outcome = useMemo(() => {
    const delivery = funding + riskAppetite - governance * 0.5;
    const risk = 6 - riskAppetite + Math.max(0, 4 - governance);
    const clarity = governance + 1 - Math.abs(funding - riskAppetite) * 0.3;

    return {
      delivery: Math.max(1, Math.min(5, Math.round(delivery))),
      risk: Math.max(1, Math.min(5, Math.round(risk))),
      clarity: Math.max(1, Math.min(5, Math.round(clarity))),
    };
  }, [governance, funding, riskAppetite]);

  return (
    <div className="rn-tool">
      <div className="rn-tool-head">
        <div className="rn-tool-title">Policy and risk impact</div>
        <div className="rn-tool-sub">Adjust governance, funding style, and risk appetite. See how delivery, risk, and clarity respond.</div>
      </div>

      <div className="rn-grid rn-grid-3 rn-mt">
        <Slider label="Governance strictness" value={governance} onChange={setGovernance} hint="Higher = stricter controls" />
        <Slider label="Funding agility" value={funding} onChange={setFunding} hint="Higher = more iterative" />
        <Slider label="Risk appetite" value={riskAppetite} onChange={setRiskAppetite} hint="Higher = willing to experiment" />
      </div>

      <div className="rn-card rn-mt">
        <div className="rn-card-title">What this implies</div>
        <div className="rn-grid rn-grid-3 rn-mt">
          <Metric title="Delivery capacity" value={outcome.delivery} />
          <Metric title="Risk exposure" value={outcome.risk} />
          <Metric title="Decision clarity" value={outcome.clarity} />
        </div>
        <div className="rn-mini rn-mt">
          <div className="rn-mini-title">Reflection</div>
          <div className="rn-mini-body">
            Governance that is too light increases risk. Governance that is too heavy reduces delivery. The sweet spot keeps clarity high while keeping risk acceptable.
          </div>
        </div>
      </div>
    </div>
  );
}

function Slider({ label, value, onChange, hint }) {
  return (
    <div className="rn-card space-y-2">
      <div className="rn-card-title text-sm">{label}</div>
      <input className="rn-range" type="range" min={1} max={5} value={value} onChange={(e) => onChange(Number(e.target.value))} />
      <div className="rn-mini-body text-sm text-gray-700">
        Value {value}. {hint}
      </div>
    </div>
  );
}

function Metric({ title, value }) {
  return (
    <div className="rn-mini">
      <div className="rn-mini-title">
        {title}: {value}
      </div>
      <div className="rn-mini-body text-sm text-gray-700">Higher is better for delivery and clarity. Lower is better for risk exposure.</div>
    </div>
  );
}
