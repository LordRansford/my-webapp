"use client";

import { useState } from "react";

const items = [
  { id: 1, label: "User browser", correct: "Outside" },
  { id: 2, label: "API gateway", correct: "Boundary" },
  { id: 3, label: "Application server", correct: "Inside" },
  { id: 4, label: "Database", correct: "Inside" },
  { id: 5, label: "Third party identity provider", correct: "Boundary" },
];

export default function TrustBoundaryGame() {
  const [answers, setAnswers] = useState({});

  const set = (id, value) => setAnswers({ ...answers, [id]: value });

  return (
    <div>
      {items.map((i) => (
        <div key={i.id} className="rn-game-row">
          <span>{i.label}</span>
          <select className="rn-input" onChange={(e) => set(i.id, e.target.value)} value={answers[i.id] || ""}>
            <option value="">Select</option>
            <option>Outside</option>
            <option>Boundary</option>
            <option>Inside</option>
          </select>
        </div>
      ))}

      <div className="rn-mini rn-mt">
        <div className="rn-mini-title">Reflection</div>
        <div className="rn-mini-body">Why is the boundary the most dangerous place in the system. What assumptions break here.</div>
      </div>
    </div>
  );
}
