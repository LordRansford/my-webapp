"use client";

import Link from "next/link";
import { useMemo } from "react";

export function TemplateCard({ template, isFavorite, onToggleFavorite, onDownload }) {
  const timeLabel = useMemo(() => `${template.estimatedMinutes} min`, [template.estimatedMinutes]);

  return (
    <article
      className="card"
      style={{
        display: "grid",
        gap: "0.65rem",
        border: "1px solid #e2e8f0",
        borderRadius: "18px",
        padding: "1rem",
        background: "#fff",
        boxShadow: "0 14px 28px rgba(15,23,42,0.06)",
      }}
      aria-labelledby={`${template.id}-title`}
    >
      <header className="flex-between" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
        <div>
          <p className="eyebrow" style={{ margin: 0, color: "#64748b" }}>
            {template.category}
          </p>
          <h3 id={`${template.id}-title`} style={{ margin: "0.1rem 0", fontSize: "1.05rem" }}>
            {template.title}
          </h3>
          <p className="muted" style={{ margin: "0.15rem 0 0.35rem" }}>
            {template.description}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onToggleFavorite?.(template.id)}
          aria-pressed={isFavorite}
          className="pill"
          style={{
            border: "1px solid #cbd5e1",
            background: isFavorite ? "#0ea5e9" : "#fff",
            color: isFavorite ? "#fff" : "#0f172a",
            cursor: "pointer",
            padding: "0.35rem 0.7rem",
            borderRadius: "999px",
            fontWeight: 600,
            minWidth: "6rem",
          }}
        >
          {isFavorite ? "Favourited" : "Favourite"}
        </button>
      </header>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", alignItems: "center" }}>
        <span className="pill" aria-label={`Difficulty ${template.difficulty}`}>
          {template.difficulty}
        </span>
        <span className="pill" aria-label={`Estimated time ${timeLabel}`}>
          {timeLabel}
        </span>
        <span className="pill" aria-label={`Safety class ${template.safetyClass}`}>
          {template.safetyClass}
        </span>
        <span className="pill" aria-label={`Gating level ${template.gatingLevel}`}>
          {template.gatingLevel}
        </span>
        {template.tags?.slice(0, 4).map((tag) => (
          <span key={tag} className="badge" style={{ background: "#f1f5f9", color: "#0f172a" }}>
            {tag}
          </span>
        ))}
      </div>

      <footer style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "center" }}>
        <Link className="button primary" href={template.route}>
          Open tool
        </Link>
        <button
          type="button"
          onClick={() => onDownload?.(template)}
          className="button"
          style={{ borderRadius: "14px", border: "1px solid #e2e8f0", padding: "0.45rem 0.9rem", fontWeight: 600 }}
        >
          Download options
        </button>
        <div aria-label="Export formats" className="muted" style={{ display: "flex", gap: "0.35rem", alignItems: "center" }}>
          <strong>Exports:</strong>
          <span>{template.exportFormatsSupported?.join(", ")}</span>
        </div>
      </footer>
    </article>
  );
}
