"use client";

import { useMemo, useState } from "react";

const NODES = [
  { id: "user", label: "User device" },
  { id: "api", label: "API gateway" },
  { id: "service", label: "Service" },
  { id: "db", label: "Database" },
  { id: "logs", label: "Logs" },
];

export default function TrustGraphTool() {
  const [compromised, setCompromised] = useState("user");
  const [edges, setEdges] = useState({
    api: true,
    service: true,
    db: false,
    logs: false,
  });

  const blastScore = useMemo(() => {
    let risk = compromised === "user" ? 20 : 35;
    if (edges.api) risk += 15;
    if (edges.service) risk += 15;
    if (edges.db) risk += 25;
    if (edges.logs) risk += 10;
    return Math.min(95, Math.max(5, risk));
  }, [compromised, edges]);

  return (
    <div className="rn-tool">
      <div className="rn-tool-head">
        <div className="rn-tool-title">Trust graph sketch</div>
        <div className="rn-tool-sub">Pick a compromised node and see how far the blast radius goes based on trust edges.</div>
      </div>

      <div className="rn-grid rn-grid-2">
        <div className="rn-card">
          <div className="rn-card-title">Compromise starts at</div>
          <div className="rn-card-body">
            <div className="rn-grid rn-grid-1">
              {NODES.map((n) => (
                <button
                  key={n.id}
                  className={`rn-choice ${compromised === n.id ? "rn-choice-active" : ""}`}
                  onClick={() => setCompromised(n.id)}
                >
                  {n.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rn-card">
          <div className="rn-card-title">Trust edges (more edges = more reach)</div>
          <div className="rn-card-body rn-grid rn-grid-1">
            {Object.entries(edges).map(([k, v]) => (
              <label key={k} className="rn-game-row">
                <input
                  type="checkbox"
                  checked={v}
                  onChange={() => setEdges((prev) => ({ ...prev, [k]: !v }))}
                />
                Trust path to {k}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="rn-card rn-mt">
        <div className="rn-card-title">Blast radius estimate</div>
        <div className="rn-card-body">
          <div className="rn-metrics">Approximate blast score: {blastScore}/100</div>
          <p className="rn-body mt-2">
            Fewer edges and stronger boundaries shrink blast radius. Wide trust paths make lateral movement cheap.
          </p>
        </div>
      </div>
    </div>
  );
}
