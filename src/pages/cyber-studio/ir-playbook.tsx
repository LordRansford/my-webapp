"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, HelpCircle, Plus, Trash2, Download, CheckCircle2, AlertTriangle, CheckCircle } from "lucide-react";
import SecureErrorBoundary from "@/components/studios/SecureErrorBoundary";
import StudioNavigation from "@/components/studios/StudioNavigation";
import HelpTooltip from "@/components/studios/HelpTooltip";
import CreditEstimate from "@/components/studios/CreditEstimate";

type IncidentType = "malware" | "phishing" | "data_breach" | "ddos" | "unauthorized_access" | "other";
type Severity = "low" | "medium" | "high" | "critical";

interface PlaybookStep {
  id: string;
  title: string;
  description: string;
  order: number;
  assignee?: string;
  estimatedTime?: string;
}

interface Playbook {
  name: string;
  incidentType: IncidentType;
  severity: Severity;
  steps: PlaybookStep[];
}

export default function IRPlaybookPage() {
  const [playbook, setPlaybook] = useState<Playbook>({
    name: "Incident Response Playbook",
    incidentType: "malware",
    severity: "medium",
    steps: [],
  });
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [generated, setGenerated] = useState(false);
  const [playbookDoc, setPlaybookDoc] = useState<string>("");

  function addStep() {
    const newStep: PlaybookStep = {
      id: Date.now().toString(),
      title: `Step ${playbook.steps.length + 1}`,
      description: "",
      order: playbook.steps.length + 1,
    };
    setPlaybook({
      ...playbook,
      steps: [...playbook.steps, newStep],
    });
    setSelectedStep(newStep.id);
  }

  function removeStep(id: string) {
    const updatedSteps = playbook.steps
      .filter((s) => s.id !== id)
      .map((s, index) => ({ ...s, order: index + 1 }));
    setPlaybook({
      ...playbook,
      steps: updatedSteps,
    });
    if (selectedStep === id) {
      setSelectedStep(null);
    }
  }

  function updateStep(id: string, updates: Partial<PlaybookStep>) {
    setPlaybook({
      ...playbook,
      steps: playbook.steps.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    });
  }

  function moveStep(id: string, direction: "up" | "down") {
    const index = playbook.steps.findIndex((s) => s.id === id);
    if (index === -1) return;

    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= playbook.steps.length) return;

    const newSteps = [...playbook.steps];
    [newSteps[index], newSteps[newIndex]] = [newSteps[newIndex], newSteps[index]];
    newSteps.forEach((s, i) => {
      s.order = i + 1;
    });

    setPlaybook({
      ...playbook,
      steps: newSteps,
    });
  }

  function generatePlaybook() {
    if (playbook.steps.length === 0) {
      alert("Please add at least one step");
      return;
    }

    const doc = {
      playbook: {
        name: playbook.name,
        incidentType: playbook.incidentType,
        severity: playbook.severity,
        createdAt: new Date().toISOString(),
      },
      steps: playbook.steps.sort((a, b) => a.order - b.order),
      summary: {
        totalSteps: playbook.steps.length,
        estimatedTotalTime: playbook.steps.reduce((total, step) => {
          const time = step.estimatedTime ? parseInt(step.estimatedTime) : 0;
          return total + time;
        }, 0),
      },
    };

    setPlaybookDoc(JSON.stringify(doc, null, 2));
    setGenerated(true);
  }

  function handleDownload() {
    if (!playbookDoc) return;
    const blob = new Blob([playbookDoc], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${playbook.name || "ir-playbook"}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleReset() {
    setPlaybook({
      name: "Incident Response Playbook",
      incidentType: "malware",
      severity: "medium",
      steps: [],
    });
    setSelectedStep(null);
    setGenerated(false);
    setPlaybookDoc("");
  }

  const selectedStepData = playbook.steps.find((s) => s.id === selectedStep);
  const incidentTypes = [
    { value: "malware", label: "Malware" },
    { value: "phishing", label: "Phishing" },
    { value: "data_breach", label: "Data Breach" },
    { value: "ddos", label: "DDoS Attack" },
    { value: "unauthorized_access", label: "Unauthorized Access" },
    { value: "other", label: "Other" },
  ];

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
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Incident Response Playbook Builder</h1>
                  <p className="text-base sm:text-lg text-slate-600 mt-1">Create and test IR procedures</p>
                </div>
                <HelpTooltip
                  title="Incident Response Playbook Builder"
                  content={
                    <div className="space-y-4">
                      <p>Create structured incident response playbooks to guide your team during security incidents.</p>
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-2">Features:</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                          <li>Define incident response procedures</li>
                          <li>Create step-by-step workflows</li>
                          <li>Assign responsibilities</li>
                          <li>Estimate response times</li>
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
              <CreditEstimate toolId="cyber-studio-ir-playbook" />
            </div>

            {!generated ? (
              <div className="space-y-6">
                {/* Playbook Configuration */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Playbook Name</label>
                    <input
                      type="text"
                      value={playbook.name}
                      onChange={(e) => setPlaybook({ ...playbook, name: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Incident Type</label>
                    <select
                      value={playbook.incidentType}
                      onChange={(e) => setPlaybook({ ...playbook, incidentType: e.target.value as IncidentType })}
                      className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                    >
                      {incidentTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Severity</label>
                    <select
                      value={playbook.severity}
                      onChange={(e) => setPlaybook({ ...playbook, severity: e.target.value as Severity })}
                      className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>

                {/* Steps List */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-slate-700">Response Steps</label>
                    <button
                      onClick={addStep}
                      className="flex items-center gap-2 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-semibold transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Step
                    </button>
                  </div>
                  <div className="space-y-2">
                    {playbook.steps
                      .sort((a, b) => a.order - b.order)
                      .map((step) => (
                        <div
                          key={step.id}
                          onClick={() => setSelectedStep(step.id)}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            selectedStep === step.id
                              ? "border-rose-500 bg-rose-50"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-600 text-white font-bold text-sm">
                                {step.order}
                              </div>
                              <div>
                                <div className="font-semibold text-slate-900">{step.title}</div>
                                {step.estimatedTime && (
                                  <div className="text-xs text-slate-600">Est. {step.estimatedTime} min</div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveStep(step.id, "up");
                                }}
                                disabled={step.order === 1}
                                className="p-1 text-slate-600 hover:text-slate-900 disabled:opacity-30"
                              >
                                ↑
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  moveStep(step.id, "down");
                                }}
                                disabled={step.order === playbook.steps.length}
                                className="p-1 text-slate-600 hover:text-slate-900 disabled:opacity-30"
                              >
                                ↓
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeStep(step.id);
                                }}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Step Editor */}
                {selectedStepData && (
                  <div className="p-6 rounded-lg border border-slate-200 bg-slate-50">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Edit Step {selectedStepData.order}</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Step Title</label>
                        <input
                          type="text"
                          value={selectedStepData.title}
                          onChange={(e) => updateStep(selectedStepData.id, { title: e.target.value })}
                          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                        <textarea
                          value={selectedStepData.description}
                          onChange={(e) => updateStep(selectedStepData.id, { description: e.target.value })}
                          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                          rows={4}
                          placeholder="Describe what needs to be done in this step..."
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Assignee</label>
                          <input
                            type="text"
                            value={selectedStepData.assignee || ""}
                            onChange={(e) => updateStep(selectedStepData.id, { assignee: e.target.value })}
                            placeholder="Team or person responsible"
                            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Estimated Time (minutes)</label>
                          <input
                            type="number"
                            value={selectedStepData.estimatedTime || ""}
                            onChange={(e) => updateStep(selectedStepData.id, { estimatedTime: e.target.value })}
                            placeholder="30"
                            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Generate Button */}
                <div className="pt-4">
                  <button
                    onClick={generatePlaybook}
                    disabled={playbook.steps.length === 0}
                    className="w-full sm:w-auto px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Generate Playbook
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-semibold">Incident response playbook generated successfully!</span>
                </div>

                {/* Playbook Preview */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Playbook Document</h3>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 max-h-96 overflow-y-auto">
                    <pre className="text-xs font-mono text-slate-700 whitespace-pre-wrap">{playbookDoc}</pre>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleDownload}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download Playbook
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 rounded-lg font-semibold transition-colors"
                  >
                    Create Another Playbook
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
