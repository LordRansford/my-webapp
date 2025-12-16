"use client";

import { useMemo, useState } from "react";

function log(storageKey, event) {
  const raw = localStorage.getItem(storageKey);
  const parsed = raw ? JSON.parse(raw) : { events: [] };
  parsed.events = Array.isArray(parsed.events) ? parsed.events : [];
  parsed.events.push({ ...event, at: Date.now() });
  localStorage.setItem(storageKey, JSON.stringify(parsed));
}

export default function AccuracyTrapSimulator({ storageKey }) {
  const scenarios = useMemo(
    () => [
      {
        id: "fraud",
        title: "Fraud flags",
        intro: "Fraud is rare. You must choose an operating point. Your choice affects workload and harm.",
        options: [
          {
            choice: "max_accuracy",
            label: "Optimise for accuracy",
            cm: { tp: 0, fp: 0, fn: 50, tn: 9950 },
            consequence: "Looks excellent on paper. Catches nothing. The system quietly fails.",
          },
          {
            choice: "min_cost",
            label: "Optimise for consequences",
            cm: { tp: 42, fp: 220, fn: 8, tn: 9730 },
            consequence: "Lower accuracy than the first choice, but it actually protects the system.",
          },
          {
            choice: "max_recall",
            label: "Optimise for recall",
            cm: { tp: 48, fp: 900, fn: 2, tn: 9050 },
            consequence: "Catches most cases, but creates a flood of false alarms and fatigue.",
          },
        ],
      },
    ],
    []
  );

  const [picked, setPicked] = useState(null);
  const s = scenarios[0];

  const metrics = (cm) => {
    const { tp, fp, fn, tn } = cm;
    const acc = (tp + tn) / (tp + tn + fp + fn);
    const prec = tp + fp === 0 ? null : tp / (tp + fp);
    const rec = tp + fn === 0 ? null : tp / (tp + fn);
    return { acc, prec, rec };
  };

  const choose = (opt) => {
    setPicked(opt);
    log(storageKey, { type: "accuracy_trap_choice", id: s.id, choice: opt.choice });
  };

  const fmt = (v) => (v === null ? "Not applicable" : `${(Math.round(v * 1000) / 10).toFixed(1)}%`);

  return (
    <div className="rn-tool">
      <div className="rn-tool-head">
        <div className="rn-tool-title">{s.title}</div>
        <div className="rn-tool-sub">{s.intro}</div>
      </div>

      <div className="rn-grid rn-grid-3">
        {s.options.map((opt) => (
          <button
            key={opt.choice}
            className={`rn-choice ${picked?.choice === opt.choice ? "rn-choice-active" : ""}`}
            onClick={() => choose(opt)}
          >
            <div className="rn-choice-title">{opt.label}</div>
            <div className="rn-choice-body">{opt.consequence}</div>
          </button>
        ))}
      </div>

      {picked && (
        <div className="rn-card rn-mt">
          <div className="rn-card-title">What happened</div>
          <div className="rn-card-body">
            You chose <strong>{picked.label}</strong>. Below is the confusion matrix and the metric picture it creates.
          </div>

          <div className="rn-grid rn-grid-2 rn-mt">
            <div className="rn-mini">
              <div className="rn-mini-title">Confusion matrix</div>
              <div className="rn-matrix">
                <div className="rn-matrix-cell">TP {picked.cm.tp}</div>
                <div className="rn-matrix-cell">FP {picked.cm.fp}</div>
                <div className="rn-matrix-cell">FN {picked.cm.fn}</div>
                <div className="rn-matrix-cell">TN {picked.cm.tn}</div>
              </div>
            </div>

            <div className="rn-mini">
              <div className="rn-mini-title">Metrics</div>
              {(() => {
                const m = metrics(picked.cm);
                return (
                  <div className="rn-metrics">
                    <div>
                      Accuracy: <strong>{fmt(m.acc)}</strong>
                    </div>
                    <div>
                      Precision: <strong>{fmt(m.prec)}</strong>
                    </div>
                    <div>
                      Recall: <strong>{fmt(m.rec)}</strong>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
