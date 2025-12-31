"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, TrendingUp } from "lucide-react";
import SecureErrorBoundary from "@/components/studios/SecureErrorBoundary";
import StudioNavigation from "@/components/studios/StudioNavigation";
import HelpTooltip from "@/components/studios/HelpTooltip";
import CreditEstimate from "@/components/studios/CreditEstimate";

export default function PerformancePage() {
  return (
    <SecureErrorBoundary studio="dev-studio">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
          <header className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Link
                  href="/dev-studio"
                  className="text-slate-600 hover:text-slate-900 transition-colors"
                  aria-label="Back to Dev Studio"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Performance Profiler</h1>
                  <p className="text-base sm:text-lg text-slate-600 mt-1">
                    Load testing and performance analysis
                  </p>
                </div>
                <HelpTooltip
                  title="Performance Profiler"
                  content={
                    <div className="space-y-4">
                      <p>
                        The Performance Profiler measures how fast your application runs and identifies 
                        parts that are slow. It helps you make your application faster.
                      </p>
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-2">Features:</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                          <li>Run performance tests</li>
                          <li>Identify bottlenecks</li>
                          <li>Analyze load times</li>
                          <li>Generate performance reports</li>
                        </ul>
                      </div>
                    </div>
                  }
                />
              </div>
              <StudioNavigation studioType="dev" showHub={true} />
            </div>
          </header>

          <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
            {/* Credit Estimate */}
            <div className="mb-6">
              <CreditEstimate toolId="dev-studio-performance" />
            </div>


            <div className="text-center py-12">
              <TrendingUp className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">Performance Profiler</h2>
              <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
                This tool is currently under development. It will allow you to test and analyze 
                application performance with load testing capabilities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/dev-studio"
                  className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Back to Dev Studio
                </Link>
                <Link
                  href="/dev-studios"
                  className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 rounded-lg font-semibold transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SecureErrorBoundary>
  );
}
