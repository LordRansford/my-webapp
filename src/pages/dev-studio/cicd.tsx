"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, GitBranch, HelpCircle, Plus, Trash2, Download, CheckCircle2, Play, Settings } from "lucide-react";
import SecureErrorBoundary from "@/components/studios/SecureErrorBoundary";
import StudioNavigation from "@/components/studios/StudioNavigation";
import HelpTooltip from "@/components/studios/HelpTooltip";
import CreditEstimate from "@/components/studios/CreditEstimate";

type StageType = "build" | "test" | "deploy" | "notify" | "custom";
type Trigger = "push" | "pull_request" | "schedule" | "manual";

interface PipelineStage {
  id: string;
  name: string;
  type: StageType;
  commands: string[];
  environment?: string;
  dependencies?: string[];
}

interface Pipeline {
  name: string;
  trigger: Trigger;
  branches?: string[];
  schedule?: string;
  stages: PipelineStage[];
}

export default function CICDPage() {
  const [pipeline, setPipeline] = useState<Pipeline>({
    name: "CI/CD Pipeline",
    trigger: "push",
    branches: ["main"],
    stages: [],
  });
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [generated, setGenerated] = useState(false);
  const [yamlConfig, setYamlConfig] = useState<string>("");

  function addStage() {
    const newStage: PipelineStage = {
      id: Date.now().toString(),
      name: `Stage ${pipeline.stages.length + 1}`,
      type: "build",
      commands: ["echo 'Hello World'"],
    };
    setPipeline({
      ...pipeline,
      stages: [...pipeline.stages, newStage],
    });
    setSelectedStage(newStage.id);
  }

  function removeStage(id: string) {
    setPipeline({
      ...pipeline,
      stages: pipeline.stages.filter((s) => s.id !== id),
    });
    if (selectedStage === id) {
      setSelectedStage(null);
    }
  }

  function updateStage(id: string, updates: Partial<PipelineStage>) {
    setPipeline({
      ...pipeline,
      stages: pipeline.stages.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    });
  }

  function addCommand(stageId: string) {
    const stage = pipeline.stages.find((s) => s.id === stageId);
    if (!stage) return;

    updateStage(stageId, {
      commands: [...stage.commands, ""],
    });
  }

  function updateCommand(stageId: string, index: number, command: string) {
    const stage = pipeline.stages.find((s) => s.id === stageId);
    if (!stage) return;

    const newCommands = [...stage.commands];
    newCommands[index] = command;
    updateStage(stageId, { commands: newCommands });
  }

  function removeCommand(stageId: string, index: number) {
    const stage = pipeline.stages.find((s) => s.id === stageId);
    if (!stage) return;

    updateStage(stageId, {
      commands: stage.commands.filter((_, i) => i !== index),
    });
  }

  function generateGitHubActions() {
    if (pipeline.stages.length === 0) {
      alert("Please add at least one stage");
      return;
    }

    let yaml = `name: ${pipeline.name}\n\n`;

    // Trigger configuration
    yaml += "on:\n";
    if (pipeline.trigger === "push") {
      yaml += "  push:\n";
      if (pipeline.branches && pipeline.branches.length > 0) {
        yaml += `    branches:\n`;
        pipeline.branches.forEach((branch) => {
          yaml += `      - ${branch}\n`;
        });
      }
    } else if (pipeline.trigger === "pull_request") {
      yaml += "  pull_request:\n";
      if (pipeline.branches && pipeline.branches.length > 0) {
        yaml += `    branches:\n`;
        pipeline.branches.forEach((branch) => {
          yaml += `      - ${branch}\n`;
        });
      }
    } else if (pipeline.trigger === "schedule") {
      yaml += "  schedule:\n";
      yaml += `    - cron: '${pipeline.schedule || "0 0 * * *"}'\n`;
    } else {
      yaml += "  workflow_dispatch:\n";
    }

    yaml += "\n";
    yaml += "jobs:\n";
    yaml += "  build:\n";
    yaml += "    runs-on: ubuntu-latest\n";
    yaml += "    steps:\n";

    pipeline.stages.forEach((stage, index) => {
      yaml += `      - name: ${stage.name}\n`;
      if (stage.environment) {
        yaml += `        env:\n`;
        yaml += `          ENVIRONMENT: ${stage.environment}\n`;
      }

      if (stage.type === "build") {
        yaml += `        run: |\n`;
        stage.commands.forEach((cmd) => {
          yaml += `          ${cmd}\n`;
        });
      } else if (stage.type === "test") {
        yaml += `        run: |\n`;
        stage.commands.forEach((cmd) => {
          yaml += `          ${cmd}\n`;
        });
      } else if (stage.type === "deploy") {
        yaml += `        run: |\n`;
        stage.commands.forEach((cmd) => {
          yaml += `          ${cmd}\n`;
        });
      } else if (stage.type === "notify") {
        yaml += `        run: |\n`;
        stage.commands.forEach((cmd) => {
          yaml += `          ${cmd}\n`;
        });
      } else {
        yaml += `        run: |\n`;
        stage.commands.forEach((cmd) => {
          yaml += `          ${cmd}\n`;
        });
      }
    });

    setYamlConfig(yaml);
    setGenerated(true);
  }

  function handleDownload() {
    if (!yamlConfig) return;
    const blob = new Blob([yamlConfig], { type: "text/yaml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = ".github/workflows/pipeline.yml";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleReset() {
    setPipeline({
      name: "CI/CD Pipeline",
      trigger: "push",
      branches: ["main"],
      stages: [],
    });
    setSelectedStage(null);
    setGenerated(false);
    setYamlConfig("");
  }

  const selectedStageData = pipeline.stages.find((s) => s.id === selectedStage);

  return (
    <SecureErrorBoundary studio="dev-studio">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-50">
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
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                  <GitBranch className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">CI/CD Pipeline Builder</h1>
                  <p className="text-base sm:text-lg text-slate-600 mt-1">Visual pipeline designer with GitHub Actions export</p>
                </div>
                <HelpTooltip
                  title="CI/CD Pipeline Builder"
                  content={
                    <div className="space-y-4">
                      <p>
                        The CI/CD Builder creates automated workflows that test your code and deploy it 
                        to the internet. CI/CD stands for Continuous Integration and Continuous Deployment.
                      </p>
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-2">Features:</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                          <li>Design pipeline workflows visually</li>
                          <li>Configure automated tests</li>
                          <li>Set up deployment steps</li>
                          <li>Export GitHub Actions workflows</li>
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
              <CreditEstimate toolId="dev-studio-cicd" />
            </div>

            {!generated ? (
              <div className="space-y-6">
                {/* Pipeline Configuration */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Pipeline Name</label>
                    <input
                      type="text"
                      value={pipeline.name}
                      onChange={(e) => setPipeline({ ...pipeline, name: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Trigger</label>
                    <select
                      value={pipeline.trigger}
                      onChange={(e) => setPipeline({ ...pipeline, trigger: e.target.value as Trigger })}
                      className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="push">On Push</option>
                      <option value="pull_request">On Pull Request</option>
                      <option value="schedule">Scheduled</option>
                      <option value="manual">Manual</option>
                    </select>
                  </div>
                </div>

                {pipeline.trigger === "push" || pipeline.trigger === "pull_request" ? (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Branches (comma-separated)</label>
                    <input
                      type="text"
                      value={pipeline.branches?.join(", ") || ""}
                      onChange={(e) =>
                        setPipeline({
                          ...pipeline,
                          branches: e.target.value.split(",").map((b) => b.trim()).filter(Boolean),
                        })
                      }
                      placeholder="main, develop"
                      className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                ) : pipeline.trigger === "schedule" ? (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Cron Schedule</label>
                    <input
                      type="text"
                      value={pipeline.schedule || ""}
                      onChange={(e) => setPipeline({ ...pipeline, schedule: e.target.value })}
                      placeholder="0 0 * * *"
                      className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                    />
                    <p className="text-xs text-slate-500 mt-1">Cron format: minute hour day month weekday</p>
                  </div>
                ) : null}

                {/* Stages */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-slate-700">Pipeline Stages</label>
                    <button
                      onClick={addStage}
                      className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Stage
                    </button>
                  </div>
                  <div className="space-y-3">
                    {pipeline.stages.map((stage) => (
                      <div
                        key={stage.id}
                        onClick={() => setSelectedStage(stage.id)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedStage === stage.id
                            ? "border-purple-500 bg-purple-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-semibold text-slate-900">{stage.name}</div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-1 rounded bg-purple-100 text-purple-800 text-xs font-medium">
                              {stage.type}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeStage(stage.id);
                              }}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <div className="text-xs text-slate-600">{stage.commands.length} commands</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stage Editor */}
                {selectedStageData && (
                  <div className="p-6 rounded-lg border border-slate-200 bg-slate-50">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Edit Stage</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Stage Name</label>
                        <input
                          type="text"
                          value={selectedStageData.name}
                          onChange={(e) => updateStage(selectedStageData.id, { name: e.target.value })}
                          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Stage Type</label>
                        <select
                          value={selectedStageData.type}
                          onChange={(e) => updateStage(selectedStageData.id, { type: e.target.value as StageType })}
                          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="build">Build</option>
                          <option value="test">Test</option>
                          <option value="deploy">Deploy</option>
                          <option value="notify">Notify</option>
                          <option value="custom">Custom</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Commands</label>
                        <div className="space-y-2">
                          {selectedStageData.commands.map((cmd, index) => (
                            <div key={index} className="flex gap-2">
                              <input
                                type="text"
                                value={cmd}
                                onChange={(e) => updateCommand(selectedStageData.id, index, e.target.value)}
                                placeholder="npm install"
                                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 font-mono"
                              />
                              <button
                                onClick={() => removeCommand(selectedStageData.id, index)}
                                className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => addCommand(selectedStageData.id)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                            Add Command
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Generate Button */}
                <div className="pt-4">
                  <button
                    onClick={generateGitHubActions}
                    disabled={pipeline.stages.length === 0}
                    className="w-full sm:w-auto px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Generate GitHub Actions Workflow
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-semibold">GitHub Actions workflow generated successfully!</span>
                </div>

                {/* YAML Preview */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">GitHub Actions Workflow</h3>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 max-h-96 overflow-y-auto">
                    <pre className="text-xs font-mono text-slate-700 whitespace-pre-wrap">{yamlConfig}</pre>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleDownload}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download Workflow File
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 rounded-lg font-semibold transition-colors"
                  >
                    Create Another Pipeline
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
