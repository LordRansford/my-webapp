"use client";

import { useMemo, useState } from "react";

const START = [
  { id: 1, name: "Auth", reason: "Identity and sessions" },
  { id: 2, name: "Catalog", reason: "Product data" },
  { id: 3, name: "Checkout", reason: "Payments and orders" },
];

export default function DecompositionLab() {
  const [items, setItems] = useState(START);
  const [newName, setNewName] = useState("");
  const [newReason, setNewReason] = useState("");

  const cohesionHint = useMemo(() => {
    const multiReason = items.some((i) => (i.reason || "").split(/,|and/).length > 1);
    if (multiReason) return "Some components have multiple reasons to change. Consider splitting by responsibility.";
    return "Responsibilities look focused. Check coupling next.";
  }, [items]);

  const add = () => {
    if (!newName.trim() || !newReason.trim()) return;
    setItems((prev) => [...prev, { id: Date.now(), name: newName.trim(), reason: newReason.trim() }]);
    setNewName("");
    setNewReason("");
  };

  return (
    <div className="rn-tool">
      <div className="rn-tool-head">
        <div className="rn-tool-title">System decomposition lab</div>
        <div className="rn-tool-sub">List components and their single responsibility. Too many reasons to change signals poor boundaries.</div>
      </div>

      <div className="rn-grid rn-grid-2 rn-mt">
        <div className="rn-card">
          <div className="rn-card-title">Add component</div>
          <div className="rn-card-body space-y-2">
            <input
              className="rn-input"
              placeholder="Component"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <textarea
              className="rn-input"
              placeholder="Single responsibility"
              value={newReason}
              onChange={(e) => setNewReason(e.target.value)}
            />
            <button className="rn-btn rn-btn-primary" onClick={add}>
              Add
            </button>
          </div>
        </div>

        <div className="rn-card">
          <div className="rn-card-title">Current decomposition</div>
          <div className="rn-card-body space-y-2">
            {items.map((i) => (
              <div key={i.id} className="rn-mini">
                <div className="rn-mini-title">{i.name}</div>
                <div className="rn-mini-body text-sm text-gray-700">{i.reason}</div>
              </div>
            ))}
          </div>
          <div className="rn-mini rn-mt">
            <div className="rn-mini-title">Signal</div>
            <div className="rn-mini-body">{cohesionHint}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
