"use client";

import React from "react";
import Link from "next/link";
import SecureErrorBoundary from "@/components/studios/SecureErrorBoundary";
import StudioNavigation from "@/components/studios/StudioNavigation";
import { StudioBreadcrumbs } from "@/components/studios/StudioBreadcrumbs";
import ComplianceSettings from "@/components/studios/ComplianceSettings";

export default function CyberStudioSettingsPage() {
  return (
    <SecureErrorBoundary studio="cyber-studio-settings">
      <div className="mx-auto w-full max-w-5xl px-4 py-6 space-y-6 sm:px-6 sm:py-8 md:space-y-8">
        <div className="space-y-3">
          <StudioBreadcrumbs
            items={[{ label: "Studios Hub", href: "/studios/hub" }, { label: "Cyber Studio", href: "/cyber-studio" }, { label: "Settings" }]}
          />
          <StudioNavigation studioType="cyber" showHub={true} showHome={true} currentStudio="Cyber Studio" currentStudioHref="/cyber-studio" />
        </div>

        <header className="rounded-3xl bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 space-y-2">
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">Cyber Studio settings</h1>
          <p className="text-sm text-slate-700 max-w-3xl">
            Privacy and governance controls for security workflows. Keep demos safe and avoid targeting private or internal systems.
          </p>
          <p className="text-xs text-slate-600">
            Need a tailored threat model file you can upload? Use{" "}
            <Link className="font-semibold text-primary-600 hover:underline" href="/help?studio=cyber">
              Help
            </Link>
            .
          </p>
        </header>

        <ComplianceSettings />

        <section className="rounded-3xl bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] ring-1 ring-slate-100/80 space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Safe usage reminders</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700">
            <li>Use public targets only. Do not scan private IPs, internal hosts, or systems without permission.</li>
            <li>Prefer sample data and toy examples when learning.</li>
            <li>Export your audit trail before clearing data.</li>
          </ul>
        </section>
      </div>
    </SecureErrorBoundary>
  );
}

