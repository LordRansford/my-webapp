"use client";

import { useState } from "react";

const STYLES = [
  {
    id: "layered",
    name: "Layered",
    fit: "Clarity and separation of concerns",
    tradeoff: "Can become rigid or slow to change across layers",
  },
  {
    id: "microservices",
    name: "Microservices",
    fit: "Team autonomy and independent scaling",
    tradeoff: "Operational complexity, distributed debugging",
  },
  {
    id: "event",
    name: "Event driven",
    fit: "Loose coupling and async workflows",
    tradeoff: "Harder causality tracking, eventual consistency",
  },
  {
    id: "monolith",
    name: "Modular monolith",
    fit: "Fast delivery, simple ops, shared domain model",
    tradeoff: "Requires discipline to avoid tight coupling",
  },
];

export default function StyleSelector() {
  const [choice, setChoice] = useState(STYLES[0]);

  return (
    <div className="rn-tool">
      <div className="rn-tool-head">
        <div className="rn-tool-title">Architecture style explorer</div>
        <div className="rn-tool-sub">Pick a style and see the fit and trade-off in plain terms.</div>
      </div>

      <div className="rn-grid rn-grid-2 rn-mt">
        <div className="rn-card">
          <div className="rn-card-title">Pick a style</div>
          <div className="rn-grid rn-grid-1 rn-mt">
            {STYLES.map((s) => (
              <button
                key={s.id}
                className={`rn-choice ${choice.id === s.id ? "rn-choice-active" : ""}`}
                onClick={() => setChoice(s)}
              >
                <div className="rn-choice-title">{s.name}</div>
                <div className="rn-choice-body text-sm text-gray-700">{s.fit}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="rn-card">
          <div className="rn-card-title">What this means</div>
          <div className="rn-card-body space-y-2">
            <div className="rn-mini">
              <div className="rn-mini-title">Best fit</div>
              <div className="rn-mini-body">{choice.fit}</div>
            </div>
            <div className="rn-mini">
              <div className="rn-mini-title">Trade-off</div>
              <div className="rn-mini-body">{choice.tradeoff}</div>
            </div>
            <div className="rn-mini">
              <div className="rn-mini-title">Ask yourself</div>
              <div className="rn-mini-body">
                Does this style match our team structure, operational maturity, and quality priorities?
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
