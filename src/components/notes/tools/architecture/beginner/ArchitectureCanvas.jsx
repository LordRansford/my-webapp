"use client";

import { useState } from "react";

export default function ArchitectureCanvas() {
  const [items, setItems] = useState([
    { name: "UI", responsibility: "Present data to users" },
    { name: "API", responsibility: "Coordinate requests" },
  ]);
  const [name, setName] = useState("");
  const [resp, setResp] = useState("");

  const add = () => {
    if (!name.trim() || !resp.trim()) return;
    setItems((prev) => [...prev, { name: name.trim(), responsibility: resp.trim() }]);
    setName("");
    setResp("");
  };

  return (
    <div className="rn-tool">
      <div className="rn-tool-head">
        <div className="rn-tool-title">Architecture canvas</div>
        <div className="rn-tool-sub">List components and what they own. Clear ownership is the first boundary.</div>
      </div>

      <div className="rn-grid rn-grid-2 rn-mt">
        <div className="rn-card">
          <div className="rn-card-title">Add component</div>
          <div className="rn-card-body space-y-2">
            <input
              className="rn-input"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <textarea
              className="rn-input"
              placeholder="Responsibility"
              value={resp}
              onChange={(e) => setResp(e.target.value)}
            />
            <button className="rn-btn rn-btn-primary" onClick={add}>
              Add
            </button>
          </div>
        </div>

        <div className="rn-card">
          <div className="rn-card-title">Components</div>
          <div className="rn-card-body space-y-2">
            {items.map((i, idx) => (
              <div key={`${i.name}-${idx}`} className="rn-mini">
                <div className="rn-mini-title">{i.name}</div>
                <div className="rn-mini-body text-sm text-gray-700">{i.responsibility}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
