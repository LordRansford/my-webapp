"use client";

import { useMemo, useState } from "react";

const VISIONS = [
  { id: 1, text: "Make it possible for every customer to complete the top three journeys online within five minutes.", outcomes: 5, clarity: 5 },
  { id: 2, text: "Improve digital capabilities across the organisation.", outcomes: 2, clarity: 2 },
  { id: 3, text: "Use data to make faster, safer operational decisions for critical services.", outcomes: 4, clarity: 4 },
];

export default function VisionGame() {
  const [picked, setPicked] = useState(null);

  const score = useMemo(() => {
    if (!picked) return null;
    const v = VISIONS.find((x) => x.id === picked);
    if (!v) return null;
    return {
      clarity: v.clarity,
      measurability: v.outcomes,
    };
  }, [picked]);

  return (
    <div className="rn-tool">
      <div className="rn-tool-head">
        <div className="rn-tool-title">Vision and value</div>
        <div className="rn-tool-sub">Pick a vision and see how clear and measurable it is. Strong visions are specific and outcome based.</div>
      </div>

      <div className="rn-card rn-mt space-y-2">
        {VISIONS.map((v) => (
          <button
            key={v.id}
            className={`rn-choice ${picked === v.id ? "rn-choice-active" : ""}`}
            onClick={() => setPicked(v.id)}
          >
            {v.text}
          </button>
        ))}
      </div>

      {score && (
        <div className="rn-card rn-mt">
          <div className="rn-card-title">Assessment</div>
          <div className="rn-card-body">
            Clarity: {score.clarity} / 5 • Measurability: {score.measurability} / 5. Clear, outcome based visions make strategy and measurement easier.
          </div>
          <div className="rn-mini rn-mt">
            <div className="rn-mini-title">Reflection</div>
            <div className="rn-mini-body">How would you rewrite the weaker visions to make them specific, outcome based, and testable.</div>
          </div>
        </div>
      )}
    </div>
  );
}
