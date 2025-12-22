import React from "react";

export type StudioTab = { id: string; label: string };

type Props = {
  tabs: StudioTab[];
  activeId: string;
  onSelect: (id: string) => void;
  ariaLabel: string;
};

export default function StudioTabs({ tabs, activeId, onSelect, ariaLabel }: Props) {
  return (
    <nav className="rn-tabs" aria-label={ariaLabel}>
      <div className="rn-tabs-inner" role="tablist" aria-label={ariaLabel}>
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={activeId === t.id}
            aria-controls={`panel-${t.id}`}
            className={`rn-tab ${activeId === t.id ? "rn-tab-active" : ""}`}
            onClick={() => onSelect(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
    </nav>
  );
}


