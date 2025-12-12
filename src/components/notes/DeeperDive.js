"use client";

export function DeeperDive({ title, children }) {
  return (
    <div className="panel stack">
      <div className="panel__header">
        <p className="eyebrow">Deeper dive</p>
        {title && <h3 style={{ margin: 0 }}>{title}</h3>}
      </div>
      <div className="muted" style={{ display: "grid", gap: "0.6rem" }}>
        {children}
      </div>
    </div>
  );
}
