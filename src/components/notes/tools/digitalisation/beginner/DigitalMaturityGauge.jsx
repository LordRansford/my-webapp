"use client";

import { useMemo, useState } from "react";

export default function DigitalMaturityGauge() {
  const [level, setLevel] = useState(2);

  const summary = useMemo(() => {
    if (level <= 2) return "Early stage. Focus on visible wins and foundational platforms people will actually use.";
    if (level === 3) return "Developing. Standardise data, identity, and ways of working. Build trust with reliable delivery.";
    return "Established. Keep improving flow, reduce friction, and make governance lightweight but real.";
  }, [level]);

  return (
    <div className="rn-tool">
      <div className="rn-tool-head">
        <div className="rn-tool-title">Digital maturity gauge</div>
        <div className="rn-tool-sub">Place an organisation on a simple maturity scale and see what realistic next steps look like.</div>
      </div>

      <div className="rn-card space-y-3 rn-mt">
        <label className="rn-field">
          <div className="rn-field-label">
            Maturity level: <strong>{level}</strong>
          </div>
          <input className="rn-range" type="range" min={1} max={5} step={1} value={level} onChange={(e) => setLevel(Number(e.target.value))} />
        </label>
        <div className="rn-mini">
          <div className="rn-mini-title">What this means</div>
          <div className="rn-mini-body">{summary}</div>
        </div>
        <div className="rn-mini">
          <div className="rn-mini-title">Hint</div>
          <div className="rn-mini-body">Maturity is not a prize. It is a way to decide what to do next without overpromising.</div>
        </div>
      </div>
    </div>
  );
}
