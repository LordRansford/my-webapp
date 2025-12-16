"use client";

import { useMemo, useState } from "react";

export default function EcosystemGame() {
  const [trust, setTrust] = useState(3);
  const [resilience, setResilience] = useState(3);
  const [change, setChange] = useState(3);

  const outcome = useMemo(() => {
    const stability = trust + resilience - Math.abs(change - 3) * 0.5;
    const fragility = Math.max(1, Math.min(5, 6 - stability));
    const cooperation = trust + Math.max(0, resilience - 2);

    return {
      stability: clamp(stability),
      fragility: clamp(fragility),
      cooperation: clamp(cooperation),
    };
  }, [trust, resilience, change]);

  return (
    <div className="rn-tool">
      <div className="rn-tool-head">
        <div className="rn-tool-title">Ecosystem and trust</div>
        <div className="rn-tool-sub">Adjust trust, resilience, and rate of change in a shared ecosystem. See how stability and cooperation respond.</div>
      </div>

      <div className="rn-grid rn-grid-3 rn-mt">
        <Slider label="Trust level" value={trust} onChange={setTrust} />
        <Slider label="Resilience investment" value={resilience} onChange={setResilience} />
        <Slider label="Rate of change" value={change} onChange={setChange} />
      </div>

      <div className="rn-card rn-mt">
        <div className="rn-card-title">Ecosystem response</div>
        <div className="rn-grid rn-grid-3 rn-mt">
          <Metric title="Stability" value={outcome.stability} />
          <Metric title="Fragility" value={outcome.fragility} />
          <Metric title="Cooperation" value={outcome.cooperation} />
        </div>
        <div className="rn-mini rn-mt">
          <div className="rn-mini-title">Reflection</div>
          <div className="rn-mini-body">High trust and resilience support stable ecosystems. Rapid change without trust or resilience increases fragility.</div>
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
      <div className="rn-mini-body text-sm text-gray-700">Higher stability and cooperation are positive. Lower fragility is positive.</div>
    </div>
  );
}

function clamp(n) {
  return Math.max(1, Math.min(5, Math.round(n)));
}
