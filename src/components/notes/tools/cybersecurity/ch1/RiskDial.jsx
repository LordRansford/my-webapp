"use client";

import { useState } from "react";

export default function RiskDial() {
  const [likelihood, setLikelihood] = useState(2);
  const [impact, setImpact] = useState(2);

  const risk = likelihood * impact;

  const riskLabel = () => {
    if (risk <= 4) return "Low";
    if (risk <= 9) return "Medium";
    return "High";
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-700">
        Adjust likelihood and impact to see how risk changes. These values are relative, not exact probabilities.
      </p>

      <div className="space-y-4">
        <div>
          <label className="text-xs text-gray-600">Likelihood</label>
          <input type="range" min="1" max="5" value={likelihood} onChange={(e) => setLikelihood(Number(e.target.value))} className="w-full" />
          <div className="text-sm">{likelihood}</div>
        </div>

        <div>
          <label className="text-xs text-gray-600">Impact</label>
          <input type="range" min="1" max="5" value={impact} onChange={(e) => setImpact(Number(e.target.value))} className="w-full" />
          <div className="text-sm">{impact}</div>
        </div>
      </div>

      <div className="rounded-xl border p-4 bg-gray-50">
        <div className="text-sm">Calculated risk</div>
        <div className="text-2xl font-semibold">{risk}</div>
        <div
          className={`text-sm font-medium mt-1 ${
            riskLabel() === "High" ? "text-red-600" : riskLabel() === "Medium" ? "text-amber-600" : "text-green-600"
          }`}
        >
          {riskLabel()} risk
        </div>
      </div>

      <p className="text-sm text-gray-700">
        Notice how increasing either factor increases risk, and how zero likelihood or zero impact would result in zero risk.
      </p>
    </div>
  );
}
