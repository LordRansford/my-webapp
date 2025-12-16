"use client";

import { useMemo, useState } from "react";

export default function TradeoffExplorer() {
  const [perf, setPerf] = useState(5);
  const [maintain, setMaintain] = useState(5);
  const [availability, setAvailability] = useState(5);

  const summary = useMemo(() => {
    const notes = [];
    if (perf > 7) notes.push("Performance high: watch complexity and caching hotspots.");
    if (maintain > 7) notes.push("Maintainability high: expect more abstraction, possibly slower paths.");
    if (availability > 7) notes.push("Availability high: redundancy adds cost and operational overhead.");
    if (notes.length === 0) return "Balanced profile. Confirm it matches the business need.";
    return notes.join(" ");
  }, [perf, maintain, availability]);

  return (
    <div className="rn-tool">
      <div className="rn-tool-head">
        <div className="rn-tool-title">Trade-off explorer</div>
        <div className="rn-tool-sub">Adjust priorities and see the narrative shift.</div>
      </div>

      <div className="space-y-3">
        <Slider label="Performance" value={perf} onChange={setPerf} />
        <Slider label="Maintainability" value={maintain} onChange={setMaintain} />
        <Slider label="Availability" value={availability} onChange={setAvailability} />
      </div>

      <div className="rn-card rn-mt">
        <div className="rn-card-title">What this means</div>
        <div className="rn-card-body">{summary}</div>
      </div>
    </div>
  );
}

function Slider({ label, value, onChange }) {
  return (
    <label className="block">
      <div className="rn-field-label">{label}: {value}</div>
      <input
        className="rn-range"
        type="range"
        min={1}
        max={10}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}
