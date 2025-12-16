"use client";

import { useState } from "react";

function log(storageKey, event) {
  const raw = localStorage.getItem(storageKey);
  const parsed = raw ? JSON.parse(raw) : { events: [] };
  parsed.events = Array.isArray(parsed.events) ? parsed.events : [];
  parsed.events.push({ ...event, at: Date.now() });
  localStorage.setItem(storageKey, JSON.stringify(parsed));
}

const zones = [
  { id: "public", label: "Public", desc: "User browsers and internet facing entry points." },
  { id: "dmz", label: "Semi trusted", desc: "APIs, auth edge, rate limiting." },
  { id: "trusted", label: "Trusted", desc: "Core services, data stores, admin." },
];

const components = [
  { id: "browser", label: "Browser" },
  { id: "api", label: "API Gateway" },
  { id: "auth", label: "Auth Service" },
  { id: "db", label: "Database" },
  { id: "admin", label: "Admin UI" },
];

export default function TrustBoundaryExplorer({ storageKey }) {
  const [placement, setPlacement] = useState({
    browser: "public",
    api: "dmz",
    auth: "dmz",
    db: "trusted",
    admin: "trusted",
  });
  const [checked, setChecked] = useState(false);

  const validate = () => {
    setChecked(true);
    const bad = placement.browser !== "public" || placement.api === "trusted" || placement.admin !== "trusted";
    log(storageKey, { type: "trust_boundary_check", result: bad ? "missed" : "ok" });
  };

  return (
    <div className="rn-tool">
      <div className="rn-tool-head">
        <div className="rn-tool-title">Place components</div>
        <div className="rn-tool-sub">Assign each component to a zone. Trust changes at the boundaries.</div>
      </div>

      <div className="rn-grid rn-grid-3">
        {zones.map((z) => (
          <div key={z.id} className="rn-card">
            <div className="rn-card-title">{z.label}</div>
            <div className="rn-card-body">{z.desc}</div>
            <div className="rn-grid rn-grid-1 rn-mt">
              {components
                .filter((c) => placement[c.id] === z.id)
                .map((c) => (
                  <div key={c.id} className="rn-mini">
                    <div className="rn-mini-title">{c.label}</div>
                  </div>
                ))}
            </div>
            <div className="rn-actions rn-mt">
              {components.map((c) => (
                <button key={`${z.id}-${c.id}`} className="rn-btn" onClick={() => setPlacement((p) => ({ ...p, [c.id]: z.id }))}>
                  Move {c.label} here
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="rn-actions rn-mt">
        <button className="rn-btn rn-btn-primary" onClick={validate}>
          Check boundaries
        </button>
      </div>

      {checked && (
        <div className="rn-card rn-mt">
          <div className="rn-card-title">What to notice</div>
          <div className="rn-card-body">
            Attackers live at boundaries. The browser should never be trusted. Admin and data must stay in the most protected zone. APIs in the middle need strict validation and identity.
          </div>
        </div>
      )}
    </div>
  );
}
