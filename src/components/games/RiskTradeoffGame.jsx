"use client";

import { useState } from "react";

export default function RiskTradeoffGame() {
  const [budget, setBudget] = useState(5);

  const toggle = (checked) => {
    setBudget((b) => (checked ? Math.max(0, b - 1) : Math.min(5, b + 1)));
  };

  return (
    <div>
      <p className="rn-body">You have limited budget. Every control costs one unit. Choose carefully.</p>

      <div className="rn-game-row">
        <label className="rn-body">
          <input type="checkbox" onChange={(e) => toggle(e.target.checked)} disabled={budget === 0} /> Multi factor authentication
        </label>
      </div>

      <div className="rn-game-row">
        <label className="rn-body">
          <input type="checkbox" onChange={(e) => toggle(e.target.checked)} disabled={budget === 0} /> Centralised logging
        </label>
      </div>

      <div className="rn-game-row">
        <label className="rn-body">
          <input type="checkbox" onChange={(e) => toggle(e.target.checked)} disabled={budget === 0} /> Input validation
        </label>
      </div>

      <div className="rn-mini rn-mt">
        <div className="rn-mini-title">Question</div>
        <div className="rn-mini-body">Which choice reduced likelihood. Which reduced impact. What did you leave exposed and why.</div>
      </div>
    </div>
  );
}
