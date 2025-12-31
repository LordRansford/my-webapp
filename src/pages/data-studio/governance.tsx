"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, HelpCircle, Plus, Trash2, Download, CheckCircle2, Shield } from "lucide-react";
import SecureErrorBoundary from "@/components/studios/SecureErrorBoundary";
import StudioNavigation from "@/components/studios/StudioNavigation";
import HelpTooltip from "@/components/studios/HelpTooltip";
import CreditEstimate from "@/components/studios/CreditEstimate";

type PolicyCategory = "data_classification" | "access_control" | "retention" | "quality" | "privacy" | "security";
type PolicyStatus = "draft" | "active" | "archived";

interface GovernancePolicy {
  id: string;
  title: string;
  category: PolicyCategory;
  status: PolicyStatus;
  description: string;
  owner: string;
  lastReviewed?: string;
  content: string;
}

export default function GovernancePage() {
  const [frameworkName, setFrameworkName] = useState("");
  const [policies, setPolicies] = useState<GovernancePolicy[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<string | null>(null);
  const [generated, setGenerated] = useState(false);
  const [frameworkDoc, setFrameworkDoc] = useState<string>("");

  function addPolicy() {
    const newPolicy: GovernancePolicy = {
      id: Date.now().toString(),
      title: `Policy ${policies.length + 1}`,
      category: "data_classification",
      status: "draft",
      description: "",
      owner: "",
      content: "",
    };
    setPolicies([...policies, newPolicy]);
    setSelectedPolicy(newPolicy.id);
  }

  function removePolicy(id: string) {
    setPolicies(policies.filter((p) => p.id !== id));
    if (selectedPolicy === id) {
      setSelectedPolicy(null);
    }
  }

  function updatePolicy(id: string, updates: Partial<GovernancePolicy>) {
    setPolicies(policies.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  }

  function generateFramework() {
    if (!frameworkName.trim()) {
      alert("Please enter a framework name");
      return;
    }

    if (policies.length === 0) {
      alert("Please add at least one policy");
      return;
    }

    const doc = {
      framework: {
        name: frameworkName,
        generatedAt: new Date().toISOString(),
        totalPolicies: policies.length,
      },
      policies: policies.map((policy) => ({
        ...policy,
        lastReviewed: policy.lastReviewed || new Date().toISOString().split("T")[0],
      })),
      summary: {
        byCategory: policies.reduce((acc, p) => {
          acc[p.category] = (acc[p.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        byStatus: policies.reduce((acc, p) => {
          acc[p.status] = (acc[p.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        activePolicies: policies.filter((p) => p.status === "active").length,
      },
    };

    setFrameworkDoc(JSON.stringify(doc, null, 2));
    setGenerated(true);
  }

  function handleDownload() {
    if (!frameworkDoc) return;
    const blob = new Blob([frameworkDoc], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${frameworkName || "governance-framework"}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleReset() {
    setFrameworkName("");
    setPolicies([]);
    setSelectedPolicy(null);
    setGenerated(false);
    setFrameworkDoc("");
  }

  const selectedPolicyData = policies.find((p) => p.id === selectedPolicy);
  const categories = [
    { value: "data_classification", label: "Data Classification" },
    { value: "access_control", label: "Access Control" },
    { value: "retention", label: "Data Retention" },
    { value: "quality", label: "Data Quality" },
    { value: "privacy", label: "Privacy" },
    { value: "security", label: "Security" },
  ];

  return (
    <SecureErrorBoundary studio="data-studio">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50/30 to-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
          <header className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Link href="/data-studio" className="text-slate-600 hover:text-slate-900 transition-colors" aria-label="Back to Data Studio">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-slate-500 to-slate-600 text-white">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Data Governance Framework</h1>
                  <p className="text-base sm:text-lg text-slate-600 mt-1">Build and manage your data governance policies</p>
                </div>
                <HelpTooltip
                  title="Data Governance Framework"
                  content={
                    <div className="space-y-4">
                      <p>Create a comprehensive data governance framework with policies, standards, and procedures.</p>
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-2">Features:</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                          <li>Define governance policies</li>
                          <li>Organize by category</li>
                          <li>Track policy status</li>
                          <li>Manage policy lifecycle</li>
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
              <CreditEstimate toolId="data-studio-governance" />
            </div>

            {!generated ? (
              <div className="space-y-6">
                {/* Framework Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Framework Name</label>
                  <input
                    type="text"
                    value={frameworkName}
                    onChange={(e) => setFrameworkName(e.target.value)}
                    placeholder="My Data Governance Framework"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-slate-500 focus:ring-2 focus:ring-slate-500"
                  />
                </div>

                {/* Policies List */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-slate-700">Governance Policies</label>
                    <button
                      onClick={addPolicy}
                      className="flex items-center gap-2 px-3 py-1.5 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-sm font-semibold transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Policy
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {policies.map((policy) => {
                      const statusColors = {
                        draft: "bg-yellow-100 text-yellow-800",
                        active: "bg-green-100 text-green-800",
                        archived: "bg-slate-100 text-slate-800",
                      };
                      return (
                        <div
                          key={policy.id}
                          onClick={() => setSelectedPolicy(policy.id)}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            selectedPolicy === policy.id
                              ? "border-slate-500 bg-slate-50"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-semibold text-slate-900">{policy.title}</div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removePolicy(policy.id);
                              }}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 rounded bg-slate-100 text-slate-800 text-xs font-medium">
                              {categories.find((c) => c.value === policy.category)?.label}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[policy.status]}`}>
                              {policy.status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Policy Editor */}
                {selectedPolicyData && (
                  <div className="p-6 rounded-lg border border-slate-200 bg-slate-50">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Edit Policy</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Policy Title</label>
                        <input
                          type="text"
                          value={selectedPolicyData.title}
                          onChange={(e) => updatePolicy(selectedPolicyData.id, { title: e.target.value })}
                          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-slate-500 focus:ring-2 focus:ring-slate-500"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                          <select
                            value={selectedPolicyData.category}
                            onChange={(e) =>
                              updatePolicy(selectedPolicyData.id, { category: e.target.value as PolicyCategory })
                            }
                            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-slate-500 focus:ring-2 focus:ring-slate-500"
                          >
                            {categories.map((cat) => (
                              <option key={cat.value} value={cat.value}>
                                {cat.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                          <select
                            value={selectedPolicyData.status}
                            onChange={(e) =>
                              updatePolicy(selectedPolicyData.id, { status: e.target.value as PolicyStatus })
                            }
                            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-slate-500 focus:ring-2 focus:ring-slate-500"
                          >
                            <option value="draft">Draft</option>
                            <option value="active">Active</option>
                            <option value="archived">Archived</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                        <textarea
                          value={selectedPolicyData.description}
                          onChange={(e) => updatePolicy(selectedPolicyData.id, { description: e.target.value })}
                          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-slate-500 focus:ring-2 focus:ring-slate-500"
                          rows={3}
                          placeholder="Brief description of the policy..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Policy Content</label>
                        <textarea
                          value={selectedPolicyData.content}
                          onChange={(e) => updatePolicy(selectedPolicyData.id, { content: e.target.value })}
                          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-slate-500 focus:ring-2 focus:ring-slate-500"
                          rows={6}
                          placeholder="Enter the full policy content..."
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Owner</label>
                          <input
                            type="text"
                            value={selectedPolicyData.owner}
                            onChange={(e) => updatePolicy(selectedPolicyData.id, { owner: e.target.value })}
                            placeholder="Policy owner or team"
                            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-slate-500 focus:ring-2 focus:ring-slate-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Last Reviewed</label>
                          <input
                            type="date"
                            value={selectedPolicyData.lastReviewed || ""}
                            onChange={(e) => updatePolicy(selectedPolicyData.id, { lastReviewed: e.target.value })}
                            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-slate-500 focus:ring-2 focus:ring-slate-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Generate Button */}
                <div className="pt-4">
                  <button
                    onClick={generateFramework}
                    disabled={!frameworkName.trim() || policies.length === 0}
                    className="w-full sm:w-auto px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Generate Governance Framework
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-semibold">Data governance framework generated successfully!</span>
                </div>

                {/* Framework Preview */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Governance Framework Document</h3>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 max-h-96 overflow-y-auto">
                    <pre className="text-xs font-mono text-slate-700 whitespace-pre-wrap">{frameworkDoc}</pre>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleDownload}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download Framework
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 rounded-lg font-semibold transition-colors"
                  >
                    Create Another Framework
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
