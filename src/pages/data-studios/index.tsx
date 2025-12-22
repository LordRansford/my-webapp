"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import DataStrategyLab from "./sections/DataStrategyLab";
import DataArchitectureLab from "./sections/DataArchitectureLab";
import DataGovernanceLab from "./sections/DataGovernanceLab";
import DataQualityLab from "./sections/DataQualityLab";
import AnalyticsInsightLab from "./sections/AnalyticsInsightLab";
import DataEthicsLab from "./sections/DataEthicsLab";
import DigitalisationRoadmapLab from "./sections/DigitalisationRoadmapLab";
import DataStudioReflection from "./sections/DataStudioReflection";

const tabs = [
  { id: "overview", label: "Overview", component: DataStrategyLab },
  { id: "strategy", label: "Data strategy and purpose", component: DataStrategyLab },
  { id: "architecture", label: "Data architecture", component: DataArchitectureLab },
  { id: "governance", label: "Data governance and management", component: DataGovernanceLab },
  { id: "quality", label: "Data quality and assurance", component: DataQualityLab },
  { id: "analytics", label: "Analytics and insight", component: AnalyticsInsightLab },
  { id: "ethics", label: "Ethical and responsible data use", component: DataEthicsLab },
  { id: "roadmap", label: "Digitalisation maturity and roadmap", component: DigitalisationRoadmapLab },
  { id: "reflection", label: "Reflection and next steps", component: DataStudioReflection },
];

function chip(active: boolean) {
  return `rounded-full border px-3 py-1.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 ${
    active ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
  }`;
}

export default function DataStudiosPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const ActiveComp = useMemo(() => tabs.find((t) => t.id === activeTab)?.component || DataStrategyLab, [activeTab]);

  return (
    <div className="page-content max-w-6xl mx-auto space-y-8">
      <header className="rounded-3xl bg-gradient-to-br from-slate-50 via-amber-50/60 to-slate-50 ring-1 ring-slate-100 px-6 py-6 sm:px-8 sm:py-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)] space-y-3">
        <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 text-white px-3 py-1 text-xs font-semibold">
          Studio
          <span aria-hidden="true">•</span> Data and Digitalisation
        </div>
        <h1 className="text-3xl font-semibold text-slate-900">Data and Digitalisation Studio</h1>
        <p className="text-base text-slate-700 max-w-3xl leading-relaxed">
          This studio is about decision quality, trust, and scale. We use a governance-led lens so that data supports real outcomes rather than becoming a costly hobby.
        </p>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Link href="/data" className="font-semibold text-emerald-700 hover:underline">
            Back to data course
          </Link>
          <span className="text-slate-300" aria-hidden="true">
            |
          </span>
          <Link href="/digitalisation" className="font-semibold text-emerald-700 hover:underline">
            Back to digitalisation notes
          </Link>
        </div>
      </header>

      <nav aria-label="Data and Digitalisation Studio navigation" className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button key={t.id} type="button" className={chip(activeTab === t.id)} onClick={() => setActiveTab(t.id)}>
            {t.label}
          </button>
        ))}
      </nav>

      <section aria-label="Active lab" className="space-y-3">
        <ActiveComp />
      </section>
    </div>
  );
}



