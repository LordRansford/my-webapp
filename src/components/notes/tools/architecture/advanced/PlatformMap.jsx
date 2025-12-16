"use client";

import { useState } from "react";

const START_CAPS = [
  { id: 1, name: "Identity", purpose: "Sign-on, roles, tokens" },
  { id: 2, name: "Data platform", purpose: "Shared storage, governance" },
  { id: 3, name: "Observability", purpose: "Logs, metrics, traces" },
];

const START_TEAMS = [
  { id: 1, name: "Web", needs: ["Identity", "Observability"] },
  { id: 2, name: "Mobile", needs: ["Identity", "Observability"] },
  { id: 3, name: "Analytics", needs: ["Data platform", "Identity"] },
];

export default function PlatformMap() {
  const [caps, setCaps] = useState(START_CAPS);
  const [teams, setTeams] = useState(START_TEAMS);
  const [capName, setCapName] = useState("");
  const [capPurpose, setCapPurpose] = useState("");
  const [teamName, setTeamName] = useState("");
  const [teamNeed, setTeamNeed] = useState("");

  const addCap = () => {
    if (!capName.trim() || !capPurpose.trim()) return;
    setCaps((prev) => [...prev, { id: Date.now(), name: capName.trim(), purpose: capPurpose.trim() }]);
    setCapName("");
    setCapPurpose("");
  };

  const addTeam = () => {
    if (!teamName.trim() || !teamNeed.trim()) return;
    const needs = teamNeed
      .split(",")
      .map((n) => n.trim())
      .filter(Boolean);
    setTeams((prev) => [...prev, { id: Date.now(), name: teamName.trim(), needs }]);
    setTeamName("");
    setTeamNeed("");
  };

  return (
    <div className="rn-tool">
      <div className="rn-tool-head">
        <div className="rn-tool-title">Platform and ecosystem mapper</div>
        <div className="rn-tool-sub">List platform capabilities and which teams depend on them. Notice coupling and shared risk.</div>
      </div>

      <div className="rn-grid rn-grid-2 rn-mt">
        <div className="rn-card space-y-3">
          <div className="rn-card-title">Add capability</div>
          <input
            className="rn-input"
            placeholder="Capability name"
            value={capName}
            onChange={(e) => setCapName(e.target.value)}
          />
          <textarea
            className="rn-input"
            placeholder="Purpose"
            value={capPurpose}
            onChange={(e) => setCapPurpose(e.target.value)}
          />
          <button className="rn-btn rn-btn-primary" onClick={addCap}>
            Add capability
          </button>
        </div>

        <div className="rn-card space-y-3">
          <div className="rn-card-title">Add team</div>
          <input
            className="rn-input"
            placeholder="Team name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
          <input
            className="rn-input"
            placeholder="Needs (comma separated)"
            value={teamNeed}
            onChange={(e) => setTeamNeed(e.target.value)}
          />
          <button className="rn-btn rn-btn-primary" onClick={addTeam}>
            Add team
          </button>
        </div>
      </div>

      <div className="rn-grid rn-grid-2 rn-mt">
        <div className="rn-card">
          <div className="rn-card-title">Capabilities</div>
          <div className="rn-card-body space-y-2">
            {caps.map((c) => (
              <div key={c.id} className="rn-mini">
                <div className="rn-mini-title">{c.name}</div>
                <div className="rn-mini-body text-sm text-gray-700">{c.purpose}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rn-card">
          <div className="rn-card-title">Teams and dependency hints</div>
          <div className="rn-card-body space-y-2">
            {teams.map((t) => (
              <div key={t.id} className="rn-mini">
                <div className="rn-mini-title">{t.name}</div>
                <div className="rn-mini-body text-sm text-gray-700">
                  Depends on: {t.needs.join(", ")}
                </div>
              </div>
            ))}
          </div>
          <div className="rn-mini rn-mt">
            <div className="rn-mini-title">Reflection</div>
            <div className="rn-mini-body">
              Which capability is a single point of failure. Who owns it. How does the platform protect consumers from change.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
