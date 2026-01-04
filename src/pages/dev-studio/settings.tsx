"use client";

import React from "react";
import Link from "next/link";
import SecureErrorBoundary from "@/components/studios/SecureErrorBoundary";
import StudioNavigation from "@/components/studios/StudioNavigation";
import { StudioBreadcrumbs } from "@/components/studios/StudioBreadcrumbs";
import ComplianceSettings from "@/components/studios/ComplianceSettings";

export default function DevStudioSettingsPage() {
  return (
    <SecureErrorBoundary studio="dev-studio-settings">
      <div className="mx-auto w-full max-w-5xl px-4 py-6 space-y-6 sm:px-6 sm:py-8 md:space-y-8">
        <div className="space-y-3">
          <StudioBreadcrumbs items={[{ label: "Studios Hub", href: "/studios/hub" }, { label: "Dev Studio", href: "/dev-studio" }, { label: "Settings" }]} />
          <StudioNavigation studioType="dev" showHub={true} showHome={true} currentStudio="Dev Studio" currentStudioHref="/dev-studio" />
        </div>

        <header className="rounded-3xl bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 space-y-2">
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">Dev Studio settings</h1>
          <p className="text-sm text-slate-700 max-w-3xl">
            Control privacy, retention, and safety preferences for the live studio. These settings affect this device.
          </p>
          <p className="text-xs text-slate-600">
            Need help building something real? Use the studio expert in{" "}
            <Link className="font-semibold text-primary-600 hover:underline" href="/help?studio=dev">
              Help
            </Link>
            .
          </p>
        </header>

        <ComplianceSettings />

        <section className="rounded-3xl bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Recommended defaults</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700">
            <li>
              Set retention to <strong>90 days</strong> unless you need longer for a project review cycle.
            </li>
            <li>
              Use <strong>Export</strong> before clearing data, so you have an auditable trail.
            </li>
            <li>
              Avoid pasting real secrets into demos (API keys, passwords, tokens).
            </li>
          </ul>
        </section>
      </div>
    </SecureErrorBoundary>
  );
}

