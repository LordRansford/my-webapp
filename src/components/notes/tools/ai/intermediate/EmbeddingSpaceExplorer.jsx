"use client";

import { useMemo, useState } from "react";

const ITEMS = [
  { id: "flight_booking", group: "travel" },
  { id: "hotel_reservation", group: "travel" },
  { id: "cpu_usage", group: "ops" },
  { id: "error_rate", group: "ops" },
  { id: "refund_request", group: "finance" },
  { id: "invoice_paid", group: "finance" },
];

export default function EmbeddingSpaceExplorer() {
  const [focus, setFocus] = useState("travel");
  const [freshness, setFreshness] = useState(14);
  const [chunk, setChunk] = useState(200);

  const neighbours = useMemo(() => ITEMS.filter((i) => i.group === focus), [focus]);

  const risk =
    freshness > 45 || chunk > 400
      ? "Stale or overly large chunks risk irrelevant retrieval."
      : "Fresh index and moderate chunks improve grounding quality.";

  return (
    <div className="space-y-3 text-sm text-gray-800">
      <div className="rn-grid rn-grid-3">
        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-600">Focus cluster</span>
          <select className="rn-input" value={focus} onChange={(e) => setFocus(e.target.value)}>
            <option value="travel">Travel</option>
            <option value="ops">Operations</option>
            <option value="finance">Finance</option>
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-600">Index freshness (days)</span>
          <input type="range" min="1" max="90" value={freshness} onChange={(e) => setFreshness(Number(e.target.value))} />
          <span className="text-xs text-gray-600">Current: {freshness} days</span>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs text-gray-600">Chunk size (tokens)</span>
          <input type="range" min="50" max="600" step="10" value={chunk} onChange={(e) => setChunk(Number(e.target.value))} />
          <span className="text-xs text-gray-600">Current: {chunk}</span>
        </label>
      </div>

      <div className="rn-card">
        <div className="rn-card-title">Nearest neighbours (conceptual)</div>
        <div className="rn-card-body">
          {neighbours.map((n) => (
            <div key={n.id} className="rn-mini">
              <div className="rn-mini-title">{n.id.replace("_", " ")}</div>
              <div className="rn-mini-body">Grouped by task similarity: {n.group}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rn-card">
        <div className="rn-card-title">What to notice</div>
        <div className="rn-card-body">
          Fresh indexes and precise chunks matter more than model size for grounded answers. Distance here is a teaching proxy: it is an opinion, not a fact.
        </div>
      </div>

      <div className="rn-card">
        <div className="rn-card-title">Grounding health</div>
        <div className="rn-card-body">{risk}</div>
      </div>
    </div>
  );
}
