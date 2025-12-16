"use client";

import { useState } from "react";

const COMPONENTS = ["UI", "API", "Service", "Database", "External IDP"];
const ZONES = ["Public", "Boundary", "Internal"];

export default function BoundaryMapper() {
  const [zones, setZones] = useState({});

  return (
    <div className="rn-tool">
      <div className="rn-tool-head">
        <div className="rn-tool-title">Boundary mapper</div>
        <div className="rn-tool-sub">Assign each component to a zone. Boundaries fail when everything is “internal”.</div>
      </div>

      <div className="rn-grid rn-grid-1 rn-mt">
        {COMPONENTS.map((c) => (
          <div key={c} className="rn-card rn-game-row">
            <span>{c}</span>
            <select
              className="rn-input"
              value={zones[c] || ""}
              onChange={(e) => setZones((prev) => ({ ...prev, [c]: e.target.value }))}
            >
              <option value="">Select zone</option>
              {ZONES.map((z) => (
                <option key={z}>{z}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <div className="rn-card rn-mt">
        <div className="rn-card-title">Reflection</div>
        <div className="rn-card-body">
          If critical assets sit in public or boundary zones, ask why. If everything is internal, ask how you validate input and identity at the edge.
        </div>
      </div>
    </div>
  );
}
