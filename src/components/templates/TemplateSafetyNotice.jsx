"use client";

export function TemplateSafetyNotice() {
  return (
    <div className="card" style={{ padding: "0.85rem", borderRadius: "14px", border: "1px solid #e2e8f0", background: "#f8fafc" }}>
      <p className="eyebrow" style={{ margin: 0 }}>
        Safety
      </p>
      <ul className="muted" style={{ margin: "0.35rem 0 0 1rem", padding: 0, display: "grid", gap: "0.25rem" }}>
        <li>No active scanning or network calls. Everything runs locally.</li>
        <li>Uploads stay in memory, never stored, and should stay under 5MB.</li>
        <li>Do not paste secrets or sensitive personal data.</li>
        <li>URL inputs are parsed as text only with a clear permission reminder.</li>
      </ul>
    </div>
  );
}
