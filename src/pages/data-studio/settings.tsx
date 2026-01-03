"use client";

import React from "react";
import Link from "next/link";
import SecureErrorBoundary from "@/components/studios/SecureErrorBoundary";
import StudioNavigation from "@/components/studios/StudioNavigation";
import { StudioBreadcrumbs } from "@/components/studios/StudioBreadcrumbs";
import ComplianceSettings from "@/components/studios/ComplianceSettings";

export default function DataStudioSettingsPage() {
  return (
    <SecureErrorBoundary studio="data-studio-settings">
      <div className="mx-auto w-full max-w-5xl px-4 py-6 space-y-6 sm:px-6 sm:py-8 md:space-y-8">
        <div className="space-y-3">
          <StudioBreadcrumbs items={[{ label: "Studios Hub", href: "/studios/hub" }, { label: "Data Studio", href: "/data-studio" }, { label: "Settings" }]} />
          <StudioNavigation studioType="data" showHub={true} showHome={true} currentStudio="Data Studio" currentStudioHref="/data-studio" />
        </div>

        <header className="rounded-3xl bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 space-y-2">
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">Data Studio settings</h1>
          <p className="text-sm text-slate-700 max-w-3xl">
            Data governance and privacy controls. Use these to manage retention, exports, and safe handling of example datasets.
          </p>
          <p className="text-xs text-slate-600">
            Want a clean CSV + schema example tailored to your columns? Use{" "}
            <Link className="font-semibold text-primary-600 hover:underline" href="/help?studio=data">
              Help
            </Link>
            .
          </p>
        </header>

        <ComplianceSettings />

        <section className="rounded-3xl bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Recommended defaults</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700">
            <li>Keep example datasets synthetic where possible.</li>
            <li>Document your schema assumptions (types, nullability, IDs).</li>
            <li>Use shorter retention when prototyping with sensitive fields.</li>
          </ul>
        </section>
      </div>
    </SecureErrorBoundary>
  );
}

