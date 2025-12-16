"use client";

import { useState } from "react";

function log(storageKey, event) {
  const raw = localStorage.getItem(storageKey);
  const parsed = raw ? JSON.parse(raw) : { events: [] };
  parsed.events = Array.isArray(parsed.events) ? parsed.events : [];
  parsed.events.push({ ...event, at: Date.now() });
  localStorage.setItem(storageKey, JSON.stringify(parsed));
}

const scenarios = [
  {
    id: "secrets",
    title: "Storing secrets",
    prompt: "You need to store an API key at rest.",
    options: [
      { id: "hash", label: "Hash it", result: "fail", why: "Hashing is one way; you cannot retrieve the key later." },
      { id: "encrypt", label: "Encrypt it", result: "pass", why: "Use authenticated encryption with key management." },
      { id: "sign", label: "Sign it", result: "fail", why: "Signing does not provide confidentiality." },
    ],
  },
];

export default function CryptoMisuseSimulator({ storageKey }) {
  const [picked, setPicked] = useState(null);
  const s = scenarios[0];

  const choose = (opt) => {
    setPicked(opt);
    log(storageKey, { type: "crypto_choice", id: s.id, choice: opt.id, result: opt.result });
  };

  return (
    <div className="rn-tool">
      <div className="rn-tool-head">
        <div className="rn-tool-title">{s.title}</div>
        <div className="rn-tool-sub">{s.prompt}</div>
      </div>
      <div className="rn-grid rn-grid-3">
        {s.options.map((opt) => (
          <button key={opt.id} className={`rn-choice ${picked?.id === opt.id ? "rn-choice-active" : ""}`} onClick={() => choose(opt)}>
            <div className="rn-choice-title">{opt.label}</div>
            <div className="rn-choice-body">Tap to choose</div>
          </button>
        ))}
      </div>
      {picked && (
        <div className="rn-card rn-mt">
          <div className="rn-card-title">{picked.result === "pass" ? "Correct" : "Why this fails"}</div>
          <div className="rn-card-body">{picked.why}</div>
        </div>
      )}
    </div>
  );
}
