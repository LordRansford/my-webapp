"use client";

import { useMemo, useState } from "react";

const DEPENDENCIES = [
  { id: "library", label: "Third-party library", reach: 3 },
  { id: "build", label: "Build pipeline", reach: 4 },
  { id: "idp", label: "Identity provider", reach: 5 },
  { id: "cdn", label: "CDN", reach: 2 },
];

export default function SupplyChainRiskTool() {
  const [compromised, setCompromised] = useState([]);

  const score = useMemo(() => {
    return compromised.reduce((sum, id) => {
      const d = DEPENDENCIES.find((x) => x.id === id);
      return sum + (d?.reach || 0);
    }, 0);
  }, [compromised]);

  const toggle = (id) => {
    setCompromised((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return (
    <div className="rn-tool">
      <div className="rn-tool-head">
        <div className="rn-tool-title">Supply chain blast</div>
        <div className="rn-tool-sub">Select a compromised dependency. See how much reach it has.</div>
      </div>

      <div className="rn-grid rn-grid-2">
        {DEPENDENCIES.map((d) => (
          <label key={d.id} className="rn-card rn-game-row">
            <input type="checkbox" checked={compromised.includes(d.id)} onChange={() => toggle(d.id)} />
            {d.label} (reach {d.reach})
          </label>
        ))}
      </div>

      <div className="rn-card rn-mt">
        <div className="rn-card-title">Impact estimate</div>
        <div className="rn-card-body">
          Estimated blast score: {score}. Larger reach means more systemic risk. Isolation and verification reduce it.
        </div>
      </div>
    </div>
  );
}
