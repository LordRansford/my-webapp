"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, BarChart3, HelpCircle, Plus, Trash2, Download, CheckCircle2, Upload } from "lucide-react";
import SecureErrorBoundary from "@/components/studios/SecureErrorBoundary";
import StudioNavigation from "@/components/studios/StudioNavigation";
import HelpTooltip from "@/components/studios/HelpTooltip";
import CreditEstimate from "@/components/studios/CreditEstimate";

type ChartType = "bar" | "line" | "pie" | "area" | "scatter";

interface Chart {
  id: string;
  title: string;
  type: ChartType;
  data: Array<Record<string, unknown>>;
  xAxis: string;
  yAxis: string;
}

export default function DashboardsPage() {
  const [charts, setCharts] = useState<Chart[]>([]);
  const [selectedChart, setSelectedChart] = useState<string | null>(null);
  const [csvData, setCsvData] = useState<string>("");
  const [generated, setGenerated] = useState(false);
  const [dashboardConfig, setDashboardConfig] = useState<string>("");

  function parseCSV(csv: string): Array<Record<string, unknown>> {
    const lines = csv.trim().split("\n");
    if (lines.length === 0) return [];

    const headers = lines[0].split(",").map((h) => h.trim());
    const data: Array<Record<string, unknown>> = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim());
      const row: Record<string, unknown> = {};
      headers.forEach((header, index) => {
        const value = values[index] || "";
        // Try to parse as number
        const numValue = parseFloat(value);
        row[header] = isNaN(numValue) ? value : numValue;
      });
      data.push(row);
    }

    return data;
  }

  function addChart() {
    const newChart: Chart = {
      id: Date.now().toString(),
      title: `Chart ${charts.length + 1}`,
      type: "bar",
      data: csvData ? parseCSV(csvData) : [],
      xAxis: "",
      yAxis: "",
    };
    setCharts([...charts, newChart]);
    setSelectedChart(newChart.id);
  }

  function removeChart(id: string) {
    setCharts(charts.filter((c) => c.id !== id));
    if (selectedChart === id) {
      setSelectedChart(null);
    }
  }

  function updateChart(id: string, updates: Partial<Chart>) {
    setCharts(charts.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  }

  function generateDashboard() {
    if (charts.length === 0) {
      alert("Please add at least one chart");
      return;
    }

    const config = {
      title: "Data Dashboard",
      charts: charts.map((chart) => ({
        id: chart.id,
        title: chart.title,
        type: chart.type,
        xAxis: chart.xAxis,
        yAxis: chart.yAxis,
        data: chart.data,
      })),
      generatedAt: new Date().toISOString(),
    };

    setDashboardConfig(JSON.stringify(config, null, 2));
    setGenerated(true);
  }

  function handleDownload() {
    if (!dashboardConfig) return;
    const blob = new Blob([dashboardConfig], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dashboard-config.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleReset() {
    setCharts([]);
    setSelectedChart(null);
    setCsvData("");
    setGenerated(false);
    setDashboardConfig("");
  }

  const selectedChartData = charts.find((c) => c.id === selectedChart);
  const availableColumns = selectedChartData && selectedChartData.data.length > 0
    ? Object.keys(selectedChartData.data[0])
    : [];

  return (
    <SecureErrorBoundary studio="data-studio">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
          <header className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Link href="/data-studio" className="text-slate-600 hover:text-slate-900 transition-colors" aria-label="Back to Data Studio">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Data Dashboards</h1>
                  <p className="text-base sm:text-lg text-slate-600 mt-1">Interactive data visualization and reporting</p>
                </div>
                <HelpTooltip
                  title="Data Dashboards"
                  content={
                    <div className="space-y-4">
                      <p>Create interactive dashboards to visualize and analyze your data.</p>
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-2">Features:</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                          <li>Upload CSV data</li>
                          <li>Create multiple chart types</li>
                          <li>Configure axes and labels</li>
                          <li>Export dashboard configuration</li>
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
              <CreditEstimate toolId="data-studio-dashboards" />
            </div>

            {!generated ? (
              <div className="space-y-6">
                {/* CSV Data Input */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Upload CSV Data
                  </label>
                  <textarea
                    value={csvData}
                    onChange={(e) => {
                      setCsvData(e.target.value);
                      // Auto-update chart data if charts exist
                      if (charts.length > 0) {
                        const parsed = parseCSV(e.target.value);
                        setCharts(charts.map((c) => ({ ...c, data: parsed })));
                      }
                    }}
                    placeholder="name,value,date&#10;Product A,100,2024-01-01&#10;Product B,150,2024-01-02&#10;Product C,200,2024-01-03"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 font-mono text-sm"
                    rows={6}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Enter CSV data with headers in the first row. Data will be parsed automatically.
                  </p>
                </div>

                {/* Charts List */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-slate-700">Charts</label>
                    <button
                      onClick={addChart}
                      className="flex items-center gap-2 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-semibold transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Chart
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {charts.map((chart) => (
                      <div
                        key={chart.id}
                        onClick={() => setSelectedChart(chart.id)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedChart === chart.id
                            ? "border-amber-500 bg-amber-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-semibold text-slate-900">{chart.title}</div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeChart(chart.id);
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-xs text-slate-600">{chart.type} chart</div>
                        <div className="text-xs text-slate-500 mt-1">{chart.data.length} data points</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chart Editor */}
                {selectedChartData && (
                  <div className="p-6 rounded-lg border border-slate-200 bg-slate-50">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Edit Chart</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Chart Title</label>
                        <input
                          type="text"
                          value={selectedChartData.title}
                          onChange={(e) => updateChart(selectedChartData.id, { title: e.target.value })}
                          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Chart Type</label>
                        <select
                          value={selectedChartData.type}
                          onChange={(e) => updateChart(selectedChartData.id, { type: e.target.value as ChartType })}
                          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                        >
                          <option value="bar">Bar Chart</option>
                          <option value="line">Line Chart</option>
                          <option value="pie">Pie Chart</option>
                          <option value="area">Area Chart</option>
                          <option value="scatter">Scatter Plot</option>
                        </select>
                      </div>
                      {availableColumns.length > 0 && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">X-Axis</label>
                            <select
                              value={selectedChartData.xAxis}
                              onChange={(e) => updateChart(selectedChartData.id, { xAxis: e.target.value })}
                              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                            >
                              <option value="">Select column...</option>
                              {availableColumns.map((col) => (
                                <option key={col} value={col}>
                                  {col}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Y-Axis</label>
                            <select
                              value={selectedChartData.yAxis}
                              onChange={(e) => updateChart(selectedChartData.id, { yAxis: e.target.value })}
                              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                            >
                              <option value="">Select column...</option>
                              {availableColumns.map((col) => (
                                <option key={col} value={col}>
                                  {col}
                                </option>
                              ))}
                            </select>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Generate Button */}
                <div className="pt-4">
                  <button
                    onClick={generateDashboard}
                    disabled={charts.length === 0}
                    className="w-full sm:w-auto px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Generate Dashboard
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-semibold">Dashboard configuration generated successfully!</span>
                </div>

                {/* Dashboard Preview */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Dashboard Configuration</h3>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 max-h-96 overflow-y-auto">
                    <pre className="text-xs font-mono text-slate-700 whitespace-pre-wrap">{dashboardConfig}</pre>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleDownload}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download Configuration
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
