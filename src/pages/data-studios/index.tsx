"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import DataStudioOverview from "./sections/DataStudioOverview";
import DataStrategyLab from "./sections/DataStrategyLab";
import DataArchitectureLab from "./sections/DataArchitectureLab";
import DataGovernanceLab from "./sections/DataGovernanceLab";
import DataQualityLab from "./sections/DataQualityLab";
import AnalyticsInsightLab from "./sections/AnalyticsInsightLab";
import DataEthicsLab from "./sections/DataEthicsLab";
import DigitalisationRoadmapLab from "./sections/DigitalisationRoadmapLab";
import DataStudioReflection from "./sections/DataStudioReflection";
import StudioTabs from "@/components/studios/StudioTabs";

const tabs = [
  { id: "overview", label: "Overview", component: DataStudioOverview },
  { id: "strategy", label: "Data strategy and purpose", component: DataStrategyLab },
  { id: "architecture", label: "Data architecture", component: DataArchitectureLab },
  { id: "governance", label: "Data governance and management", component: DataGovernanceLab },
  { id: "quality", label: "Data quality and assurance", component: DataQualityLab },
  { id: "analytics", label: "Analytics and insight", component: AnalyticsInsightLab },
  { id: "ethics", label: "Ethical and responsible data use", component: DataEthicsLab },
  { id: "roadmap", label: "Digitalisation maturity and roadmap", component: DigitalisationRoadmapLab },
  { id: "reflection", label: "Reflection and next steps", component: DataStudioReflection },
];

export default function DataStudiosPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const ActiveComp = useMemo(() => tabs.find((t) => t.id === activeTab)?.component || DataStrategyLab, [activeTab]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 space-y-6 sm:px-6 sm:py-8 md:space-y-8">
      <header className="rounded-3xl bg-gradient-to-br from-slate-50 via-amber-50/60 to-slate-50 ring-1 ring-slate-100 px-4 py-5 sm:px-6 sm:py-6 md:px-8 md:py-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)] space-y-3">
        <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 text-white px-3 py-1 text-xs font-semibold">
          Studio
          <span aria-hidden="true" className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">Data and Digitalisation</span>
          <span className="sm:hidden">Data</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">Data and Digitalisation Studio</h1>
        <p className="text-sm sm:text-base text-slate-700 max-w-3xl leading-relaxed">
          This studio is about decision quality, trust, and scale. We use a governance-led lens so that data supports real outcomes rather than becoming a costly hobby.
        </p>
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 text-xs sm:text-sm">
          <Link href="/courses" className="font-semibold text-emerald-700 hover:underline">
            Back to courses
          </Link>
          <span className="hidden sm:inline text-slate-300" aria-hidden="true">
            |
          </span>
          <Link href="/data" className="font-semibold text-emerald-700 hover:underline">
            Back to data course
          </Link>
          <span className="hidden sm:inline text-slate-300" aria-hidden="true">
            |
          </span>
          <Link href="/digitalisation" className="font-semibold text-emerald-700 hover:underline">
            Back to digitalisation notes
          </Link>
        </div>
      </header>

      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <StudioTabs ariaLabel="Data and Digitalisation Studio sections" tabs={tabs} activeId={activeTab} onSelect={setActiveTab} />
      </div>

      <section id={`panel-${activeTab}`} role="tabpanel" aria-label={tabs.find((t) => t.id === activeTab)?.label} className="space-y-3">
        <ActiveComp />
      </section>
    </div>
  );
}



