"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, TrendingUp, HelpCircle, Plus, Trash2, Download, CheckCircle2, BarChart3 } from "lucide-react";
import SecureErrorBoundary from "@/components/studios/SecureErrorBoundary";
import StudioNavigation from "@/components/studios/StudioNavigation";
import HelpTooltip from "@/components/studios/HelpTooltip";
import CreditEstimate from "@/components/studios/CreditEstimate";

type MetricType = "count" | "percentage" | "rate" | "time" | "score";
type Trend = "improving" | "stable" | "degrading";

interface SecurityMetric {
  id: string;
  name: string;
  type: MetricType;
  currentValue: number;
  targetValue?: number;
  trend: Trend;
  description: string;
  category: string;
}

export default function MetricsPage() {
  const [dashboardName, setDashboardName] = useState("");
  const [metrics, setMetrics] = useState<SecurityMetric[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [generated, setGenerated] = useState(false);
  const [metricsReport, setMetricsReport] = useState<string>("");

  function addMetric() {
    const newMetric: SecurityMetric = {
      id: Date.now().toString(),
      name: `Metric ${metrics.length + 1}`,
      type: "count",
      currentValue: 0,
      trend: "stable",
      description: "",
      category: "Security",
    };
    setMetrics([...metrics, newMetric]);
    setSelectedMetric(newMetric.id);
  }

  function removeMetric(id: string) {
    setMetrics(metrics.filter((m) => m.id !== id));
    if (selectedMetric === id) {
      setSelectedMetric(null);
    }
  }

  function updateMetric(id: string, updates: Partial<SecurityMetric>) {
    setMetrics(metrics.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  }

  function generateReport() {
    if (metrics.length === 0) {
      alert("Please add at least one metric");
      return;
    }

    const report = {
      dashboard: {
        name: dashboardName || "Security Metrics Dashboard",
        generatedAt: new Date().toISOString(),
        totalMetrics: metrics.length,
      },
      metrics: metrics.map((metric) => ({
        ...metric,
        status:
          metric.targetValue !== undefined
            ? metric.currentValue >= metric.targetValue
              ? "meeting_target"
              : "below_target"
            : "no_target",
      })),
      summary: {
        byCategory: metrics.reduce((acc, m) => {
          acc[m.category] = (acc[m.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        byTrend: metrics.reduce((acc, m) => {
          acc[m.trend] = (acc[m.trend] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        metricsMeetingTarget: metrics.filter(
          (m) => m.targetValue !== undefined && m.currentValue >= m.targetValue
        ).length,
      },
    };

    setMetricsReport(JSON.stringify(report, null, 2));
    setGenerated(true);
  }

  function handleDownload() {
    if (!metricsReport) return;
    const blob = new Blob([metricsReport], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${dashboardName || "security-metrics"}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleReset() {
    setDashboardName("");
    setMetrics([]);
    setSelectedMetric(null);
    setGenerated(false);
    setMetricsReport("");
  }

  const selectedMetricData = metrics.find((m) => m.id === selectedMetric);
  const metricTypes = [
    { value: "count", label: "Count" },
    { value: "percentage", label: "Percentage" },
    { value: "rate", label: "Rate" },
    { value: "time", label: "Time" },
    { value: "score", label: "Score" },
  ];

  const categories = ["Security", "Compliance", "Incident Response", "Vulnerability Management", "Access Control"];

  return (
    <SecureErrorBoundary studio="cyber-studio">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50/30 to-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
          <header className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Link href="/cyber-studio" className="text-slate-600 hover:text-slate-900 transition-colors" aria-label="Back to Cyber Studio">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 text-white">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Security Metrics Dashboard</h1>
                  <p className="text-base sm:text-lg text-slate-600 mt-1">Track key security performance indicators</p>
                </div>
                <HelpTooltip
                  title="Security Metrics Dashboard"
                  content={
                    <div className="space-y-4">
                      <p>Create a dashboard to track and monitor key security performance indicators (KPIs).</p>
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-2">Features:</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                          <li>Define security metrics and KPIs</li>
                          <li>Track current values and targets</li>
                          <li>Monitor trends over time</li>
                          <li>Generate metrics reports</li>
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
              <CreditEstimate toolId="cyber-studio-metrics" />
            </div>

            {!generated ? (
              <div className="space-y-6">
                {/* Dashboard Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Dashboard Name</label>
                  <input
                    type="text"
                    value={dashboardName}
                    onChange={(e) => setDashboardName(e.target.value)}
                    placeholder="Security Metrics Dashboard"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                {/* Metrics List */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-slate-700">Security Metrics</label>
                    <button
                      onClick={addMetric}
                      className="flex items-center gap-2 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-semibold transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Metric
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {metrics.map((metric) => {
                      const trendColors = {
                        improving: "bg-green-100 text-green-800",
                        stable: "bg-yellow-100 text-yellow-800",
                        degrading: "bg-red-100 text-red-800",
                      };
                      return (
                        <div
                          key={metric.id}
                          onClick={() => setSelectedMetric(metric.id)}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            selectedMetric === metric.id
                              ? "border-rose-500 bg-rose-50"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-semibold text-slate-900">{metric.name}</div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeMetric(metric.id);
                              }}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="text-2xl font-bold text-slate-900 mb-2">{metric.currentValue}</div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${trendColors[metric.trend]}`}>
                              {metric.trend}
                            </span>
                            <span className="px-2 py-1 rounded bg-rose-100 text-rose-800 text-xs font-medium">
                              {metric.type}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Metric Editor */}
                {selectedMetricData && (
                  <div className="p-6 rounded-lg border border-slate-200 bg-slate-50">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Edit Metric</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Metric Name</label>
                        <input
                          type="text"
                          value={selectedMetricData.name}
                          onChange={(e) => updateMetric(selectedMetricData.id, { name: e.target.value })}
                          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
                          <select
                            value={selectedMetricData.type}
                            onChange={(e) => updateMetric(selectedMetricData.id, { type: e.target.value as MetricType })}
                            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                          >
                            {metricTypes.map((type) => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                          <select
                            value={selectedMetricData.category}
                            onChange={(e) => updateMetric(selectedMetricData.id, { category: e.target.value })}
                            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                          >
                            {categories.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Current Value</label>
                          <input
                            type="number"
                            value={selectedMetricData.currentValue}
                            onChange={(e) =>
                              updateMetric(selectedMetricData.id, { currentValue: parseFloat(e.target.value) || 0 })
                            }
                            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Target Value (optional)</label>
                          <input
                            type="number"
                            value={selectedMetricData.targetValue || ""}
                            onChange={(e) =>
                              updateMetric(selectedMetricData.id, {
                                targetValue: e.target.value ? parseFloat(e.target.value) : undefined,
                              })
                            }
                            placeholder="Target"
                            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Trend</label>
                          <select
                            value={selectedMetricData.trend}
                            onChange={(e) => updateMetric(selectedMetricData.id, { trend: e.target.value as Trend })}
                            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                          >
                            <option value="improving">Improving</option>
                            <option value="stable">Stable</option>
                            <option value="degrading">Degrading</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                        <textarea
                          value={selectedMetricData.description}
                          onChange={(e) => updateMetric(selectedMetricData.id, { description: e.target.value })}
                          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                          rows={3}
                          placeholder="Describe what this metric measures..."
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Generate Button */}
                <div className="pt-4">
                  <button
                    onClick={generateReport}
                    disabled={metrics.length === 0}
                    className="w-full sm:w-auto px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Generate Metrics Report
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-semibold">Security metrics report generated successfully!</span>
                </div>

                {/* Report Preview */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Metrics Report</h3>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 max-h-96 overflow-y-auto">
                    <pre className="text-xs font-mono text-slate-700 whitespace-pre-wrap">{metricsReport}</pre>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleDownload}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download Report
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 rounded-lg font-semibold transition-colors"
                  >
                    Create Another Dashboard
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
