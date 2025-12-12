"use client";

import { useState } from "react";

export default function ToolCard({ title, intent, predictPrompt, reflection, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="panel stack tool-card">
      <div className="tool-card__header">
        <div>
          <p className="eyebrow">Tool</p>
          <h3 style={{ margin: 0 }}>{title}</h3>
          {intent && <p className="muted">{intent}</p>}
          {predictPrompt && (
            <p className="muted">
              <strong>Prediction:</strong> {predictPrompt}
            </p>
          )}
        </div>
        <button type="button" className="button secondary" onClick={() => setOpen((v) => !v)}>
          {open ? "Hide tool" : "Open tool"}
        </button>
      </div>
      {open && (
        <div className="stack">
          {children}
          {reflection && (
            <div className="status">
              <div className="eyebrow">Reflection</div>
              <p className="muted">{reflection}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
