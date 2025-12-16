"use client";

import { useState } from "react";

function log(storageKey, event) {
  const raw = localStorage.getItem(storageKey);
  const parsed = raw ? JSON.parse(raw) : { events: [] };
  parsed.events = Array.isArray(parsed.events) ? parsed.events : [];
  parsed.events.push({ ...event, at: Date.now() });
  localStorage.setItem(storageKey, JSON.stringify(parsed));
}

export default function AutonomousDefenceSimulator({ storageKey }) {
  const [policy, setPolicy] = useState("measured");
  const [done, setDone] = useState(false);

  const run = () => {
    setDone(true);
    const damage = policy === "aggressive" ? "high" : "low";
    log(storageKey, { type: "autodefence_policy", policy, damage });
  };

  return (
    <div className="rn-tool">
      <div className="rn-tool-head">
        <div className="rn-tool-title">Automated defence</div>
        <div className="rn-tool-sub">Choose how the system responds to a suspected attack. Notice that overreaction is also a failure mode.</div>
      </div>

      <div className="rn-grid rn-grid-2">
        <button className={`rn-choice ${policy === "measured" ? "rn-choice-active" : ""}`} onClick={() => setPolicy("measured")} disabled={done}>
          <div className="rn-choice-title">Measured</div>
          <div className="rn-choice-body">Quarantines suspicious activity and escalates for review.</div>
        </button>
        <button className={`rn-choice ${policy === "aggressive" ? "rn-choice-active" : ""}`} onClick={() => setPolicy("aggressive")} disabled={done}>
          <div className="rn-choice-title">Aggressive</div>
          <div className="rn-choice-body">Blocks large ranges, resets tokens, disables accounts quickly.</div>
        </button>
      </div>

      <div className="rn-actions rn-mt">
        <button className="rn-btn rn-btn-primary" onClick={run} disabled={done}>
          Run scenario
        </button>
      </div>

      {done && (
        <div className="rn-card rn-mt">
          <div className="rn-card-title">Outcome</div>
          <div className="rn-card-body">
            {policy === "aggressive"
              ? "The system blocked legitimate users, caused downtime, and triggered operational chaos. The attacker slowed down but you harmed your own service badly."
              : "The system contained the incident, preserved evidence, and reduced harm. Response was slower, but damage stayed controlled."}
          </div>
          <div className="rn-mini rn-mt">
            <div className="rn-mini-title">Key idea</div>
            <div className="rn-mini-body">
              Autonomous systems must be evaluated as dynamic systems. Overreach and underreach are both failure modes. Safe automation is careful automation.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
