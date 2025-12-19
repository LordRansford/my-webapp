"use client";

import React from "react";

type PreviewToggleProps = {
  mode: "edit" | "preview";
  onChange: (mode: "edit" | "preview") => void;
};

export function PreviewToggle({ mode, onChange }: PreviewToggleProps) {
  const isPreview = mode === "preview";
  return (
    <div className="preview-toggle" role="group" aria-label="Toggle preview mode">
      <button
        type="button"
        className={`preview-toggle__button ${!isPreview ? "preview-toggle__button--active" : ""}`}
        aria-pressed={!isPreview}
        onClick={() => onChange("edit")}
      >
        Edit mode
      </button>
      <button
        type="button"
        className={`preview-toggle__button ${isPreview ? "preview-toggle__button--active" : ""}`}
        aria-pressed={isPreview}
        onClick={() => onChange("preview")}
      >
        Preview mode
      </button>
    </div>
  );
}
