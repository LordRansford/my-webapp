"use client";

import { useState } from "react";

const START_SERVICES = [
  { id: 1, name: "Customer portal", owner: "Digital team", flow: "Self-service journeys" },
  { id: 2, name: "Identity and access", owner: "Platform team", flow: "Single sign-on" },
];

export default function OperatingModelLab() {
  const [services, setServices] = useState(START_SERVICES);
  const [name, setName] = useState("");
  const [owner, setOwner] = useState("");
  const [flow, setFlow] = useState("");

  const add = () => {
    if (!name.trim() || !owner.trim()) return;
    setServices((prev) => [...prev, { id: Date.now(), name: name.trim(), owner: owner.trim(), flow: flow.trim() }]);
    setName("");
    setOwner("");
    setFlow("");
  };

  return (
    <div className="rn-tool">
      <div className="rn-tool-head">
        <div className="rn-tool-title">Operating model lab</div>
        <div className="rn-tool-sub">Sketch services, ownership, and flows. Notice how responsibility and flow align.</div>
      </div>

      <div className="rn-grid rn-grid-2 rn-mt">
        <div className="rn-card space-y-2">
          <input className="rn-input" placeholder="Service" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="rn-input" placeholder="Owner/team" value={owner} onChange={(e) => setOwner(e.target.value)} />
          <input className="rn-input" placeholder="Key flow (optional)" value={flow} onChange={(e) => setFlow(e.target.value)} />
          <button className="rn-btn rn-btn-primary" onClick={add}>
            Add service
          </button>
        </div>

        <div className="rn-card">
          <div className="rn-card-title">Services and owners</div>
          <div className="rn-card-body space-y-2">
            {services.map((s) => (
              <div key={s.id} className="rn-mini">
                <div className="rn-mini-title">{s.name}</div>
                <div className="rn-mini-body text-sm text-gray-700">
                  Owner: {s.owner}
                  {s.flow ? ` · Flow: ${s.flow}` : ""}
                </div>
              </div>
            ))}
          </div>
          <div className="rn-mini rn-mt">
            <div className="rn-mini-title">Reflection</div>
            <div className="rn-mini-body">
              Do owners align to services. Where do handoffs happen. Are decisions and accountability clear for the flows that matter most.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
