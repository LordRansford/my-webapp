"use client";

import { useMemo, useState } from "react";

export default function GovernanceDesigner() {
  const [standards, setStandards] = useState(2);
  const [automation, setAutomation] = useState(2);
  const [review, setReview] = useState(2);

  const result = useMemo(() => {
    const control = standards + automation + review;
    const friction =
      (standards > 3 ? 1 : 0) +
      (review > 3 ? 1 : 0) +
      (automation < 2 ? 1 : 0);

    const summary =
      friction >= 2
        ? "Governance is likely heavy. Expect slow delivery and teams bypassing process."
        : control < 5
        ? "Governance is too light. Risks and drift will accumulate quietly."
        : "Governance is balanced. Constraints are clear and delivery can still move.";

    return { control, friction, summary };
  }, [standards, automation, review]);

  return (
    <div className="rn-tool">
      <div className="rn-tool-head">
        <div className="rn-tool-title">Architecture governance designer</div>
        <div className="rn-tool-sub">Adjust standards, automation, and review depth. See how control and friction change.</div>
      </div>

      <div className="rn-card space-y-4 rn-mt">
        <Slider label="Standards clarity" value={standards} onChange={setStandards} />
        <Slider label="Automation of checks" value={automation} onChange={setAutomation} />
        <Slider label="Review depth" value={review} onChange={setReview} />

        <div className="rn-mini">
          <div className="rn-mini-title">Control signal</div>
          <div className="rn-mini-body">{result.control} (higher means tighter control)</div>
        </div>
        <div className="rn-mini">
          <div className="rn-mini-title">Friction risk</div>
          <div className="rn-mini-body">{result.friction >= 2 ? "High" : result.friction === 1 ? "Moderate" : "Low"}</div>
        </div>
        <div className="rn-mini">
          <div className="rn-mini-title">Debrief</div>
          <div className="rn-mini-body">{result.summary}</div>
        </div>
      </div>
    </div>
  );
}

function Slider({ label, value, onChange }) {
  return (
    <label className="rn-field">
      <div className="rn-field-label">
        {label}: <strong>{value}</strong>
      </div>
      <input
        className="rn-range"
        type="range"
        min={1}
        max={5}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}
