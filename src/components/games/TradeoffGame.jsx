"use client";

import { useMemo, useState } from "react";

export default function TradeoffGame() {
  const [performance, setPerformance] = useState(3);
  const [security, setSecurity] = useState(3);
  const [availability, setAvailability] = useState(3);
  const [maintainability, setMaintainability] = useState(3);

  const summary = useMemo(() => {
    const focus = Math.max(performance, security, availability, maintainability);
    if (security === focus && performance < 3) return "You prioritised security. Check you still meet performance expectations.";
    if (performance === focus && security < 3) return "You prioritised speed. Confirm risk is acceptable and controls exist.";
    if (availability === focus && maintainability < 3) return "You prioritised uptime. Watch for growing maintenance debt.";
    if (maintainability === focus && performance < 3) return "You prioritised simplicity. Ensure you still meet load and latency needs.";
    return "Balanced trade-offs. Keep testing with real constraints.";
  }, [performance, security, availability, maintainability]);

  return (
    <div className="rn-tool">
      <div className="rn-tool-head">
        <div className="rn-tool-title">Choose the trade-off</div>
        <div className="rn-tool-sub">Balance performance, security, availability, and maintainability under constraints.</div>
      </div>

      <div className="rn-card space-y-3">
        <Slider label="Performance" value={performance} onChange={setPerformance} />
        <Slider label="Security" value={security} onChange={setSecurity} />
        <Slider label="Availability" value={availability} onChange={setAvailability} />
        <Slider label="Maintainability" value={maintainability} onChange={setMaintainability} />

        <div className="rn-mini rn-mt">
          <div className="rn-mini-title">Reflection</div>
          <div className="rn-mini-body">{summary}</div>
        </div>
      </div>
    </div>
  );
}

function Slider({ label, value, onChange }) {
  return (
    <label className="rn-field">
      <div className="rn-field-label">
        {label}: <strong>{value}</strong>
      </div>
      <input className="rn-range" type="range" min={1} max={5} step={1} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}
