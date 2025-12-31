"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Target, HelpCircle, Plus, Trash2, Download, CheckCircle2 } from "lucide-react";
import SecureErrorBoundary from "@/components/studios/SecureErrorBoundary";
import StudioNavigation from "@/components/studios/StudioNavigation";
import HelpTooltip from "@/components/studios/HelpTooltip";
import CreditEstimate from "@/components/studios/CreditEstimate";

interface Threat {
  id: string;
  description: string;
  category: "spoofing" | "tampering" | "repudiation" | "information_disclosure" | "denial_of_service" | "elevation_of_privilege";
  severity: "low" | "medium" | "high" | "critical";
  mitigation: string;
}

const threatCategories = {
  spoofing: "Spoofing",
  tampering: "Tampering",
  repudiation: "Repudiation",
  information_disclosure: "Information Disclosure",
  denial_of_service: "Denial of Service",
  elevation_of_privilege: "Elevation of Privilege",
};

export default function ThreatModelingPage() {
  const [systemName, setSystemName] = useState("");
  const [systemDescription, setSystemDescription] = useState("");
  const [assets, setAssets] = useState<string[]>([""]);
  const [threats, setThreats] = useState<Threat[]>([]);
  const [generated, setGenerated] = useState(false);
  const [threatModel, setThreatModel] = useState<string>("");

  function addAsset() {
    setAssets([...assets, ""]);
  }

  function removeAsset(index: number) {
    setAssets(assets.filter((_, i) => i !== index));
  }

  function updateAsset(index: number, value: string) {
    const newAssets = [...assets];
    newAssets[index] = value;
    setAssets(newAssets);
  }

  function addThreat() {
    setThreats([
      ...threats,
      {
        id: Date.now().toString(),
        description: "",
        category: "spoofing",
        severity: "medium",
        mitigation: "",
      },
    ]);
  }

  function removeThreat(id: string) {
    setThreats(threats.filter((t) => t.id !== id));
  }

  function updateThreat(id: string, updates: Partial<Threat>) {
    setThreats(threats.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  }

  function generateThreatModel() {
    if (!systemName.trim()) {
      alert("Please enter a system name");
      return;
    }

    if (assets.filter((a) => a.trim()).length === 0) {
      alert("Please add at least one asset");
      return;
    }

    const model = {
      system: {
        name: systemName,
        description: systemDescription,
        assets: assets.filter((a) => a.trim()),
      },
      threats: threats.filter((t) => t.description.trim()),
      summary: {
        totalThreats: threats.filter((t) => t.description.trim()).length,
        byCategory: threats.reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        bySeverity: threats.reduce((acc, t) => {
          acc[t.severity] = (acc[t.severity] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      },
      generatedAt: new Date().toISOString(),
    };

    setThreatModel(JSON.stringify(model, null, 2));
    setGenerated(true);
  }

  function handleDownload() {
    if (!threatModel) return;
    const blob = new Blob([threatModel], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${systemName || "threat-model"}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleReset() {
    setSystemName("");
    setSystemDescription("");
    setAssets([""]);
    setThreats([]);
    setGenerated(false);
    setThreatModel("");
  }

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
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Threat Model Generator</h1>
                  <p className="text-base sm:text-lg text-slate-600 mt-1">Automated threat modeling from system descriptions</p>
                </div>
                <HelpTooltip title="Threat Model Generator" content={<div className="space-y-4"><p>Generate threat models to identify security risks in your systems.</p></div>} />
              </div>
              <StudioNavigation studioType="cyber" showHub={true} />
            </div>
          </header>
          <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
            {/* Credit Estimate */}
            <div className="mb-6">
              <CreditEstimate toolId="cyber-studio-threat-modeling" />
            </div>

            {!generated ? (
              <div className="space-y-6">
                {/* System Information */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    System Name
                  </label>
                  <input
                    type="text"
                    value={systemName}
                    onChange={(e) => setSystemName(e.target.value)}
                    placeholder="Payment Processing API"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    System Description
                  </label>
                  <textarea
                    value={systemDescription}
                    onChange={(e) => setSystemDescription(e.target.value)}
                    placeholder="Describe your system and its purpose..."
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                    rows={4}
                  />
                </div>

                {/* Assets */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-slate-700">
                      System Assets
                    </label>
                    <button
                      onClick={addAsset}
                      className="flex items-center gap-2 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-semibold transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Asset
                    </button>
                  </div>
                  <div className="space-y-2">
                    {assets.map((asset, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={asset}
                          onChange={(e) => updateAsset(index, e.target.value)}
                          placeholder="e.g., Customer payment data"
                          className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                        />
                        {assets.length > 1 && (
                          <button
                            onClick={() => removeAsset(index)}
                            className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Threats */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-slate-700">
                      Threats
                    </label>
                    <button
                      onClick={addThreat}
                      className="flex items-center gap-2 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-semibold transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Threat
                    </button>
                  </div>
                  <div className="space-y-4">
                    {threats.map((threat) => (
                      <div key={threat.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                          <select
                            value={threat.category}
                            onChange={(e) =>
                              updateThreat(threat.id, {
                                category: e.target.value as Threat["category"],
                              })
                            }
                            className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                          >
                            {Object.entries(threatCategories).map(([value, label]) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ))}
                          </select>
                          <select
                            value={threat.severity}
                            onChange={(e) =>
                              updateThreat(threat.id, {
                                severity: e.target.value as Threat["severity"],
                              })
                            }
                            className="rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="critical">Critical</option>
                          </select>
                          <button
                            onClick={() => removeThreat(threat.id)}
                            className="flex items-center justify-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={threat.description}
                          onChange={(e) =>
                            updateThreat(threat.id, { description: e.target.value })
                          }
                          placeholder="Threat description"
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500 mb-2"
                        />
                        <textarea
                          value={threat.mitigation}
                          onChange={(e) =>
                            updateThreat(threat.id, { mitigation: e.target.value })
                          }
                          placeholder="Mitigation strategy"
                          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                          rows={2}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <div className="pt-4">
                  <button
                    onClick={generateThreatModel}
                    disabled={!systemName.trim() || assets.filter((a) => a.trim()).length === 0}
                    className="w-full sm:w-auto px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Generate Threat Model
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-semibold">Threat model generated successfully!</span>
                </div>

                {/* Threat Model Preview */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Threat Model</h3>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 max-h-96 overflow-y-auto">
                    <pre className="text-xs font-mono text-slate-700 whitespace-pre-wrap">
                      {threatModel}
                    </pre>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleDownload}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download Threat Model
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 rounded-lg font-semibold transition-colors"
                  >
                    Create Another Model
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
