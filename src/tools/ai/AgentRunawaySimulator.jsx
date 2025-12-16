"use client";

import { useMemo, useState } from "react";

function log(storageKey, event) {
  const raw = localStorage.getItem(storageKey);
  const parsed = raw ? JSON.parse(raw) : { events: [] };
  parsed.events = Array.isArray(parsed.events) ? parsed.events : [];
  parsed.events.push({ ...event, at: Date.now() });
  localStorage.setItem(storageKey, JSON.stringify(parsed));
}

export default function AgentRunawaySimulator({ storageKey }) {
  const scenarios = useMemo(
    () => [
      {
        id: "cleanup",
        title: "Infrastructure clean up",
        goal: "Remove unused resources safely.",
        steps: [
          { ok: true, text: "Agent lists resources and tags likely unused items." },
          { ok: true, text: "Agent selects a subset for review based on age and last access." },
          { ok: false, text: "Agent deletes a shared resource that looked unused but was a dependency." },
          { ok: false, text: "Failures cascade and monitoring alerts spike." },
        ],
      },
    ],
    []
  );

  const [policy, setPolicy] = useState("cautious");
  const [run, setRun] = useState(false);
  const s = scenarios[0];

  const start = () => {
    setRun(true);
    const outcome = policy === "aggressive" ? "runaway" : "contained";
    log(storageKey, { type: "agent_run", outcome });
  };

  const visibleSteps = run
    ? policy === "aggressive"
      ? s.steps
      : s.steps.map((x, i) => (i < 2 ? x : { ok: true, text: "Agent stops and asks for human confirmation before acting." }))
    : [];

  return (
    <div className="rn-tool">
      <div className="rn-tool-head">
        <div className="rn-tool-title">{s.title}</div>
        <div className="rn-tool-sub">Choose an operating policy. Then run the agent. Notice how repeated actions amplify small mistakes.</div>
      </div>

      <div className="rn-grid rn-grid-2">
        <button className={`rn-choice ${policy === "cautious" ? "rn-choice-active" : ""}`} onClick={() => setPolicy("cautious")} disabled={run}>
          <div className="rn-choice-title">Cautious</div>
          <div className="rn-choice-body">Stops for confirmation on destructive actions.</div>
        </button>
        <button className={`rn-choice ${policy === "aggressive" ? "rn-choice-active" : ""}`} onClick={() => setPolicy("aggressive")} disabled={run}>
          <div className="rn-choice-title">Aggressive</div>
          <div className="rn-choice-body">Acts quickly with minimal confirmation.</div>
        </button>
      </div>

      <div className="rn-actions rn-mt">
        <button className="rn-btn rn-btn-primary" onClick={start} disabled={run}>
          Run agent
        </button>
      </div>

      {run && (
        <div className="rn-card rn-mt">
          <div className="rn-card-title">Agent trace</div>
          <div className="rn-trace rn-mt">
            {visibleSteps.map((st, i) => (
              <div key={i} className={`rn-trace-step ${st.ok ? "ok" : "bad"}`}>
                {st.text}
              </div>
            ))}
          </div>
          <div className="rn-card-body rn-mt">
            The key idea is compounding. Even a small misread becomes serious when the system can act repeatedly without strong stop conditions.
          </div>
        </div>
      )}
    </div>
  );
}
