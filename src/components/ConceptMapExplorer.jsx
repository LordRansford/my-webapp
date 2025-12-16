"use client";

import { useEffect, useState } from "react";

export default function ConceptMapExplorer({ storageKey, nodes }) {
  const [openId, setOpenId] = useState(nodes?.[0]?.id ?? null);

  useEffect(() => {
    if (!storageKey) return;
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed?.openId) setOpenId(parsed.openId);
      } catch (e) {
        // ignore
      }
    }
  }, [storageKey]);

  useEffect(() => {
    if (!storageKey) return;
    localStorage.setItem(storageKey, JSON.stringify({ openId }));
  }, [openId, storageKey]);

  return (
    <div className="rn-card rn-mt">
      <div className="rn-grid rn-grid-3">
        {(nodes || []).map((n) => (
          <button
            key={n.id}
            className={`rn-pick ${openId === n.id ? "rn-pick-active" : ""}`}
            onClick={() => setOpenId(n.id)}
            aria-pressed={openId === n.id}
          >
            <div className="rn-pick-title">{n.title}</div>
            <div className="rn-pick-sub">Tap to focus</div>
          </button>
        ))}
      </div>
      <div className="rn-card rn-mt">
        <div className="rn-card-title">{(nodes.find((n) => n.id === openId) || nodes[0])?.title}</div>
        <div className="rn-card-body">
          {(nodes.find((n) => n.id === openId) || nodes[0])?.body}
        </div>
      </div>
    </div>
  );
}
