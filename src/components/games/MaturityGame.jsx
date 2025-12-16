"use client";

import { useState } from "react";

export default function MaturityGame() {
  const [current, setCurrent] = useState(2);
  const [target, setTarget] = useState(3);

  const jumpTooFar = target - current >= 3;

  return (
    <div className="rn-tool">
      <div className="rn-tool-head">
        <div className="rn-tool-title">Maturity and readiness</div>
        <div className="rn-tool-sub">Place an organisation on a simple maturity scale, then try to jump too far and see what breaks.</div>
      </div>

      <div className="rn-grid rn-grid-2 rn-mt">
        <div className="rn-card space-y-2">
          <label className="rn-label">
            Current maturity: {current}
            <input className="rn-range" type="range" min={1} max={5} value={current} onChange={(e) => setCurrent(Number(e.target.value))} />
          </label>
          <label className="rn-label">
            Target maturity: {target}
            <input className="rn-range" type="range" min={1} max={5} value={target} onChange={(e) => setTarget(Number(e.target.value))} />
          </label>
        </div>

        <div className="rn-card">
          <div className="rn-card-title">What happens</div>
          <div className="rn-card-body">
            {jumpTooFar
              ? "Jumping too far usually fails. Build capabilities, platforms, and culture in stages."
              : "A one step jump is more realistic. It lets teams learn and adapt funding, governance, and platforms gradually."}
          </div>
          <div className="rn-mini rn-mt">
            <div className="rn-mini-title">Reflection</div>
            <div className="rn-mini-body">What specific actions make the next stage realistic. Which dependencies block you today.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
