"use client";

import React from "react";
import { useRouter } from "next/router";
import SecureErrorBoundary from "@/components/studios/SecureErrorBoundary";
import { MarketingPageTemplate } from "@/components/templates/PageTemplates";
import StudioHelpAssistant from "@/components/studios/help/StudioHelpAssistant";

export default function HelpPage() {
  const router = useRouter();
  const studio = typeof router.query?.studio === "string" ? router.query.studio : "lab";

  return (
    <SecureErrorBoundary studio="help">
      <MarketingPageTemplate breadcrumbs={[{ label: "Home", href: "/" }, { label: "Help" }]}>
        <div className="space-y-6">
          <header className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Help</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Studios help (Professor Ransford)</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-700">
              Ask for guidance that stays inside the selected studio, and generate copy‑paste examples you can save to a file and upload.
            </p>
          </header>

          <StudioHelpAssistant initialStudio={studio} />
        </div>
      </MarketingPageTemplate>
    </SecureErrorBoundary>
  );
}

