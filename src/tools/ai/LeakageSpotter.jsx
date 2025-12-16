"use client";

import { useMemo, useState } from "react";

function log(storageKey, event) {
  const raw = localStorage.getItem(storageKey);
  const parsed = raw ? JSON.parse(raw) : { events: [] };
  parsed.events = Array.isArray(parsed.events) ? parsed.events : [];
  parsed.events.push({ ...event, at: Date.now() });
  localStorage.setItem(storageKey, JSON.stringify(parsed));
}

export default function LeakageSpotter({ storageKey }) {
  const rounds = useMemo(
    () => [
      {
        id: "medical",
        title: "Hospital readmission risk",
        prompt: "Select the features that leak information you would not truly have at prediction time.",
        features: [
          { k: "age", leak: false, why: "Known at intake." },
          { k: "number_of_followup_visits", leak: true, why: "Often caused by suspicion of complications, which arrives after the moment of prediction." },
          { k: "initial_symptoms_score", leak: false, why: "Known at intake if measured properly." },
          { k: "prescribed_intensive_treatment", leak: true, why: "Treatment choice can encode clinician judgement about outcomes." },
        ],
      },
    ],
    []
  );

  const [picked, setPicked] = useState(new Set());
  const [done, setDone] = useState(false);
  const r = rounds[0];

  const toggle = (k) => {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  };

  const submit = () => {
    setDone(true);
    const leaks = r.features.filter((f) => f.leak).map((f) => f.k);
    const missed = leaks.filter((k) => !picked.has(k)).length;
    log(storageKey, { type: "leakage_round", id: r.id, result: missed > 0 ? "missed_leak" : "caught_leak", caught: leaks.length - missed, missed });
  };

  return (
    <div className="rn-tool">
      <div className="rn-tool-head">
        <div className="rn-tool-title">{r.title}</div>
        <div className="rn-tool-sub">{r.prompt}</div>
      </div>

      <div className="rn-grid rn-grid-2">
        {r.features.map((f) => (
          <button key={f.k} className={`rn-pick ${picked.has(f.k) ? "rn-pick-active" : ""}`} onClick={() => toggle(f.k)} aria-pressed={picked.has(f.k)}>
            <div className="rn-pick-title">{f.k}</div>
            <div className="rn-pick-sub">Tap to mark as leak</div>
          </button>
        ))}
      </div>

      <div className="rn-actions rn-mt">
        <button className="rn-btn" onClick={submit} disabled={done}>
          Check
        </button>
      </div>

      {done && (
        <div className="rn-card rn-mt">
          <div className="rn-card-title">What leaked and why</div>
          <div className="rn-card-body">
            Leakage often looks useful. That is exactly why it survives. The question is always: would this be known at the exact moment we must predict.
          </div>
          <div className="rn-grid rn-grid-2 rn-mt">
            {r.features
              .filter((x) => x.leak)
              .map((x) => (
                <div key={x.k} className="rn-mini">
                  <div className="rn-mini-title">{x.k}</div>
                  <div className="rn-mini-body">{x.why}</div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
