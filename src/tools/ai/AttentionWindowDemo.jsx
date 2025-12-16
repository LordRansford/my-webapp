"use client";

import { useMemo, useState } from "react";

function log(storageKey, event) {
  const raw = localStorage.getItem(storageKey);
  const parsed = raw ? JSON.parse(raw) : { events: [] };
  parsed.events = Array.isArray(parsed.events) ? parsed.events : [];
  parsed.events.push({ ...event, at: Date.now() });
  localStorage.setItem(storageKey, JSON.stringify(parsed));
}

export default function AttentionWindowDemo({ storageKey }) {
  const doc = useMemo(
    () => ({
      title: "Long context note",
      chunks: [
        "Important fact: The admin password was rotated on Monday and stored in the secure vault.",
        "Background: The system uses rotating credentials and short lived sessions.",
        "Noise: A long paragraph about unrelated operations and meetings that adds length but no signal.",
        "More noise: More operational detail that looks relevant but is not.",
        "Critical update: The password rotation failed on Tuesday due to an outage. The old password remained active.",
        "Later summary: A confident summary can ignore earlier facts if they fall outside the active window.",
      ],
    }),
    []
  );

  const [windowSize, setWindowSize] = useState(2);
  const [pos, setPos] = useState(0);
  const [questioned, setQuestioned] = useState(false);

  const visible = doc.chunks.slice(pos, pos + windowSize);

  const ask = () => {
    setQuestioned(true);
    const hasCritical = visible.some((x) => x.includes("failed on Tuesday"));
    const severity = hasCritical ? "low" : "high";
    log(storageKey, { type: "attention_miss", severity });
  };

  const shift = (delta) => {
    setPos((p) => {
      const next = Math.min(Math.max(0, p + delta), Math.max(0, doc.chunks.length - windowSize));
      return next;
    });
    setQuestioned(false);
  };

  return (
    <div className="rn-tool">
      <div className="rn-tool-head">
        <div className="rn-tool-title">Context window demo</div>
        <div className="rn-tool-sub">
          Slide through the document. Only a limited window is active at once. Ask the question and see what falls out.
        </div>
      </div>

      <div className="rn-controls">
        <label className="rn-label">Window size</label>
        <input className="rn-range" type="range" min={1} max={4} value={windowSize} onChange={(e) => setWindowSize(parseInt(e.target.value, 10))} />
        <div className="rn-hint">Active chunks: {windowSize}</div>
      </div>

      <div className="rn-doc rn-mt">
        {visible.map((t, i) => (
          <div key={i} className="rn-doc-line">
            {t}
          </div>
        ))}
      </div>

      <div className="rn-actions rn-mt">
        <button className="rn-btn" onClick={() => shift(-1)}>
          Up
        </button>
        <button className="rn-btn" onClick={() => shift(1)}>
          Down
        </button>
        <button className="rn-btn rn-btn-primary" onClick={ask}>
          Ask: was the password rotation successful
        </button>
      </div>

      {questioned && (
        <div className="rn-card rn-mt">
          <div className="rn-card-title">What you should notice</div>
          <div className="rn-card-body">
            If the critical update is outside the active window, the system cannot reliably account for it. This is why context is not memory and why fluent answers can still ignore key facts.
          </div>
        </div>
      )}
    </div>
  );
}
