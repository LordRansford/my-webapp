"use client";

import { useMemo, useState } from "react";

function log(storageKey, event) {
  const raw = localStorage.getItem(storageKey);
  const parsed = raw ? JSON.parse(raw) : { events: [] };
  parsed.events = Array.isArray(parsed.events) ? parsed.events : [];
  parsed.events.push({ ...event, at: Date.now() });
  localStorage.setItem(storageKey, JSON.stringify(parsed));
}

export default function HallucinationTrustGame({ storageKey }) {
  const prompt = useMemo(
    () => ({
      q: "A colleague asks: Is it safe to store API keys in the frontend if the site uses HTTPS?",
      modelAnswer: "Yes, HTTPS encrypts traffic, so storing keys in the frontend is safe as long as you use HTTPS and rotate keys regularly.",
      truth: "No. Frontend code is visible to users. HTTPS protects transmission, not exposure. Secrets must be kept server side.",
    }),
    []
  );

  const [decision, setDecision] = useState(null);

  const act = (d) => {
    const correct = d === "verify";
    setDecision({ d, correct });
    log(storageKey, { type: "hallucination_decision", decision: d, correct });
  };

  return (
    <div className="rn-tool">
      <div className="rn-tool-head">
        <div className="rn-tool-title">The confident answer</div>
        <div className="rn-tool-sub">You get a fluent answer. Decide what you do next.</div>
      </div>

      <div className="rn-card">
        <div className="rn-card-title">Question</div>
        <div className="rn-card-body">{prompt.q}</div>
      </div>

      <div className="rn-card rn-mt">
        <div className="rn-card-title">Model answer</div>
        <div className="rn-card-body">{prompt.modelAnswer}</div>
      </div>

      <div className="rn-actions rn-mt">
        <button className="rn-btn" onClick={() => act("trust")} disabled={!!decision}>
          Trust and proceed
        </button>
        <button className="rn-btn rn-btn-primary" onClick={() => act("verify")} disabled={!!decision}>
          Verify before acting
        </button>
      </div>

      {decision && (
        <div className="rn-card rn-mt">
          <div className="rn-card-title">{decision.correct ? "Good instinct" : "This is the trap"}</div>
          <div className="rn-card-body">
            {decision.correct
              ? "Fluency is not reliability. Verification is the habit that prevents confident mistakes becoming security incidents."
              : "HTTPS protects data in transit, not secrets in code. Frontend secrets are exposed by design, no matter how encrypted the connection is."}
          </div>
          <div className="rn-mini rn-mt">
            <div className="rn-mini-title">Correct framing</div>
            <div className="rn-mini-body">{prompt.truth}</div>
          </div>
        </div>
      )}
    </div>
  );
}
