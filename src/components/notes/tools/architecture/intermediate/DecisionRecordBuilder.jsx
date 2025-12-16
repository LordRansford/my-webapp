"use client";

import { useState } from "react";

export default function DecisionRecordBuilder() {
  const [title, setTitle] = useState("");
  const [context, setContext] = useState("");
  const [options, setOptions] = useState("");
  const [decision, setDecision] = useState("");
  const [consequence, setConsequence] = useState("");

  return (
    <div className="rn-tool">
      <div className="rn-tool-head">
        <div className="rn-tool-title">Architectural decision record</div>
        <div className="rn-tool-sub">Capture the decision, context, options, and consequences. Keep it short, clear, and reviewable.</div>
      </div>

      <div className="rn-grid rn-grid-2 rn-mt">
        <div className="rn-card space-y-3">
          <label className="rn-field">
            <div className="rn-field-label">Decision title</div>
            <input className="rn-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Example: Choose data store" />
          </label>
          <label className="rn-field">
            <div className="rn-field-label">Context</div>
            <textarea className="rn-input" value={context} onChange={(e) => setContext(e.target.value)} placeholder="Constraints, quality goals, timeline" />
          </label>
          <label className="rn-field">
            <div className="rn-field-label">Options considered</div>
            <textarea className="rn-input" value={options} onChange={(e) => setOptions(e.target.value)} placeholder="List realistic options, not strawmen" />
          </label>
          <label className="rn-field">
            <div className="rn-field-label">Decision</div>
            <textarea className="rn-input" value={decision} onChange={(e) => setDecision(e.target.value)} placeholder="The choice and why" />
          </label>
          <label className="rn-field">
            <div className="rn-field-label">Consequences</div>
            <textarea className="rn-input" value={consequence} onChange={(e) => setConsequence(e.target.value)} placeholder="Upsides, downsides, review date" />
          </label>
        </div>

        <div className="rn-card">
          <div className="rn-card-title">Preview</div>
          <div className="rn-card-body space-y-2">
            <div className="rn-mini">
              <div className="rn-mini-title">Decision</div>
              <div className="rn-mini-body">{title || "Decision not set"}</div>
            </div>
            <div className="rn-mini">
              <div className="rn-mini-title">Context</div>
              <div className="rn-mini-body text-sm text-gray-700">{context || "Add constraints and quality drivers."}</div>
            </div>
            <div className="rn-mini">
              <div className="rn-mini-title">Options</div>
              <div className="rn-mini-body text-sm text-gray-700">{options || "List at least two realistic options."}</div>
            </div>
            <div className="rn-mini">
              <div className="rn-mini-title">Chosen</div>
              <div className="rn-mini-body text-sm text-gray-700">{decision || "State the choice and why."}</div>
            </div>
            <div className="rn-mini">
              <div className="rn-mini-title">Consequences</div>
              <div className="rn-mini-body text-sm text-gray-700">{consequence || "Note positives, negatives, and when to revisit."}</div>
            </div>
          </div>
          <div className="rn-mini rn-mt">
            <div className="rn-mini-title">Why capture this</div>
            <div className="rn-mini-body">Memory fades. An ADR keeps reasoning visible and makes future change deliberate.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
