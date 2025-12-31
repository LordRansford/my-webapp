"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Shield, HelpCircle, Play, Download, CheckCircle2, Loader2, AlertCircle, AlertTriangle } from "lucide-react";
import SecureErrorBoundary from "@/components/studios/SecureErrorBoundary";
import StudioNavigation from "@/components/studios/StudioNavigation";
import HelpTooltip from "@/components/studios/HelpTooltip";
import CreditEstimate from "@/components/studios/CreditEstimate";

type ScanType = "code" | "dependencies" | "secrets" | "configuration";

interface SecurityScan {
  scanType: ScanType;
  target: string; // URL, repo URL, or code snippet
  includeDependencies?: boolean;
  checkSecrets?: boolean;
}

export default function SecurityPage() {
  const [scan, setScan] = useState<SecurityScan>({
    scanType: "code",
    target: "",
    includeDependencies: true,
    checkSecrets: true,
  });
  const [scanning, setScanning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleScan() {
    if (!scan.target.trim()) {
      setError("Please enter a target to scan");
      return;
    }

    setScanning(true);
    setError(null);
    setCompleted(false);

    try {
      const response = await fetch("/api/dev-studio/security/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toolId: "dev-studio-security",
          scan,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Security scan failed");
      }

      setScanResult(data);
      setCompleted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Security scan failed");
    } finally {
      setScanning(false);
    }
  }

  function handleReset() {
    setScan({
      scanType: "code",
      target: "",
      includeDependencies: true,
      checkSecrets: true,
    });
    setCompleted(false);
    setScanResult(null);
    setError(null);
  }

  const scanTypes = [
    { value: "code", label: "Code Scan", description: "Scan code for vulnerabilities" },
    { value: "dependencies", label: "Dependencies", description: "Check dependency vulnerabilities" },
    { value: "secrets", label: "Secrets", description: "Detect exposed secrets" },
    { value: "configuration", label: "Configuration", description: "Check security configuration" },
  ];

  return (
    <SecureErrorBoundary studio="dev-studio">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50/30 to-slate-50">
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
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 text-white">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Security Scanner</h1>
                  <p className="text-base sm:text-lg text-slate-600 mt-1">Automated security checklist and vulnerability scanning</p>
                </div>
                <HelpTooltip
                  title="Security Scanner"
                  content={
                    <div className="space-y-4">
                      <p>
                        The Security Scanner checks your code for security problems before attackers can exploit them.
                      </p>
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-2">Features:</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                          <li>Scan code for vulnerabilities</li>
                          <li>Check dependencies for known issues</li>
                          <li>Detect exposed secrets</li>
                          <li>Validate security best practices</li>
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
              <CreditEstimate toolId="dev-studio-security" />
            </div>

            {error && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-red-900">Scan Error</p>
                    <p className="text-sm text-red-800 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {!completed ? (
              <div className="space-y-6">
                {/* Scan Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Scan Type</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {scanTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setScan({ ...scan, scanType: type.value as ScanType })}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          scan.scanType === type.value
                            ? "border-rose-500 bg-rose-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="font-semibold text-slate-900">{type.label}</div>
                        <div className="text-xs text-slate-600 mt-1">{type.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {scan.scanType === "code" ? "Code/Repository URL" : scan.scanType === "dependencies" ? "Package File (package.json, requirements.txt, etc.)" : "Target to Scan"}
                  </label>
                  <textarea
                    value={scan.target}
                    onChange={(e) => setScan({ ...scan, target: e.target.value })}
                    placeholder={
                      scan.scanType === "code"
                        ? "https://github.com/user/repo or paste code snippet"
                        : scan.scanType === "dependencies"
                        ? "Paste package.json or requirements.txt content"
                        : "Enter target to scan"
                    }
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500 font-mono text-sm"
                    rows={scan.scanType === "code" ? 6 : 4}
                  />
                </div>

                {/* Options */}
                {scan.scanType === "code" && (
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={scan.includeDependencies}
                        onChange={(e) => setScan({ ...scan, includeDependencies: e.target.checked })}
                        className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                      />
                      <span className="text-sm text-slate-700">Include dependency scanning</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={scan.checkSecrets}
                        onChange={(e) => setScan({ ...scan, checkSecrets: e.target.checked })}
                        className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                      />
                      <span className="text-sm text-slate-700">Check for exposed secrets</span>
                    </label>
                  </div>
                )}

                {/* Scan Button */}
                <div className="pt-4">
                  <button
                    onClick={handleScan}
                    disabled={scanning || !scan.target.trim()}
                    className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {scanning ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Scanning...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Run Security Scan
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-semibold">Security scan completed successfully!</span>
                </div>

                {/* Scan Results */}
                {scanResult?.result && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Scan Results</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                        <div className="text-sm text-red-600 mb-1">Critical Issues</div>
                        <div className="text-2xl font-bold text-red-900">
                          {scanResult.result.summary?.critical || 0}
                        </div>
                      </div>
                      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                        <div className="text-sm text-amber-600 mb-1">High Issues</div>
                        <div className="text-2xl font-bold text-amber-900">
                          {scanResult.result.summary?.high || 0}
                        </div>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <div className="text-sm text-slate-600 mb-1">Total Issues</div>
                        <div className="text-2xl font-bold text-slate-900">
                          {scanResult.result.summary?.total || 0}
                        </div>
                      </div>
                    </div>
                    {scanResult.result.issues && scanResult.result.issues.length > 0 && (
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <h4 className="font-semibold text-slate-900 mb-3">Issues Found</h4>
                        <div className="space-y-2">
                          {scanResult.result.issues.slice(0, 10).map((issue: any, idx: number) => (
                            <div
                              key={idx}
                              className={`p-3 rounded border ${
                                issue.severity === "critical"
                                  ? "border-red-200 bg-red-50"
                                  : issue.severity === "high"
                                  ? "border-amber-200 bg-amber-50"
                                  : "border-slate-200 bg-white"
                              }`}
                            >
                              <div className="flex items-start gap-2">
                                <AlertTriangle
                                  className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                                    issue.severity === "critical"
                                      ? "text-red-600"
                                      : issue.severity === "high"
                                      ? "text-amber-600"
                                      : "text-slate-600"
                                  }`}
                                />
                                <div className="flex-1">
                                  <div className="font-semibold text-slate-900">{issue.title}</div>
                                  <div className="text-sm text-slate-600 mt-1">{issue.description}</div>
                                  {issue.recommendation && (
                                    <div className="text-sm text-slate-700 mt-2">
                                      <strong>Recommendation:</strong> {issue.recommendation}
                                    </div>
                                  )}
                                </div>
                              </div>
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
                    Run Another Scan
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
