"use client";

import { useState } from "react";

export default function StrategyRoadmapCanvas({ mode = "process" }) {
  const [shortTerm, setShortTerm] = useState("");
  const [midTerm, setMidTerm] = useState("");
  const [longTerm, setLongTerm] = useState("");

  return (
    <div className="rn-tool">
      <div className="rn-tool-head">
        <div className="rn-tool-title">Digital process canvas</div>
        <div className="rn-tool-sub">Sketch a simple roadmap across short, medium, and long term horizons.</div>
      </div>

      <div className="rn-grid rn-grid-3 rn-mt">
        <div className="rn-card space-y-2">
          <div className="rn-card-title">Short term</div>
          <textarea className="rn-input" value={shortTerm} onChange={(e) => setShortTerm(e.target.value)} placeholder="Visible wins, build trust" />
        </div>
        <div className="rn-card space-y-2">
          <div className="rn-card-title">Medium term</div>
          <textarea className="rn-input" value={midTerm} onChange={(e) => setMidTerm(e.target.value)} placeholder="Platforms, shared capabilities" />
        </div>
        <div className="rn-card space-y-2">
          <div className="rn-card-title">Long term</div>
          <textarea className="rn-input" value={longTerm} onChange={(e) => setLongTerm(e.target.value)} placeholder="Operating model, culture, funding" />
        </div>
      </div>

      <div className="rn-card rn-mt">
        <div className="rn-card-title">Reflection</div>
        <div className="rn-card-body">
          Digitalisation is a journey. Small wins build trust. Platforms and data foundations make the journey sustainable. Long term change aligns teams, funding, and governance with digital ways of working.
        </div>
      </div>
    </div>
  );
}
