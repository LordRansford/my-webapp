"use client";

import { useMemo, useState } from "react";

const FEATURE_SETS = [
  {
    id: "hospital",
    title: "Hospital readmission risk",
    prompt: "Select the features that leak information you would not truly have at prediction time.",
    features: [
      { k: "age", leak: false, why: "Known at intake." },
      { k: "number_of_followup_visits", leak: true, why: "Follow-ups happen after suspicion of complications." },
      { k: "initial_symptoms_score", leak: false, why: "Known at intake if measured properly." },
      { k: "prescribed_intensive_treatment", leak: true, why: "Treatment choice encodes clinician judgment about outcome." },
    ],
  },
  {
    id: "fraud",
    title: "Fraud detection",
    prompt: "Spot the leaked signals.",
    features: [
      { k: "transaction_amount", leak: false, why: "Known at prediction." },
      { k: "manual_review_flag", leak: true, why: "Set after the label; it encodes the answer." },
      { k: "device_country", leak: false, why: "Known at prediction." },
      { k: "chargeback_processed", leak: true, why: "Happens after fraud is confirmed." },
    ],
  },
];

export default function LeakageDetectionGame() {
  const [setIndex, setSetIndex] = useState(0);
  const [picked, setPicked] = useState(new Set());
  const [checked, setChecked] = useState(false);

  const round = useMemo(() => FEATURE_SETS[setIndex], [setIndex]);

  const toggle = (k) => {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  };

  const submit = () => setChecked(true);
  const reset = () => {
    setPicked(new Set());
    setChecked(false);
  };

  const leaks = round.features.filter((f) => f.leak).map((f) => f.k);
  const missed = leaks.filter((k) => !picked.has(k));
  const caught = leaks.filter((k) => picked.has(k));

  return (
    <div className="space-y-3 text-sm text-gray-800">
      <div className="flex flex-wrap gap-2">
        {FEATURE_SETS.map((fs, idx) => (
          <button
            key={fs.id}
            className={`rn-btn ${idx === setIndex ? "rn-btn-primary" : ""}`}
            onClick={() => {
              setSetIndex(idx);
              reset();
            }}
          >
            {fs.title}
          </button>
        ))}
      </div>

      <div className="rn-mini">
        <div className="rn-mini-title">{round.title}</div>
        <div className="rn-mini-body">{round.prompt}</div>
      </div>

      <div className="rn-grid rn-grid-2">
        {round.features.map((f) => (
          <button
            key={f.k}
            className={`rn-card rn-card-button ${picked.has(f.k) ? "bg-black text-white" : ""}`}
            onClick={() => toggle(f.k)}
            aria-pressed={picked.has(f.k)}
          >
            <div className="rn-card-title">{f.k}</div>
            <div className="rn-card-body">Tap to mark as leak</div>
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <button className="rn-btn rn-btn-primary" onClick={submit} disabled={checked}>
          Check
        </button>
        <button className="rn-btn" onClick={reset}>
          Reset
        </button>
      </div>

      {checked && (
        <div className="rn-card">
          <div className="rn-card-title">What leaked</div>
          <div className="rn-card-body">
            Leakage often looks useful. The question is always: would this be known at the exact moment we must predict?
          </div>
          <div className="rn-grid rn-grid-2 rn-mt">
            {round.features
              .filter((x) => x.leak)
              .map((x) => (
                <div key={x.k} className="rn-mini">
                  <div className="rn-mini-title">
                    {x.k} {picked.has(x.k) ? "(caught)" : "(missed)"}
                  </div>
                  <div className="rn-mini-body">{x.why}</div>
                </div>
              ))}
          </div>
          <div className="rn-mini rn-mt">
            <div className="rn-mini-title">Result</div>
            <div className="rn-mini-body">
              Caught: {caught.length} · Missed: {missed.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
