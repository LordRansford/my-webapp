"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileCheck, HelpCircle, Play, CheckCircle2, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import SecureErrorBoundary from "@/components/studios/SecureErrorBoundary";
import StudioNavigation from "@/components/studios/StudioNavigation";
import HelpTooltip from "@/components/studios/HelpTooltip";
import CreditEstimate from "@/components/studios/CreditEstimate";

type ComplianceFramework = "gdpr" | "hipaa" | "pci_dss" | "iso27001" | "soc2" | "ccpa";

interface ComplianceAudit {
  framework: ComplianceFramework;
  organizationName: string;
  scope: string;
}

export default function CompliancePage() {
  const [audit, setAudit] = useState<ComplianceAudit>({
    framework: "gdpr",
    organizationName: "",
    scope: "",
  });
  const [auditing, setAuditing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [auditResult, setAuditResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAudit() {
    if (!audit.organizationName.trim()) {
      setError("Please enter an organization name");
      return;
    }

    setAuditing(true);
    setError(null);
    setCompleted(false);

    try {
      const response = await fetch("/api/cyber-studio/compliance/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toolId: "cyber-studio-compliance",
          audit,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Compliance audit failed");
      }

      setAuditResult(data);
      setCompleted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Compliance audit failed");
    } finally {
      setAuditing(false);
    }
  }

  function handleReset() {
    setAudit({
      framework: "gdpr",
      organizationName: "",
      scope: "",
    });
    setCompleted(false);
    setAuditResult(null);
    setError(null);
  }

  const frameworks = [
    { value: "gdpr", label: "GDPR", description: "General Data Protection Regulation" },
    { value: "hipaa", label: "HIPAA", description: "Health Insurance Portability and Accountability Act" },
    { value: "pci_dss", label: "PCI DSS", description: "Payment Card Industry Data Security Standard" },
    { value: "iso27001", label: "ISO 27001", description: "Information Security Management" },
    { value: "soc2", label: "SOC 2", description: "Service Organization Control 2" },
    { value: "ccpa", label: "CCPA", description: "California Consumer Privacy Act" },
  ];

  return (
    <SecureErrorBoundary studio="cyber-studio">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
          <header className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Link
                  href="/cyber-studio"
                  className="text-slate-600 hover:text-slate-900 transition-colors"
                  aria-label="Back to Cyber Studio"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                  <FileCheck className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Compliance Auditor</h1>
                  <p className="text-base sm:text-lg text-slate-600 mt-1">Automated compliance gap analysis</p>
                </div>
                <HelpTooltip
                  title="Compliance Auditor"
                  content={
                    <div className="space-y-4">
                      <p>
                        The Compliance Auditor checks if your organization follows security and privacy rules and regulations.
                      </p>
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-2">Features:</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                          <li>Audit against multiple compliance frameworks</li>
                          <li>Identify compliance gaps</li>
                          <li>Generate compliance reports</li>
                          <li>Provide remediation recommendations</li>
                        </ul>
                      </div>
                    </div>
                  }
                />
              </div>
              <StudioNavigation studioType="cyber" showHub={true} />
            </div>
          </header>

          <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
            {/* Credit Estimate */}
            <div className="mb-6">
              <CreditEstimate toolId="cyber-studio-compliance" />
            </div>

            {error && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-red-900">Audit Error</p>
                    <p className="text-sm text-red-800 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {!completed ? (
              <div className="space-y-6">
                {/* Framework Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Compliance Framework</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {frameworks.map((framework) => (
                      <button
                        key={framework.value}
                        onClick={() => setAudit({ ...audit, framework: framework.value as ComplianceFramework })}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          audit.framework === framework.value
                            ? "border-blue-500 bg-blue-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="font-semibold text-slate-900">{framework.label}</div>
                        <div className="text-xs text-slate-600 mt-1">{framework.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Organization Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Organization Name</label>
                  <input
                    type="text"
                    value={audit.organizationName}
                    onChange={(e) => setAudit({ ...audit, organizationName: e.target.value })}
                    placeholder="My Organization"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Scope */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Audit Scope</label>
                  <textarea
                    value={audit.scope}
                    onChange={(e) => setAudit({ ...audit, scope: e.target.value })}
                    placeholder="Describe the scope of the compliance audit (e.g., data processing activities, systems, departments)"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    rows={4}
                  />
                </div>

                {/* Audit Button */}
                <div className="pt-4">
                  <button
                    onClick={handleAudit}
                    disabled={auditing || !audit.organizationName.trim()}
                    className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {auditing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Running Compliance Audit...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Run Compliance Audit
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-semibold">Compliance audit completed successfully!</span>
                </div>

                {/* Audit Results */}
                {auditResult?.result && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Compliance Audit Results</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                        <div className="text-sm text-emerald-600 mb-1">Compliant</div>
                        <div className="text-2xl font-bold text-emerald-900">
                          {auditResult.result.summary?.compliant || 0}%
                        </div>
                      </div>
                      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                        <div className="text-sm text-amber-600 mb-1">Gaps Found</div>
                        <div className="text-2xl font-bold text-amber-900">
                          {auditResult.result.summary?.gaps || 0}
                        </div>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <div className="text-sm text-slate-600 mb-1">Total Controls</div>
                        <div className="text-2xl font-bold text-slate-900">
                          {auditResult.result.summary?.totalControls || 0}
                        </div>
                      </div>
                    </div>
                    {auditResult.result.gaps && auditResult.result.gaps.length > 0 && (
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <h4 className="font-semibold text-slate-900 mb-3">Compliance Gaps</h4>
                        <div className="space-y-2">
                          {auditResult.result.gaps.slice(0, 10).map((gap: any, idx: number) => (
                            <div key={idx} className="p-3 rounded border border-amber-200 bg-amber-50">
                              <div className="font-semibold text-slate-900">{gap.control}</div>
                              <div className="text-sm text-slate-600 mt-1">{gap.description}</div>
                              {gap.recommendation && (
                                <div className="text-sm text-slate-700 mt-2">
                                  <strong>Recommendation:</strong> {gap.recommendation}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {auditResult.result.recommendations && (
                      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                        <h4 className="font-semibold text-blue-900 mb-2">General Recommendations</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
                          {auditResult.result.recommendations.map((rec: string, idx: number) => (
                            <li key={idx}>{rec}</li>
                          ))}
                        </ul>
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
                    Run Another Audit
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
