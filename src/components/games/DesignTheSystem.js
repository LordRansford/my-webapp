import { useMemo, useState } from "react";
import { Boxes, Layout, Database } from "lucide-react";

const zones = [
  { id: "entry", label: "Entry", hint: "Edge, gateways, auth" },
  { id: "application", label: "Application", hint: "Services, APIs" },
  { id: "services", label: "Services", hint: "Async workers, queues" },
  { id: "data", label: "Data", hint: "Stores, backups" },
];

const components = [
  { id: "api", label: "API Gateway", correct: "entry" },
  { id: "auth", label: "Identity Provider", correct: "entry" },
  { id: "svc", label: "Service Mesh", correct: "application" },
  { id: "worker", label: "Async Worker", correct: "services" },
  { id: "queue", label: "Message Queue", correct: "services" },
  { id: "db", label: "Primary Database", correct: "data" },
  { id: "backup", label: "Backups", correct: "data" },
];

export default function DesignTheSystem() {
  const [placements, setPlacements] = useState({});
  const [feedback, setFeedback] = useState("");

  const available = useMemo(
    () => components.filter((c) => !placements[c.id]),
    [placements],
  );

  const place = (componentId, zoneId) => {
    setPlacements((prev) => ({ ...prev, [componentId]: zoneId }));
  };

  const score = () => {
    const total = components.length;
    const hits = components.reduce(
      (acc, c) => (placements[c.id] === c.correct ? acc + 1 : acc),
      0,
    );
    const percent = Math.round((hits / total) * 100);
    setFeedback(percent === 100 ? "Great separation of concerns." : `${percent}% correct. Adjust and retest.`);
  };

  const reset = () => {
    setPlacements({});
    setFeedback("");
  };

  return (
    <div className="panel game">
      <div className="panel__header">
        <div className="chip chip--accent">
          <Layout size={14} aria-hidden="true" />
          Layered architecture drill
        </div>
        <p className="muted">
          Place components into the right zone. This mirrors TOGAF application vs. data vs. technology layers.
        </p>
      </div>

      <div className="design-grid">
        <div className="components-list">
          <p className="eyebrow">Components</p>
          <div className="component-chips">
            {available.map((c) => (
              <span key={c.id} className="pill pill--accent">
                <Boxes size={12} aria-hidden="true" />
                {c.label}
              </span>
            ))}
            {available.length === 0 && <p className="muted">All placed — adjust below if needed.</p>}
          </div>
        </div>

        <div className="zones">
          {zones.map((zone) => (
            <div key={zone.id} className="zone-card">
              <div className="zone-head">
                <span className="pill">{zone.label}</span>
                <span className="muted">{zone.hint}</span>
              </div>
              <div className="zone-body">
                {components.map((c) =>
                  placements[c.id] === zone.id ? (
                    <button key={c.id} className="pill pill--ghost" onClick={() => place(c.id, null)}>
                      {c.label} (remove)
                    </button>
                  ) : null,
                )}
              </div>
              <div className="zone-actions">
                {available.map((c) => (
                  <button key={c.id + zone.id} className="pill" onClick={() => place(c.id, zone.id)}>
                    Place {c.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="design-footer">
        <button className="button primary" onClick={score}>
          Score architecture
        </button>
        <button className="button ghost" onClick={reset}>
          Reset
        </button>
        {feedback && <div className="status status--ok">{feedback}</div>}
      </div>
    </div>
  );
}
