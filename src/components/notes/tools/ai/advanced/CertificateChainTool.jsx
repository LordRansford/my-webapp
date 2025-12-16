"use client";

import { useState } from "react";

const LINKS = [
  { id: "root", label: "Root CA", trusted: true },
  { id: "intermediate", label: "Intermediate CA", trusted: true },
  { id: "server", label: "Server cert", trusted: true },
];

export default function CertificateChainTool() {
  const [broken, setBroken] = useState({});

  return (
    <div className="rn-tool">
      <div className="rn-tool-head">
        <div className="rn-tool-title">Certificate chain check</div>
        <div className="rn-tool-sub">Toggle a link to see what happens to authenticity.</div>
      </div>

      <div className="rn-grid rn-grid-3">
        {LINKS.map((l) => (
          <div key={l.id} className="rn-card">
            <div className="rn-card-title">{l.label}</div>
            <div className="rn-card-body">
              <label className="rn-game-row">
                <input
                  type="checkbox"
                  checked={broken[l.id] || false}
                  onChange={() => setBroken((prev) => ({ ...prev, [l.id]: !prev[l.id] }))}
                />
                Break this link
              </label>
              <p className="rn-body text-sm">
                {broken[l.id]
                  ? "This link is untrusted. The chain should fail validation."
                  : "This link is trusted. Authenticity flows if all links validate."}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="rn-card rn-mt">
        <div className="rn-card-title">Outcome</div>
        <div className="rn-card-body">
          {Object.values(broken).some(Boolean)
            ? "Validation fails. Clients must refuse the connection."
            : "Chain is intact. Authenticity is established if names and usage also match."}
        </div>
      </div>
    </div>
  );
}
