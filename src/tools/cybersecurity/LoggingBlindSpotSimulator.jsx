"use client";

import { useState } from "react";
import SwitchRow from "@/components/ui/SwitchRow";

function log(storageKey, event) {
  const raw = localStorage.getItem(storageKey);
  const parsed = raw ? JSON.parse(raw) : { events: [] };
  parsed.events = Array.isArray(parsed.events) ? parsed.events : [];
  parsed.events.push({ ...event, at: Date.now() });
  localStorage.setItem(storageKey, JSON.stringify(parsed));
}

export default function LoggingBlindSpotSimulator({ storageKey }) {
  const [auth, setAuth] = useState(true);
  const [access, setAccess] = useState(false);
  const [db, setDb] = useState(false);
  const [result, setResult] = useState(null);

  const run = () => {
    const blind = !access && !db;
    setResult(blind ? "missed" : "saw");
    log(storageKey, { type: "logging_round", sawAttack: !blind });
  };

  return (
    <div className="rn-tool">
      <div className="rn-tool-head">
        <div className="rn-tool-title">Logging configuration</div>
        <div className="rn-tool-sub">Toggle signals. An attack happens. Did you see it?</div>
      </div>

      <div className="rn-grid rn-grid-1">
        <div className="space-y-2">
          <SwitchRow
            label="Authentication events"
            description="Helps you see account takeovers and suspicious sign-ins."
            checked={auth}
            onCheckedChange={setAuth}
            tone="emerald"
          />
          <SwitchRow
            label="Sensitive endpoint access"
            description="Shows whether attackers touched admin or high-risk actions."
            checked={access}
            onCheckedChange={setAccess}
            tone="sky"
          />
          <SwitchRow
            label="Database audit logs"
            description="Gives evidence of reads, writes, and data access at the source of truth."
            checked={db}
            onCheckedChange={setDb}
            tone="indigo"
          />
        </div>
      </div>

      <div className="rn-actions rn-mt">
        <button className="rn-btn rn-btn-primary" onClick={run}>
          Run attack scenario
        </button>
      </div>

      {result && (
        <div className="rn-card rn-mt">
          <div className="rn-card-title">{result === "saw" ? "You saw signals" : "Blind spot"}</div>
          <div className="rn-card-body">
            {result === "saw"
              ? "Because access or database logs were enabled, you saw the suspicious sequence."
              : "With only auth logs, the lateral move and data access were invisible. Logging is about coverage, not volume."}
          </div>
        </div>
      )}
    </div>
  );
}
