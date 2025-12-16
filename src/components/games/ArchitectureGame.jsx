"use client";

import { useMemo, useState } from "react";

const START = [
  { id: 1, name: "UI", zone: "edge", resp: "Present data to users" },
  { id: 2, name: "API", zone: "boundary", resp: "Coordinate requests" },
  { id: 3, name: "Data", zone: "core", resp: "Store and retrieve domain data" },
];

export default function ArchitectureGame() {
  const [items, setItems] = useState(START);
  const [name, setName] = useState("");
  const [resp, setResp] = useState("");
  const [zone, setZone] = useState("edge");

  const score = useMemo(() => {
    const multiReason = items.some((i) => (i.resp || "").split(/,| and /i).length > 1);
    const hasBoundary = items.some((i) => i.zone === "boundary");
    const hasCore = items.some((i) => i.zone === "core");
    let s = 70;
    if (!multiReason) s += 10;
    if (hasBoundary && hasCore) s += 10;
    return Math.min(100, s);
  }, [items]);

  const add = () => {
    if (!name.trim() || !resp.trim()) return;
    setItems((prev) => [...prev, { id: Date.now(), name: name.trim(), zone, resp: resp.trim() }]);
    setName("");
    setResp("");
    setZone("edge");
  };

  return (
    <div className="rn-tool">
      <div className="rn-tool-head">
        <div className="rn-tool-title">Build the system</div>
        <div className="rn-tool-sub">Add components, place them, and keep responsibilities sharp.</div>
      </div>

      <div className="rn-grid rn-grid-2 rn-mt">
        <div className="rn-card space-y-3">
          <input className="rn-input" placeholder="Component" value={name} onChange={(e) => setName(e.target.value)} />
          <textarea
            className="rn-input"
            placeholder="Single responsibility"
            value={resp}
            onChange={(e) => setResp(e.target.value)}
          />
          <label className="rn-field">
            <div className="rn-field-label">Zone</div>
            <select className="rn-input" value={zone} onChange={(e) => setZone(e.target.value)}>
              <option value="edge">Edge</option>
              <option value="boundary">Boundary</option>
              <option value="core">Core</option>
            </select>
          </label>
          <button className="rn-btn rn-btn-primary" onClick={add}>
            Add component
          </button>
        </div>

        <div className="rn-card space-y-3">
          <div className="rn-card-title">Your system</div>
          <div className="rn-card-body space-y-2">
            {items.map((i) => (
              <div key={i.id} className="rn-mini">
                <div className="rn-mini-title">
                  {i.name} <span className="text-xs text-gray-500">({i.zone})</span>
                </div>
                <div className="rn-mini-body text-sm text-gray-700">{i.resp}</div>
              </div>
            ))}
          </div>
          <div className="rn-mini rn-mt">
            <div className="rn-mini-title">Signal</div>
            <div className="rn-mini-body">Responsibility clarity score: {score}/100</div>
          </div>
        </div>
      </div>
    </div>
  );
}
