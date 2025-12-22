"use client";

import Link from "next/link";
import { useMemo } from "react";
import AccessGate from "@/components/AccessGate";

export function TemplateCard({ template, isFavorite, onToggleFavorite, onDownload }) {
  const timeLabel = useMemo(() => `${template.estimatedMinutes} min`, [template.estimatedMinutes]);
  const tierLabel =
    template.gatingLevel === "permission"
      ? "Commercial use"
      : template.gatingLevel === "donation"
      ? "Supporter"
      : "Free";

  return (
    <article
      className="card"
      aria-labelledby={`${template.id}-title`}
    >
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow m-0">{template.category}</p>
          <h3 id={`${template.id}-title`} className="mt-1 text-lg font-semibold leading-snug text-slate-900">
            {template.title}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-slate-700">{template.description}</p>
        </div>
        <button
          type="button"
          onClick={() => onToggleFavorite?.(template.id)}
          aria-pressed={isFavorite}
          className="pill"
          style={{ cursor: "pointer", minWidth: "6rem", background: isFavorite ? "rgba(0, 122, 255, 0.12)" : undefined }}
        >
          {isFavorite ? "Favourited" : "Favourite"}
        </button>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <span className="pill" aria-label={`Difficulty ${template.difficulty}`}>
          {template.difficulty}
        </span>
        <span className="pill" aria-label={`Estimated time ${timeLabel}`}>
          {timeLabel}
        </span>
        <span className="pill" aria-label={`Safety class ${template.safetyClass}`}>
          {template.safetyClass}
        </span>
        <span className="pill" aria-label={`Access tier ${tierLabel}`}>
          {tierLabel}
        </span>
        {template.tags?.slice(0, 4).map((tag) => (
          <span key={tag} className="chip">
            {tag}
          </span>
        ))}
      </div>

      <footer className="flex flex-wrap items-center gap-3 pt-1">
        <Link className="button primary" href={template.route}>
          Open tool
        </Link>
        {template.gatingLevel && template.gatingLevel !== "none" ? (
          <AccessGate
            requiredLevel="supporter"
            fallbackMessage="Supporters can download templates and keep them for planning."
          >
            <button
              type="button"
              onClick={() => onDownload?.(template)}
              className="button ghost"
            >
              Download options
            </button>
          </AccessGate>
        ) : (
          <button
            type="button"
            onClick={() => onDownload?.(template)}
            className="button ghost"
          >
            Download options
          </button>
        )}
        <div aria-label="Export formats" className="text-sm text-slate-600">
          <span className="font-semibold text-slate-800">Exports:</span> {template.exportFormatsSupported?.join(", ")}
        </div>
      </footer>
    </article>
  );
}
