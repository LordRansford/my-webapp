// Re-exported in file itself; kept for import stability.
"use client";

const TABS = [
  { id: "context", label: "Context" },
  { id: "container", label: "Container" },
  { id: "deployment", label: "Deployment" },
  { id: "dfd", label: "Data Flow" },
  { id: "sequence", label: "Sequence" },
];

export function DiagramTabs({ activeId, onChange }) {
  return (
    <div className="rn-tabs" aria-label="Diagram tabs">
      <div className="rn-tabs-inner" role="tablist" aria-label="Diagram type">
        {TABS.map((t) => {
          const active = t.id === activeId;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active}
              className={`rn-tab ${active ? "rn-tab-active" : ""}`}
              onClick={() => onChange(t.id)}
            >
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export const DIAGRAM_TABS = TABS;


