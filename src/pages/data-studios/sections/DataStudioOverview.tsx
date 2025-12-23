"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, Compass, ShieldCheck, BarChart3, CheckCircle2, Boxes, HandHeart, ArrowUpRight } from "lucide-react";

const sections = [
  {
    id: "strategy",
    title: "Data strategy and purpose",
    icon: Compass,
    summary: "Define outcomes, decisions, and stop rules so data collection is defensible and focused.",
  },
  {
    id: "architecture",
    title: "Data architecture",
    icon: Boxes,
    summary: "Separate operational and analytical needs, make integration choices explicit, and understand trade-offs.",
  },
  {
    id: "governance",
    title: "Data governance and management",
    icon: ShieldCheck,
    summary: "Clarify ownership, stewardship, policies, metadata, lineage, and access control principles.",
  },
  {
    id: "quality",
    title: "Data quality and assurance",
    icon: CheckCircle2,
    summary: "Place controls at the right boundary, monitor drift, and quantify the cost of poor quality.",
  },
  {
    id: "analytics",
    title: "Analytics and insight",
    icon: BarChart3,
    summary: "Design KPIs with denominators, stable definitions, and a named decision owner with actions.",
  },
  {
    id: "ethics",
    title: "Ethical and responsible data use",
    icon: HandHeart,
    summary: "Privacy by design, transparency, bias checks, and human oversight for high impact decisions.",
  },
  {
    id: "roadmap",
    title: "Digitalisation maturity and roadmap",
    icon: BookOpen,
    summary: "Assess maturity, identify capability gaps, and prioritise improvements without technology-first thinking.",
  },
];

export default function DataStudioOverview() {
  return (
    <section className="space-y-6" aria-label="Data and Digitalisation Studio overview">
      <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
        <p className="text-sm font-semibold text-slate-900">Overview</p>
        <p className="text-sm text-slate-700">
          This studio is a governance-led walkthrough of real world data practice. The focus is decision quality, trust, and scale, not collecting data for its own sake.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <p className="text-sm font-semibold text-slate-900">How to use this</p>
            <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 space-y-1">
              <li>Start with strategy so purpose is explicit before architecture choices.</li>
              <li>Use governance and quality labs to make ownership and controls real.</li>
              <li>Use analytics to turn data into actions, not just charts.</li>
              <li>Use ethics to keep trust, especially for high impact uses.</li>
              <li>Use the roadmap lab to plan small, governed improvements.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <p className="text-sm font-semibold text-slate-900">Compute and credits</p>
            <p className="mt-2 text-sm text-slate-700">
              Most of this studio is lightweight and runs in your browser. If a section uses compute, it will only run when you click a button and it will show an
              estimate and a short summary of what was consumed.
            </p>
            <p className="mt-2 text-sm text-slate-700">No user data is ingested. These are teaching tools and structured thinking aids.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.id} className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-2">
              <div className="flex items-center gap-2">
                <Icon className="h-5 w-5 text-slate-700" aria-hidden="true" />
                <p className="text-base font-semibold text-slate-900">{s.title}</p>
              </div>
              <p className="text-sm text-slate-700">{s.summary}</p>
              <p className="text-xs text-slate-600">Open this section using the tabs above.</p>
            </div>
          );
        })}
      </div>

      <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
        <p className="text-sm font-semibold text-slate-900">Exit routes</p>
        <div className="flex flex-col gap-2">
          <Link href="/courses" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:underline">
            Courses <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link href="/data" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:underline">
            Data course <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link href="/digitalisation" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:underline">
            Digitalisation notes <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}


