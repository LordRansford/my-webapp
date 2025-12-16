"use client";

export default function DashboardTabs({ tabs, activeId, onJump }) {
  return (
    <nav className="rn-tabs" aria-label="Dashboard sections">
      <div className="rn-tabs-inner">
        {tabs.map((t) => (
          <button
            key={t.id}
            className={`rn-tab ${activeId === t.id ? "rn-tab-active" : ""}`}
            onClick={() => onJump(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
