"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Shield, HelpCircle, CheckCircle2, Download, AlertCircle } from "lucide-react";
import SecureErrorBoundary from "@/components/studios/SecureErrorBoundary";
import StudioNavigation from "@/components/studios/StudioNavigation";
import HelpTooltip from "@/components/studios/HelpTooltip";
import CreditEstimate from "@/components/studios/CreditEstimate";

type DataCategory = "personal" | "sensitive" | "biometric" | "financial" | "health" | "location";
type ProcessingPurpose = "service_delivery" | "analytics" | "marketing" | "legal_compliance" | "security";
type LegalBasis = "consent" | "contract" | "legal_obligation" | "vital_interests" | "public_task" | "legitimate_interests";

interface PrivacyAssessment {
  projectName: string;
  dataCategories: DataCategory[];
  processingPurposes: ProcessingPurpose[];
  legalBasis: LegalBasis;
  dataSubjects: string[];
  dataRetention: string;
  dataSharing: boolean;
  thirdParties: string[];
  securityMeasures: string[];
  risks: Array<{ description: string; likelihood: "low" | "medium" | "high"; impact: "low" | "medium" | "high" }>;
}

export default function PrivacyPage() {
  const [assessment, setAssessment] = useState<PrivacyAssessment>({
    projectName: "",
    dataCategories: [],
    processingPurposes: [],
    legalBasis: "consent",
    dataSubjects: [],
    dataRetention: "",
    dataSharing: false,
    thirdParties: [],
    securityMeasures: [],
    risks: [],
  });
  const [generated, setGenerated] = useState(false);
  const [assessmentReport, setAssessmentReport] = useState<string>("");

  function calculateRiskScore(likelihood: string, impact: string): number {
    const likelihoodScores = { low: 1, medium: 2, high: 3 };
    const impactScores = { low: 1, medium: 2, high: 3 };
    return likelihoodScores[likelihood as keyof typeof likelihoodScores] * impactScores[impact as keyof typeof impactScores];
  }

  function generateAssessment() {
    if (!assessment.projectName.trim()) {
      alert("Please enter a project name");
      return;
    }

    if (assessment.dataCategories.length === 0) {
      alert("Please select at least one data category");
      return;
    }

    const report = {
      assessment: {
        projectName: assessment.projectName,
        assessmentDate: new Date().toISOString(),
        legalBasis: assessment.legalBasis,
      },
      dataProcessing: {
        categories: assessment.dataCategories,
        purposes: assessment.processingPurposes,
        dataSubjects: assessment.dataSubjects,
        retention: assessment.dataRetention,
        sharing: assessment.dataSharing,
        thirdParties: assessment.thirdParties,
      },
      securityMeasures: assessment.securityMeasures,
      risks: assessment.risks.map((risk) => ({
        ...risk,
        riskScore: calculateRiskScore(risk.likelihood, risk.impact),
        riskLevel:
          calculateRiskScore(risk.likelihood, risk.impact) >= 6
            ? "high"
            : calculateRiskScore(risk.likelihood, risk.impact) >= 4
            ? "medium"
            : "low",
      })),
      compliance: {
        gdpr: assessment.legalBasis !== undefined,
        ccpa: assessment.dataCategories.includes("personal"),
        recommendations: generateRecommendations(),
      },
    };

    setAssessmentReport(JSON.stringify(report, null, 2));
    setGenerated(true);
  }

  function generateRecommendations(): string[] {
    const recommendations: string[] = [];
    if (assessment.dataCategories.includes("sensitive") || assessment.dataCategories.includes("biometric")) {
      recommendations.push("Implement enhanced security measures for sensitive data");
    }
    if (assessment.dataSharing && assessment.thirdParties.length > 0) {
      recommendations.push("Ensure data processing agreements are in place with all third parties");
    }
    if (assessment.legalBasis === "consent") {
      recommendations.push("Implement clear consent mechanisms and allow withdrawal of consent");
    }
    if (assessment.risks.some((r) => calculateRiskScore(r.likelihood, r.impact) >= 6)) {
      recommendations.push("Conduct a detailed risk assessment for high-risk processing activities");
    }
    return recommendations;
  }

  function handleDownload() {
    if (!assessmentReport) return;
    const blob = new Blob([assessmentReport], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${assessment.projectName || "privacy-assessment"}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleReset() {
    setAssessment({
      projectName: "",
      dataCategories: [],
      processingPurposes: [],
      legalBasis: "consent",
      dataSubjects: [],
      dataRetention: "",
      dataSharing: false,
      thirdParties: [],
      securityMeasures: [],
      risks: [],
    });
    setGenerated(false);
    setAssessmentReport("");
  }

  const dataCategories = [
    { value: "personal", label: "Personal Data" },
    { value: "sensitive", label: "Sensitive Personal Data" },
    { value: "biometric", label: "Biometric Data" },
    { value: "financial", label: "Financial Data" },
    { value: "health", label: "Health Data" },
    { value: "location", label: "Location Data" },
  ];

  const processingPurposes = [
    { value: "service_delivery", label: "Service Delivery" },
    { value: "analytics", label: "Analytics" },
    { value: "marketing", label: "Marketing" },
    { value: "legal_compliance", label: "Legal Compliance" },
    { value: "security", label: "Security" },
  ];

  const legalBases = [
    { value: "consent", label: "Consent" },
    { value: "contract", label: "Contract" },
    { value: "legal_obligation", label: "Legal Obligation" },
    { value: "vital_interests", label: "Vital Interests" },
    { value: "public_task", label: "Public Task" },
    { value: "legitimate_interests", label: "Legitimate Interests" },
  ];

  return (
    <SecureErrorBoundary studio="data-studio">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50/30 to-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
          <header className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Link href="/data-studio" className="text-slate-600 hover:text-slate-900 transition-colors" aria-label="Back to Data Studio">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 text-white">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Privacy Impact Assessment</h1>
                  <p className="text-base sm:text-lg text-slate-600 mt-1">Assess and manage data privacy risks</p>
                </div>
                <HelpTooltip
                  title="Privacy Impact Assessment"
                  content={
                    <div className="space-y-4">
                      <p>Conduct privacy impact assessments to evaluate and manage privacy risks in data processing activities.</p>
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-2">Features:</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                          <li>Identify data categories and processing purposes</li>
                          <li>Assess privacy risks</li>
                          <li>GDPR and CCPA compliance checking</li>
                          <li>Generate compliance recommendations</li>
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
              <CreditEstimate toolId="data-studio-privacy" />
            </div>

            {!generated ? (
              <div className="space-y-6">
                {/* Project Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Project Name</label>
                  <input
                    type="text"
                    value={assessment.projectName}
                    onChange={(e) => setAssessment({ ...assessment, projectName: e.target.value })}
                    placeholder="My Data Processing Project"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                {/* Data Categories */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Data Categories</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {dataCategories.map((category) => (
                      <label
                        key={category.value}
                        className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={assessment.dataCategories.includes(category.value as DataCategory)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setAssessment({
                                ...assessment,
                                dataCategories: [...assessment.dataCategories, category.value as DataCategory],
                              });
                            } else {
                              setAssessment({
                                ...assessment,
                                dataCategories: assessment.dataCategories.filter((c) => c !== category.value),
                              });
                            }
                          }}
                          className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                        />
                        <span className="text-sm text-slate-700">{category.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Processing Purposes */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Processing Purposes</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {processingPurposes.map((purpose) => (
                      <label
                        key={purpose.value}
                        className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={assessment.processingPurposes.includes(purpose.value as ProcessingPurpose)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setAssessment({
                                ...assessment,
                                processingPurposes: [...assessment.processingPurposes, purpose.value as ProcessingPurpose],
                              });
                            } else {
                              setAssessment({
                                ...assessment,
                                processingPurposes: assessment.processingPurposes.filter((p) => p !== purpose.value),
                              });
                            }
                          }}
                          className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                        />
                        <span className="text-sm text-slate-700">{purpose.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Legal Basis */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Legal Basis (GDPR)</label>
                  <select
                    value={assessment.legalBasis}
                    onChange={(e) => setAssessment({ ...assessment, legalBasis: e.target.value as LegalBasis })}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                  >
                    {legalBases.map((basis) => (
                      <option key={basis.value} value={basis.value}>
                        {basis.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Data Subjects */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Data Subjects (comma-separated)</label>
                  <input
                    type="text"
                    value={assessment.dataSubjects.join(", ")}
                    onChange={(e) =>
                      setAssessment({
                        ...assessment,
                        dataSubjects: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    placeholder="Employees, Customers, Partners"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                {/* Data Retention */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Data Retention Period</label>
                  <input
                    type="text"
                    value={assessment.dataRetention}
                    onChange={(e) => setAssessment({ ...assessment, dataRetention: e.target.value })}
                    placeholder="e.g., 7 years, Until account deletion"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                {/* Data Sharing */}
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={assessment.dataSharing}
                      onChange={(e) => setAssessment({ ...assessment, dataSharing: e.target.checked })}
                      className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                    />
                    <span className="text-sm font-medium text-slate-700">Data is shared with third parties</span>
                  </label>
                </div>

                {assessment.dataSharing && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Third Parties (comma-separated)</label>
                    <input
                      type="text"
                      value={assessment.thirdParties.join(", ")}
                      onChange={(e) =>
                        setAssessment({
                          ...assessment,
                          thirdParties: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                        })
                      }
                      placeholder="Cloud Provider, Analytics Service, Payment Processor"
                      className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                )}

                {/* Security Measures */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Security Measures (one per line)</label>
                  <textarea
                    value={assessment.securityMeasures.join("\n")}
                    onChange={(e) =>
                      setAssessment({
                        ...assessment,
                        securityMeasures: e.target.value.split("\n").filter(Boolean),
                      })
                    }
                    placeholder="Encryption at rest&#10;Encryption in transit&#10;Access controls&#10;Regular security audits"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500"
                    rows={4}
                  />
                </div>

                {/* Generate Button */}
                <div className="pt-4">
                  <button
                    onClick={generateAssessment}
                    disabled={!assessment.projectName.trim() || assessment.dataCategories.length === 0}
                    className="w-full sm:w-auto px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Generate Privacy Impact Assessment
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-semibold">Privacy impact assessment generated successfully!</span>
                </div>

                {/* Assessment Preview */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Privacy Impact Assessment Report</h3>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 max-h-96 overflow-y-auto">
                    <pre className="text-xs font-mono text-slate-700 whitespace-pre-wrap">{assessmentReport}</pre>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleDownload}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download Assessment
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 rounded-lg font-semibold transition-colors"
                  >
                    Create Another Assessment
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
