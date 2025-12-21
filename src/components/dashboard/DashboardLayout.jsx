"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardTabs from "./DashboardTabs";
import DashboardHero from "./DashboardHero";
import { useSession } from "next-auth/react";

function useScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        const el = document.documentElement;
        const scrollTop = el.scrollTop || document.body.scrollTop;
        const scrollHeight = el.scrollHeight || document.body.scrollHeight;
        const clientHeight = el.clientHeight || window.innerHeight;
        const denom = Math.max(1, scrollHeight - clientHeight);
        const next = Math.min(1, Math.max(0, scrollTop / denom));
        setP((prev) => (Math.abs(prev - next) < 0.01 ? prev : next));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  return p;
}

export default function DashboardLayout({ title, subtitle, tabs, children }) {
  const progress = useScrollProgress();
  const [activeTab, setActiveTab] = useState(tabs?.[0]?.id || "overview");
  const { data: session } = useSession();
  const [plan, setPlan] = useState("free");

  useEffect(() => {
    if (!session?.user?.id) return;
    fetch("/api/billing/summary")
      .then((r) => r.json())
      .then((d) => setPlan(d?.plan || "free"))
      .catch(() => setPlan("free"));
  }, [session?.user?.id]);

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
        badge={plan === "supporter" ? "Supporter" : plan === "pro" ? "Professional" : null}
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
