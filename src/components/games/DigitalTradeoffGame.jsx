"use client";

import { useMemo, useState } from "react";

export default function DigitalTradeoffGame() {
  const [ambition, setAmbition] = useState(3);
  const [risk, setRisk] = useState(3);
  const [cost, setCost] = useState(3);
  const [capacity, setCapacity] = useState(3);

  const view = useMemo(() => {
    const delivery = ambition + capacity - cost * 0.5 - risk * 0.3;
    const exposure = risk + Math.max(0, ambition - capacity);
    const feasibility = capacity - Math.max(0, ambition - 3) - cost * 0.2;
    return {
      delivery: clamp(delivery),
      exposure: clamp(exposure),
      feasibility: clamp(feasibility),
    };
  }, [ambition, risk, cost, capacity]);

  return (
    <div className="rn-tool">
      <div className="rn-tool-head">
        <div className="rn-tool-title">Digital trade off game</div>
        <div className="rn-tool-sub">Balance ambition, risk, cost, and capacity. Notice how extremes hurt feasibility and increase exposure.</div>
      </div>

      <div className="rn-grid rn-grid-2 rn-mt">
        <div className="rn-card space-y-2">
          <Slider label="Ambition" value={ambition} onChange={setAmbition} />
          <Slider label="Risk appetite" value={risk} onChange={setRisk} />
          <Slider label="Cost pressure" value={cost} onChange={setCost} />
          <Slider label="Delivery capacity" value={capacity} onChange={setCapacity} />
        </div>

        <div className="rn-card">
          <div className="rn-card-title">Consequences</div>
          <div className="rn-grid rn-grid-3 rn-mt">
            <Metric title="Delivery potential" value={view.delivery} />
            <Metric title="Risk exposure" value={view.exposure} />
            <Metric title="Feasibility" value={view.feasibility} />
          </div>
          <div className="rn-mini rn-mt">
            <div className="rn-mini-title">Reflection</div>
            <div className="rn-mini-body">Which lever should move first to make the plan realistic. What would you say to a leader asking for more with the same capacity.</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Slider({ label, value, onChange }) {
  return (
    <label className="rn-field rn-w-full">
      <div className="rn-field-label">{label}: {value}</div>
      <input className="rn-range" type="range" min={1} max={5} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}

function Metric({ title, value }) {
  return (
    <div className="rn-mini">
      <div className="rn-mini-title">
        {title}: {value}
      </div>
      <div className="rn-mini-body text-sm text-gray-700">Higher delivery and feasibility are positive. Lower exposure is positive.</div>
    </div>
  );
}

function clamp(n) {
  return Math.max(1, Math.min(5, Math.round(n)));
}
