import { useMemo, useState } from "react";
import { Shield, Zap, Bug } from "lucide-react";
import { loadScore, saveScore } from "@/lib/scores";

const layers = [
  { id: "physical", label: "Physical", hint: "Rack security, power, cooling" },
  { id: "network", label: "Network", hint: "Segmentation, firewalls, IDS" },
  { id: "transport", label: "Transport", hint: "mTLS, cipher suites" },
  { id: "application", label: "Application", hint: "WAF, input validation" },
  { id: "data", label: "Data", hint: "Encryption at rest, backups" },
];

const controls = [
  { id: "waf", label: "Web Application Firewall", layer: "application" },
  { id: "segmentation", label: "Network Segmentation", layer: "network" },
  { id: "backup", label: "Backups + Restore Tests", layer: "data" },
  { id: "mtls", label: "mTLS", layer: "transport" },
  { id: "rack", label: "Rack Locks + CCTV", layer: "physical" },
];

const threats = [
  { id: "sql", label: "SQLi", target: "application" },
  { id: "ddos", label: "DoS", target: "network" },
  { id: "tamper", label: "Tampering", target: "data" },
  { id: "sniff", label: "Sniffing", target: "transport" },
  { id: "intrude", label: "Physical Intrusion", target: "physical" },
];

export default function DefendTheStack() {
  const storedScore = loadScore("defend");
  const [placed, setPlaced] = useState({});
  const [score, setScore] = useState(storedScore?.score ?? null);
  const [message, setMessage] = useState(storedScore?.score ? "Previous score loaded." : "");

  const remainingControls = useMemo(
    () => controls.filter((c) => placed[c.id] !== c.layer),
    [placed],
  );

  const handlePlace = (controlId, layerId) => {
    setPlaced((prev) => ({ ...prev, [controlId]: layerId }));
  };

  const evaluate = () => {
    let hits = 0;
    threats.forEach((threat) => {
      const control = controls.find((c) => c.layer === threat.target);
      if (control && placed[control.id] === threat.target) hits += 1;
    });
    const percent = Math.round((hits / threats.length) * 100);
    setScore(percent);
    setMessage(percent === 100 ? "Perfect coverage. Ship it." : "Tighten a few layers and retest.");
    saveScore("defend", { score: percent, updatedAt: Date.now() });
  };

  return (
    <div className="panel game">
      <div className="panel__header">
        <div className="chip chip--accent">
          <Shield size={14} aria-hidden="true" />
          CIA + OSI practice
        </div>
        <p className="muted">Place controls on the right layer to block the threats.</p>
      </div>
      <div className="defend-grid">
        <div className="defend-layers">
          {layers.map((layer) => (
            <div key={layer.id} className="layer-card">
              <div className="layer-head">
                <span className="pill">{layer.label}</span>
                <span className="muted">{layer.hint}</span>
              </div>
              <div className="layer-drop">
                {controls
                  .filter((c) => placed[c.id] === layer.id)
                  .map((c) => (
                    <span key={c.id} className="pill pill--accent">
                      {c.label}
                    </span>
                  ))}
              </div>
              <div className="layer-actions">
                {remainingControls.map((control) => (
                  <button
                    key={control.id + layer.id}
                    className="pill"
                    onClick={() => handlePlace(control.id, layer.id)}
                  >
                    Place {control.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="defend-panel">
          <p className="eyebrow">Threats</p>
          <div className="threat-list">
            {threats.map((t) => (
              <div key={t.id} className="threat-chip">
                <Zap size={14} aria-hidden="true" />
                <div>
                  <strong>{t.label}</strong>
                  <p className="muted">Targets: {t.target}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="button primary" onClick={evaluate}>
            Evaluate coverage
          </button>
          {score !== null && (
            <div className="status status--ok">
              Score: {score}% — {message}
            </div>
          )}
          <button
            className="button ghost"
            onClick={() => {
              setPlaced({});
              setScore(null);
              setMessage("");
            }}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
