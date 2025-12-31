"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import SecureErrorBoundary from "@/components/studios/SecureErrorBoundary";
import StudioNavigation from "@/components/studios/StudioNavigation";

export default function IRPlaybookPage() {
  return (
    <SecureErrorBoundary studio="cyber-studio">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/30 to-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
          <header className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Link href="/cyber-studio" className="text-slate-600 hover:text-slate-900 transition-colors" aria-label="Back to Cyber Studio">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-white">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Incident Response Playbook Builder</h1>
                  <p className="text-base sm:text-lg text-slate-600 mt-1">Create and test IR procedures</p>
                </div>
              </div>
              <StudioNavigation studioType="cyber" showHub={true} />
            </div>
          </header>
          <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">Incident Response Playbook Builder</h2>
              <p className="text-slate-600 mb-6 max-w-2xl mx-auto">This tool is currently under development.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/cyber-studio" className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors">Back to Cyber Studio</Link>
                <Link href="/cyber-studios" className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 rounded-lg font-semibold transition-colors">Learn More</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SecureErrorBoundary>
  );
}
