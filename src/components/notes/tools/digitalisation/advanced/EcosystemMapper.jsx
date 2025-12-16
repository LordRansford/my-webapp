"use client";

import { useState } from "react";

const START_LINKS = [
  { id: 1, from: "Your organisation", to: "Identity provider", type: "Depends on" },
  { id: 2, from: "Your organisation", to: "Regulator", type: "Reports to" },
  { id: 3, from: "Partners", to: "Your organisation", type: "Consumes APIs" },
];

export default function EcosystemMapper() {
  const [links, setLinks] = useState(START_LINKS);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [type, setType] = useState("Depends on");

  const add = () => {
    if (!from.trim() || !to.trim()) return;
    setLinks((prev) => [...prev, { id: Date.now(), from: from.trim(), to: to.trim(), type }]);
    setFrom("");
    setTo("");
    setType("Depends on");
  };

  return (
    <div className="rn-tool">
      <div className="rn-tool-head">
        <div className="rn-tool-title">Ecosystem mapper</div>
        <div className="rn-tool-sub">List the organisations, platforms, and data flows you rely on and who relies on you.</div>
      </div>

      <div className="rn-grid rn-grid-2 rn-mt">
        <div className="rn-card space-y-2">
          <input className="rn-input" placeholder="From (e.g. your org)" value={from} onChange={(e) => setFrom(e.target.value)} />
          <input className="rn-input" placeholder="To (e.g. regulator, partner)" value={to} onChange={(e) => setTo(e.target.value)} />
          <select className="rn-input" value={type} onChange={(e) => setType(e.target.value)}>
            <option>Depends on</option>
            <option>Reports to</option>
            <option>Shares data with</option>
            <option>Provides platform to</option>
          </select>
          <button className="rn-btn rn-btn-primary" onClick={add}>
            Add connection
          </button>
        </div>

        <div className="rn-card">
          <div className="rn-card-title">Connections</div>
          <div className="rn-card-body space-y-2">
            {links.map((l) => (
              <div key={l.id} className="rn-mini">
                <div className="rn-mini-title">
                  {l.from} → {l.to}
                </div>
                <div className="rn-mini-body text-sm text-gray-700">{l.type}</div>
              </div>
            ))}
          </div>
          <div className="rn-mini rn-mt">
            <div className="rn-mini-title">Reflection</div>
            <div className="rn-mini-body">Which links are most fragile. If one party fails, who else is affected.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
