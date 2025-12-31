"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Shield, HelpCircle, Plus, Trash2, Download, CheckCircle2, AlertTriangle } from "lucide-react";
import SecureErrorBoundary from "@/components/studios/SecureErrorBoundary";
import StudioNavigation from "@/components/studios/StudioNavigation";
import HelpTooltip from "@/components/studios/HelpTooltip";
import CreditEstimate from "@/components/studios/CreditEstimate";

type RiskLevel = "low" | "medium" | "high" | "critical";
type RiskStatus = "open" | "mitigated" | "accepted" | "transferred";

interface Risk {
  id: string;
  title: string;
  description: string;
  category: string;
  likelihood: RiskLevel;
  impact: RiskLevel;
  status: RiskStatus;
  mitigation: string;
  owner: string;
  dueDate?: string;
}

export default function RiskRegisterPage() {
  const [risks, setRisks] = useState<Risk[]>([]);
  const [selectedRisk, setSelectedRisk] = useState<string | null>(null);
  const [generated, setGenerated] = useState(false);
  const [riskReport, setRiskReport] = useState<string>("");

  function calculateRiskScore(likelihood: RiskLevel, impact: RiskLevel): number {
    const likelihoodScores = { low: 1, medium: 2, high: 3, critical: 4 };
    const impactScores = { low: 1, medium: 2, high: 3, critical: 4 };
    return likelihoodScores[likelihood] * impactScores[impact];
  }

  function addRisk() {
    const newRisk: Risk = {
      id: Date.now().toString(),
      title: "New Risk",
      description: "",
      category: "Security",
      likelihood: "medium",
      impact: "medium",
      status: "open",
      mitigation: "",
      owner: "",
    };
    setRisks([...risks, newRisk]);
    setSelectedRisk(newRisk.id);
  }

  function removeRisk(id: string) {
    setRisks(risks.filter((r) => r.id !== id));
    if (selectedRisk === id) {
      setSelectedRisk(null);
    }
  }

  function updateRisk(id: string, updates: Partial<Risk>) {
    setRisks(risks.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  }

  function generateReport() {
    if (risks.length === 0) {
      alert("Please add at least one risk");
      return;
    }

    const report = {
      title: "Risk Register Report",
      generatedAt: new Date().toISOString(),
      summary: {
        total: risks.length,
        byStatus: risks.reduce((acc, r) => {
          acc[r.status] = (acc[r.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        byLevel: risks.reduce((acc, r) => {
          const score = calculateRiskScore(r.likelihood, r.impact);
          const level = score >= 12 ? "critical" : score >= 9 ? "high" : score >= 6 ? "medium" : "low";
          acc[level] = (acc[level] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      },
      risks: risks.map((risk) => ({
        ...risk,
        riskScore: calculateRiskScore(risk.likelihood, risk.impact),
        riskLevel:
          calculateRiskScore(risk.likelihood, risk.impact) >= 12
            ? "critical"
            : calculateRiskScore(risk.likelihood, risk.impact) >= 9
            ? "high"
            : calculateRiskScore(risk.likelihood, risk.impact) >= 6
            ? "medium"
            : "low",
      })),
    };

    setRiskReport(JSON.stringify(report, null, 2));
    setGenerated(true);
  }

  function handleDownload() {
    if (!riskReport) return;
    const blob = new Blob([riskReport], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "risk-register.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleReset() {
    setRisks([]);
    setSelectedRisk(null);
    setGenerated(false);
    setRiskReport("");
  }

  const selectedRiskData = risks.find((r) => r.id === selectedRisk);
  const riskCategories = ["Security", "Compliance", "Operational", "Financial", "Reputational", "Technical"];

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
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Risk Register Builder</h1>
                  <p className="text-base sm:text-lg text-slate-600 mt-1">Comprehensive risk tracking with mitigation plans</p>
                </div>
                <HelpTooltip
                  title="Risk Register Builder"
                  content={
                    <div className="space-y-4">
                      <p>Create and manage a comprehensive risk register to track security and operational risks.</p>
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-2">Features:</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                          <li>Identify and categorize risks</li>
                          <li>Assess likelihood and impact</li>
                          <li>Define mitigation strategies</li>
                          <li>Track risk status and ownership</li>
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
              <CreditEstimate toolId="cyber-studio-risk-register" />
            </div>

            {!generated ? (
              <div className="space-y-6">
                {/* Risks List */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-slate-700">Risks</label>
                    <button
                      onClick={addRisk}
                      className="flex items-center gap-2 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-semibold transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Risk
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {risks.map((risk) => {
                      const score = calculateRiskScore(risk.likelihood, risk.impact);
                      const level =
                        score >= 12 ? "critical" : score >= 9 ? "high" : score >= 6 ? "medium" : "low";
                      const colorClasses = {
                        critical: "bg-red-100 text-red-800 border-red-300",
                        high: "bg-orange-100 text-orange-800 border-orange-300",
                        medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
                        low: "bg-green-100 text-green-800 border-green-300",
                      };
                      return (
                        <div
                          key={risk.id}
                          onClick={() => setSelectedRisk(risk.id)}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            selectedRisk === risk.id
                              ? "border-rose-500 bg-rose-50"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-semibold text-slate-900">{risk.title}</div>
                            <span className={`px-2 py-1 rounded text-xs font-medium border ${colorClasses[level]}`}>
                              {level}
                            </span>
                          </div>
                          <div className="text-xs text-slate-600 mb-1">{risk.category}</div>
                          <div className="text-xs text-slate-500">Score: {score}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Risk Editor */}
                {selectedRiskData && (
                  <div className="p-6 rounded-lg border border-slate-200 bg-slate-50">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Edit Risk</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Risk Title</label>
                        <input
                          type="text"
                          value={selectedRiskData.title}
                          onChange={(e) => updateRisk(selectedRiskData.id, { title: e.target.value })}
                          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                        <textarea
                          value={selectedRiskData.description}
                          onChange={(e) => updateRisk(selectedRiskData.id, { description: e.target.value })}
                          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                          <select
                            value={selectedRiskData.category}
                            onChange={(e) => updateRisk(selectedRiskData.id, { category: e.target.value })}
                            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                          >
                            {riskCategories.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                          <select
                            value={selectedRiskData.status}
                            onChange={(e) => updateRisk(selectedRiskData.id, { status: e.target.value as RiskStatus })}
                            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                          >
                            <option value="open">Open</option>
                            <option value="mitigated">Mitigated</option>
                            <option value="accepted">Accepted</option>
                            <option value="transferred">Transferred</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Likelihood</label>
                          <select
                            value={selectedRiskData.likelihood}
                            onChange={(e) => updateRisk(selectedRiskData.id, { likelihood: e.target.value as RiskLevel })}
                            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="critical">Critical</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Impact</label>
                          <select
                            value={selectedRiskData.impact}
                            onChange={(e) => updateRisk(selectedRiskData.id, { impact: e.target.value as RiskLevel })}
                            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="critical">Critical</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Mitigation Strategy</label>
                        <textarea
                          value={selectedRiskData.mitigation}
                          onChange={(e) => updateRisk(selectedRiskData.id, { mitigation: e.target.value })}
                          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                          rows={3}
                          placeholder="Describe how this risk will be mitigated..."
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Owner</label>
                          <input
                            type="text"
                            value={selectedRiskData.owner}
                            onChange={(e) => updateRisk(selectedRiskData.id, { owner: e.target.value })}
                            placeholder="Risk owner name"
                            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Due Date</label>
                          <input
                            type="date"
                            value={selectedRiskData.dueDate || ""}
                            onChange={(e) => updateRisk(selectedRiskData.id, { dueDate: e.target.value })}
                            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <div>
                          <span className="text-sm font-medium text-slate-700">Risk Score: </span>
                          <span className="text-lg font-bold text-slate-900">
                            {calculateRiskScore(selectedRiskData.likelihood, selectedRiskData.impact)}
                          </span>
                        </div>
                        <button
                          onClick={() => removeRisk(selectedRiskData.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Risk
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Generate Button */}
                <div className="pt-4">
                  <button
                    onClick={generateReport}
                    disabled={risks.length === 0}
                    className="w-full sm:w-auto px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Generate Risk Register Report
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-semibold">Risk register report generated successfully!</span>
                </div>

                {/* Report Preview */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Risk Register Report</h3>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 max-h-96 overflow-y-auto">
                    <pre className="text-xs font-mono text-slate-700 whitespace-pre-wrap">{riskReport}</pre>
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
                    Create Another Register
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
