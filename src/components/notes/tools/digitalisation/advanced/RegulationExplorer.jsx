"use client";

import { useMemo, useState } from "react";

export default function RegulationExplorer() {
  const [clarity, setClarity] = useState(3);
  const [fragmentation, setFragmentation] = useState(3);
  const [trust, setTrust] = useState(3);

  const outcome = useMemo(() => {
    const enablement = clarity - fragmentation * 0.5 + trust * 0.4;
    const drag = fragmentation + (5 - clarity) * 0.5;
    const stability = clarity + trust - fragmentation;

    return {
      enablement: clamp(enablement),
      drag: clamp(drag),
      stability: clamp(stability),
    };
  }, [clarity, fragmentation, trust]);

  return (
    <div className="rn-tool">
      <div className="rn-tool-head">
        <div className="rn-tool-title">Regulation and policy explorer</div>
        <div className="rn-tool-sub">Adjust clarity, fragmentation, and trust. See how they change enablement, drag, and stability.</div>
      </div>

      <div className="rn-grid rn-grid-3 rn-mt">
        <Slider label="Regulatory clarity" value={clarity} onChange={setClarity} />
        <Slider label="Regulation fragmentation" value={fragmentation} onChange={setFragmentation} hint="Higher = more fragmented" />
        <Slider label="Public and partner trust" value={trust} onChange={setTrust} />
      </div>

      <div className="rn-card rn-mt">
        <div className="rn-card-title">What this suggests</div>
        <div className="rn-grid rn-grid-3 rn-mt">
          <Metric title="Innovation enablement" value={outcome.enablement} />
          <Metric title="Policy drag" value={outcome.drag} />
          <Metric title="Stability" value={outcome.stability} />
        </div>
        <div className="rn-mini rn-mt">
          <div className="rn-mini-title">Reflection</div>
          <div className="rn-mini-body">
            Clear, consistent rules with high trust enable digitalisation. Fragmented rules with low trust increase drag and instability.
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
        Value {value}. {hint || ""}
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
      <div className="rn-mini-body text-sm text-gray-700">Higher enablement and stability are positive. Lower drag is positive.</div>
    </div>
  );
}

function clamp(n) {
  return Math.max(1, Math.min(5, Math.round(n)));
}
