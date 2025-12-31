"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, TrendingUp, HelpCircle, Play, Download, CheckCircle2, Loader2, AlertCircle, BarChart3 } from "lucide-react";
import SecureErrorBoundary from "@/components/studios/SecureErrorBoundary";
import StudioNavigation from "@/components/studios/StudioNavigation";
import HelpTooltip from "@/components/studios/HelpTooltip";
import CreditEstimate from "@/components/studios/CreditEstimate";

type TestType = "load" | "stress" | "spike" | "endurance";

interface PerformanceTest {
  url: string;
  testType: TestType;
  concurrentUsers: number;
  duration: number; // seconds
  rampUpTime: number; // seconds
}

export default function PerformancePage() {
  const [test, setTest] = useState<PerformanceTest>({
    url: "",
    testType: "load",
    concurrentUsers: 10,
    duration: 60,
    rampUpTime: 10,
  });
  const [running, setRunning] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleRun() {
    if (!test.url.trim()) {
      setError("Please enter a URL to test");
      return;
    }

    try {
      new URL(test.url);
    } catch {
      setError("Please enter a valid URL");
      return;
    }

    setRunning(true);
    setError(null);
    setCompleted(false);

    try {
      const response = await fetch("/api/dev-studio/performance/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toolId: "dev-studio-performance",
          test,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Performance test failed");
      }

      setTestResult(data);
      setCompleted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Performance test failed");
    } finally {
      setRunning(false);
    }
  }

  function handleReset() {
    setTest({
      url: "",
      testType: "load",
      concurrentUsers: 10,
      duration: 60,
      rampUpTime: 10,
    });
    setCompleted(false);
    setTestResult(null);
    setError(null);
  }

  const testTypes = [
    { value: "load", label: "Load Test", description: "Normal expected load" },
    { value: "stress", label: "Stress Test", description: "Beyond normal capacity" },
    { value: "spike", label: "Spike Test", description: "Sudden load increase" },
    { value: "endurance", label: "Endurance Test", description: "Sustained load over time" },
  ];

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
                  <p className="text-base sm:text-lg text-slate-600 mt-1">Load testing and performance analysis</p>
                </div>
                <HelpTooltip
                  title="Performance Profiler"
                  content={
                    <div className="space-y-4">
                      <p>
                        The Performance Profiler measures how fast your application runs and identifies parts that are slow.
                      </p>
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-2">Features:</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                          <li>Load testing with configurable parameters</li>
                          <li>Performance metrics collection</li>
                          <li>Bottleneck identification</li>
                          <li>Performance reports</li>
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

            {error && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-red-900">Test Error</p>
                    <p className="text-sm text-red-800 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {!completed ? (
              <div className="space-y-6">
                {/* Test Configuration */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">URL to Test</label>
                  <input
                    type="url"
                    value={test.url}
                    onChange={(e) => setTest({ ...test, url: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Test Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Test Type</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {testTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setTest({ ...test, testType: type.value as TestType })}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          test.testType === type.value
                            ? "border-amber-500 bg-amber-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="font-semibold text-slate-900">{type.label}</div>
                        <div className="text-xs text-slate-600 mt-1">{type.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Test Parameters */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Concurrent Users: {test.concurrentUsers}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={test.concurrentUsers}
                      onChange={(e) => setTest({ ...test, concurrentUsers: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Duration: {test.duration}s
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="300"
                      step="10"
                      value={test.duration}
                      onChange={(e) => setTest({ ...test, duration: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Ramp Up: {test.rampUpTime}s
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="60"
                      step="5"
                      value={test.rampUpTime}
                      onChange={(e) => setTest({ ...test, rampUpTime: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Run Button */}
                <div className="pt-4">
                  <button
                    onClick={handleRun}
                    disabled={running || !test.url.trim()}
                    className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {running ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Running Performance Test...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Run Performance Test
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-semibold">Performance test completed successfully!</span>
                </div>

                {/* Test Results */}
                {testResult?.result && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Test Results</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <div className="text-sm text-slate-600 mb-1">Average Response Time</div>
                        <div className="text-2xl font-bold text-slate-900">
                          {testResult.result.metrics?.avgResponseTime || "N/A"}ms
                        </div>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <div className="text-sm text-slate-600 mb-1">Requests Per Second</div>
                        <div className="text-2xl font-bold text-slate-900">
                          {testResult.result.metrics?.rps || "N/A"}
                        </div>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <div className="text-sm text-slate-600 mb-1">Error Rate</div>
                        <div className="text-2xl font-bold text-slate-900">
                          {testResult.result.metrics?.errorRate || "0"}%
                        </div>
                      </div>
                    </div>
                    {testResult.result.recommendations && (
                      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                        <h4 className="font-semibold text-amber-900 mb-2">Recommendations</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-amber-800">
                          {testResult.result.recommendations.map((rec: string, idx: number) => (
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
                    Run Another Test
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
