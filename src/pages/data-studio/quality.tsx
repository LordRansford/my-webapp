"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Eye, HelpCircle, Play, CheckCircle2, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import SecureErrorBoundary from "@/components/studios/SecureErrorBoundary";
import StudioNavigation from "@/components/studios/StudioNavigation";
import HelpTooltip from "@/components/studios/HelpTooltip";
import CreditEstimate from "@/components/studios/CreditEstimate";

type QualityCheck = "completeness" | "accuracy" | "consistency" | "validity" | "timeliness";

interface DataQualityMonitor {
  dataSource: string; // URL or identifier
  qualityChecks: QualityCheck[];
  threshold?: number; // Quality threshold percentage
}

export default function QualityPage() {
  const [monitor, setMonitor] = useState<DataQualityMonitor>({
    dataSource: "",
    qualityChecks: ["completeness", "accuracy", "consistency"],
    threshold: 80,
  });
  const [monitoring, setMonitoring] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [qualityResult, setQualityResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleMonitor() {
    if (!monitor.dataSource.trim()) {
      setError("Please enter a data source");
      return;
    }

    setMonitoring(true);
    setError(null);
    setCompleted(false);

    try {
      const response = await fetch("/api/data-studio/quality/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toolId: "data-studio-quality",
          monitor,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Data quality monitoring failed");
      }

      setQualityResult(data);
      setCompleted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Data quality monitoring failed");
    } finally {
      setMonitoring(false);
    }
  }

  function handleReset() {
    setMonitor({
      dataSource: "",
      qualityChecks: ["completeness", "accuracy", "consistency"],
      threshold: 80,
    });
    setCompleted(false);
    setQualityResult(null);
    setError(null);
  }

  const qualityChecks = [
    { value: "completeness", label: "Completeness", description: "Check for missing values" },
    { value: "accuracy", label: "Accuracy", description: "Validate data accuracy" },
    { value: "consistency", label: "Consistency", description: "Check data consistency" },
    { value: "validity", label: "Validity", description: "Validate data format and rules" },
    { value: "timeliness", label: "Timeliness", description: "Check data freshness" },
  ];

  return (
    <SecureErrorBoundary studio="data-studio">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
          <header className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Link
                  href="/data-studio"
                  className="text-slate-600 hover:text-slate-900 transition-colors"
                  aria-label="Back to Data Studio"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                  <Eye className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Data Quality Monitor</h1>
                  <p className="text-base sm:text-lg text-slate-600 mt-1">Automated data quality checks and alerts</p>
                </div>
                <HelpTooltip
                  title="Data Quality Monitor"
                  content={
                    <div className="space-y-4">
                      <p>
                        The Data Quality Monitor checks if your data is complete, accurate, and reliable.
                      </p>
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-2">Features:</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                          <li>Check data completeness</li>
                          <li>Validate data accuracy</li>
                          <li>Monitor data consistency</li>
                          <li>Generate quality reports</li>
                        </ul>
                      </div>
                    </div>
                  }
                />
              </div>
              <StudioNavigation studioType="data" showHub={true} />
            </div>
          </header>

          <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
            {/* Credit Estimate */}
            <div className="mb-6">
              <CreditEstimate toolId="data-studio-quality" />
            </div>

            {error && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-red-900">Monitoring Error</p>
                    <p className="text-sm text-red-800 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {!completed ? (
              <div className="space-y-6">
                {/* Data Source */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Data Source</label>
                  <input
                    type="text"
                    value={monitor.dataSource}
                    onChange={(e) => setMonitor({ ...monitor, dataSource: e.target.value })}
                    placeholder="Database connection string, API endpoint, or file path"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Quality Checks */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Quality Checks</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {qualityChecks.map((check) => (
                      <label
                        key={check.value}
                        className="flex items-center gap-2 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={monitor.qualityChecks.includes(check.value as QualityCheck)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setMonitor({
                                ...monitor,
                                qualityChecks: [...monitor.qualityChecks, check.value as QualityCheck],
                              });
                            } else {
                              setMonitor({
                                ...monitor,
                                qualityChecks: monitor.qualityChecks.filter((c) => c !== check.value),
                              });
                            }
                          }}
                          className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <div>
                          <div className="font-medium text-slate-900 text-sm">{check.label}</div>
                          <div className="text-xs text-slate-600">{check.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Quality Threshold */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Quality Threshold: {monitor.threshold}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={monitor.threshold}
                    onChange={(e) => setMonitor({ ...monitor, threshold: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Data quality below this threshold will trigger alerts
                  </p>
                </div>

                {/* Monitor Button */}
                <div className="pt-4">
                  <button
                    onClick={handleMonitor}
                    disabled={monitoring || !monitor.dataSource.trim() || monitor.qualityChecks.length === 0}
                    className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {monitoring ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Running Quality Checks...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Run Quality Monitor
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-semibold">Data quality monitoring completed successfully!</span>
                </div>

                {/* Quality Results */}
                {qualityResult?.result && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Quality Check Results</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                        <div className="text-sm text-emerald-600 mb-1">Overall Quality Score</div>
                        <div className="text-2xl font-bold text-emerald-900">
                          {qualityResult.result.overallScore || 0}%
                        </div>
                      </div>
                      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                        <div className="text-sm text-amber-600 mb-1">Issues Found</div>
                        <div className="text-2xl font-bold text-amber-900">
                          {qualityResult.result.issues?.length || 0}
                        </div>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <div className="text-sm text-slate-600 mb-1">Checks Passed</div>
                        <div className="text-2xl font-bold text-slate-900">
                          {qualityResult.result.summary?.passed || 0}/{qualityResult.result.summary?.total || 0}
                        </div>
                      </div>
                    </div>
                    {qualityResult.result.issues && qualityResult.result.issues.length > 0 && (
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <h4 className="font-semibold text-slate-900 mb-3">Quality Issues</h4>
                        <div className="space-y-2">
                          {qualityResult.result.issues.slice(0, 10).map((issue: any, idx: number) => (
                            <div key={idx} className="p-3 rounded border border-amber-200 bg-amber-50">
                              <div className="font-semibold text-slate-900">{issue.check}</div>
                              <div className="text-sm text-slate-600 mt-1">{issue.description}</div>
                              {issue.recommendation && (
                                <div className="text-sm text-slate-700 mt-2">
                                  <strong>Recommendation:</strong> {issue.recommendation}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 rounded-lg font-semibold transition-colors"
                  >
                    Run Another Check
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SecureErrorBoundary>
  );
}
