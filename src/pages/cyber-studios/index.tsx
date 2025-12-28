"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import ThreatLandscapeLab from "./sections/ThreatLandscapeLab";
import RiskFundamentalsLab from "./sections/RiskFundamentalsLab";
import SecurityArchitectureLab from "./sections/SecurityArchitectureLab";
import DefensiveControlsLab from "./sections/DefensiveControlsLab";
import IamLab from "./sections/IamLab";
import AppDataSecurityLab from "./sections/AppDataSecurityLab";
import DetectionResponseLab from "./sections/DetectionResponseLab";
import ResilienceRecoveryLab from "./sections/ResilienceRecoveryLab";
import CyberGovernanceLab from "./sections/CyberGovernanceLab";
import CyberReflection from "./sections/CyberReflection";
import StudioTabs from "@/components/studios/StudioTabs";

const tabs = [
  { id: "overview", label: "Overview", component: ThreatLandscapeLab },
  { id: "threats", label: "Threat landscape", component: ThreatLandscapeLab },
  { id: "risk", label: "Risk management fundamentals", component: RiskFundamentalsLab },
  { id: "architecture", label: "Security architecture", component: SecurityArchitectureLab },
  { id: "controls", label: "Defensive controls", component: DefensiveControlsLab },
  { id: "iam", label: "Identity and access", component: IamLab },
  { id: "app-data", label: "Application and data security", component: AppDataSecurityLab },
  { id: "detect-respond", label: "Detection and response", component: DetectionResponseLab },
  { id: "resilience", label: "Resilience and recovery", component: ResilienceRecoveryLab },
  { id: "governance", label: "Governance and accountability", component: CyberGovernanceLab },
  { id: "reflection", label: "Reflection and next steps", component: CyberReflection },
];

export default function CyberStudiosPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const ActiveComp = useMemo(() => tabs.find((t) => t.id === activeTab)?.component || ThreatLandscapeLab, [activeTab]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 space-y-6 sm:px-6 sm:py-8 md:space-y-8">
      <header className="rounded-3xl bg-gradient-to-br from-slate-50 via-rose-50/60 to-slate-50 ring-1 ring-slate-100 px-4 py-5 sm:px-6 sm:py-6 md:px-8 md:py-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)] space-y-3">
        <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 text-white px-3 py-1 text-xs font-semibold">
          Studio
          <span aria-hidden="true" className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">Cybersecurity</span>
          <span className="sm:hidden">Cyber</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">Cybersecurity Studio</h1>
        <p className="text-sm sm:text-base text-slate-700 max-w-3xl leading-relaxed">
          This studio is risk-led. It focuses on resilience, controls, and decision quality. No hacking tricks, no fear. Just structured thinking you can use at work.
        </p>
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 text-xs sm:text-sm">
          <Link href="/cybersecurity" className="font-semibold text-emerald-700 hover:underline">
            Back to cybersecurity course
          </Link>
          <span className="hidden sm:inline text-slate-300" aria-hidden="true">
            |
          </span>
          <Link href="/dashboards/cybersecurity" className="font-semibold text-emerald-700 hover:underline">
            Cyber dashboards
          </Link>
        </div>
      </header>

      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <StudioTabs ariaLabel="Cybersecurity Studio sections" tabs={tabs} activeId={activeTab} onSelect={setActiveTab} />
      </div>

      <section id={`panel-${activeTab}`} role="tabpanel" aria-label={tabs.find((t) => t.id === activeTab)?.label} className="space-y-3">
        <ActiveComp />
      </section>
    </div>
  );
}



