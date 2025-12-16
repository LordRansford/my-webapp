"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardTabs from "./DashboardTabs";
import DashboardHero from "./DashboardHero";

function useScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrollTop = el.scrollTop || document.body.scrollTop;
      const scrollHeight = el.scrollHeight || document.body.scrollHeight;
      const clientHeight = el.clientHeight || window.innerHeight;
      const denom = Math.max(1, scrollHeight - clientHeight);
      setP(Math.min(1, Math.max(0, scrollTop / denom)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return p;
}

export default function DashboardLayout({ title, subtitle, tabs, children }) {
  const progress = useScrollProgress();
  const [activeTab, setActiveTab] = useState(tabs?.[0]?.id || "overview");

  const jump = (id) => {
    setActiveTab(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const progressPct = useMemo(() => `${Math.round(progress * 100)}%`, [progress]);

  return (
    <div className="rn-dashboard">
      <div className="rn-dashboard-progress" aria-hidden="true">
        <div className="rn-dashboard-progress-bar" style={{ width: progressPct }} />
      </div>

      <DashboardHero
        title={title}
        subtitle={subtitle}
        note="Tip: Use the query panel to test a specific idea. If the chart surprises you, that is usually the learning edge."
      />

      <DashboardTabs tabs={tabs} activeId={activeTab} onJump={jump} />

      <div className="rn-dashboard-content">{children}</div>

      <div className="rn-dashboard-footer">
        <a className="rn-link" href="#top">
          Top
        </a>
      </div>
    </div>
  );
}
