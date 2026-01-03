"use client";

import React from "react";
import Link from "next/link";
import SecureErrorBoundary from "@/components/studios/SecureErrorBoundary";
import StudioNavigation from "@/components/studios/StudioNavigation";
import { StudioBreadcrumbs } from "@/components/studios/StudioBreadcrumbs";
import ComplianceSettings from "@/components/studios/ComplianceSettings";

export default function AIStudioSettingsPage() {
  return (
    <SecureErrorBoundary studio="ai-studio-settings">
      <div className="mx-auto w-full max-w-5xl px-4 py-6 space-y-6 sm:px-6 sm:py-8 md:space-y-8">
        <div className="space-y-3">
          <StudioBreadcrumbs items={[{ label: "Studios Hub", href: "/studios/hub" }, { label: "AI Studio", href: "/ai-studio" }, { label: "Settings" }]} />
          <StudioNavigation studioType="ai" showHub={true} showHome={true} currentStudio="AI Studio" currentStudioHref="/ai-studio" />
        </div>

        <header className="rounded-3xl bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 space-y-2">
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">AI Studio settings</h1>
          <p className="text-sm text-slate-700 max-w-3xl">
            Controls for privacy and governance when running local demos and compute runs. Keep prompts free of sensitive personal data.
          </p>
          <p className="text-xs text-slate-600">
            Need a project template you can import and tailor? Use{" "}
            <Link className="font-semibold text-primary-600 hover:underline" href="/help?studio=ai">
              Help
            </Link>
            .
          </p>
        </header>

        <ComplianceSettings />

        <section className="rounded-3xl bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Cost & safety tips</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700">
            <li>Use Local runs for quick iteration; switch to Compute for premium outputs.</li>
            <li>Keep one clear goal per run, then add detail gradually.</li>
            <li>Avoid private customer data in examples and prompts.</li>
          </ul>
        </section>
      </div>
    </SecureErrorBoundary>
  );
}

