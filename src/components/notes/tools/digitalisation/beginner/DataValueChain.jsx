"use client";

import { useState } from "react";

const STEPS = [
  { key: "collect", label: "Collect", note: "How data is captured and validated." },
  { key: "store", label: "Store", note: "Where data lives and how it is governed." },
  { key: "transform", label: "Transform", note: "How data is cleaned and prepared." },
  { key: "analyze", label: "Analyse", note: "How data is used to generate insight." },
  { key: "act", label: "Act", note: "How insight changes decisions or services." },
];

export default function DataValueChain() {
  const [selected, setSelected] = useState("collect");

  return (
    <div className="rn-tool">
      <div className="rn-tool-head">
        <div className="rn-tool-title">Data value chain mapper</div>
        <div className="rn-tool-sub">Tap a step to see where value is added and where risk appears.</div>
      </div>

      <div className="rn-grid rn-grid-5 rn-mt">
        {STEPS.map((s) => (
          <button
            key={s.key}
            className={`rn-choice ${selected === s.key ? "rn-choice-active" : ""}`}
            onClick={() => setSelected(s.key)}
          >
            <div className="rn-choice-title">{s.label}</div>
            <div className="rn-choice-body text-xs text-gray-700">{s.note}</div>
          </button>
        ))}
      </div>

      <div className="rn-card rn-mt">
        <div className="rn-card-title">What to notice</div>
        <div className="rn-card-body">
          {selected === "collect" && "If data is wrong at collection, every downstream step amplifies the error."}
          {selected === "store" && "Storage without ownership and governance turns data into liability."}
          {selected === "transform" && "Transformations hide assumptions. Document them and make them testable."}
          {selected === "analyze" && "Insight depends on quality and context. Avoid vanity metrics."}
          {selected === "act" && "If insights never change decisions or services, the chain is broken at the end."}
        </div>
      </div>
    </div>
  );
}
