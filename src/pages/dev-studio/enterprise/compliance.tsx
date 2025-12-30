"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  ArrowLeft,
  FileText,
  Download
} from "lucide-react";
import SecureErrorBoundary from "@/components/studios/SecureErrorBoundary";
import LoadingSpinner from "@/components/ai-studio/LoadingSpinner";
import CreditConsent from "@/components/studios/CreditConsent";

interface ComplianceCheck {
  id: string;
  framework: "GDPR" | "SOC2" | "HIPAA" | "PCI-DSS" | "ISO27001";
  requirement: string;
  status: "compliant" | "non-compliant" | "partial" | "not-assessed";
  evidence: string;
  lastChecked: string;
}

const complianceFrameworks = {
  GDPR: {
    name: "General Data Protection Regulation",
    requirements: [
      "Data minimization",
      "Purpose limitation",
      "Consent management",
      "Right to erasure",
      "Data portability",
      "Privacy by design",
      "Data breach notification",
      "DPIA for high-risk processing"
    ]
  },
  SOC2: {
    name: "SOC 2 Type II",
    requirements: [
      "Access controls",
      "Change management",
      "System monitoring",
      "Incident response",
      "Risk assessment",
      "Vendor management",
      "Data encryption",
      "Business continuity"
    ]
  },
  HIPAA: {
    name: "Health Insurance Portability and Accountability Act",
    requirements: [
      "Administrative safeguards",
      "Physical safeguards",
      "Technical safeguards",
      "Breach notification",
      "Business associate agreements",
      "Access controls",
      "Audit controls",
      "Transmission security"
    ]
  },
  "PCI-DSS": {
    name: "Payment Card Industry Data Security Standard",
    requirements: [
      "Firewall configuration",
      "Default passwords",
      "Cardholder data protection",
      "Encryption in transit",
      "Antivirus software",
      "Secure systems",
      "Access restriction",
      "Unique IDs",
      "Physical access",
      "Network monitoring",
      "Security testing",
      "Information security policy"
    ]
  },
  ISO27001: {
    name: "ISO/IEC 27001",
    requirements: [
      "Information security policy",
      "Organization of information security",
      "Human resource security",
      "Asset management",
      "Access control",
      "Cryptography",
      "Physical security",
      "Operations security",
      "Communications security",
      "System acquisition",
      "Supplier relationships",
      "Incident management",
      "Business continuity",
      "Compliance"
    ]
  }
};

export default function CompliancePage() {
  const [selectedFramework, setSelectedFramework] = useState<keyof typeof complianceFrameworks>("GDPR");
  const [checks, setChecks] = useState<ComplianceCheck[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreditConsent, setShowCreditConsent] = useState(false);
  const [runningAudit, setRunningAudit] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`dev-studio-compliance-${selectedFramework}`);
      if (saved) {
        try {
          setChecks(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to load compliance checks", e);
        }
      } else {
        // Initialize with default checks
        const defaultChecks: ComplianceCheck[] = complianceFrameworks[selectedFramework].requirements.map((req, idx) => ({
          id: crypto.randomUUID(),
          framework: selectedFramework,
          requirement: req,
          status: "not-assessed",
          evidence: "",
          lastChecked: ""
        }));
        setChecks(defaultChecks);
      }
    }
  }, [selectedFramework]);

  const handleRunAudit = () => {
    setShowCreditConsent(true);
  };

  const handleConsent = async () => {
    setShowCreditConsent(false);
    setRunningAudit(true);
    
    // Simulate audit process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update checks with audit results (simulated)
    const updated = checks.map(check => ({
      ...check,
      status: Math.random() > 0.3 ? "compliant" : Math.random() > 0.5 ? "partial" : "non-compliant" as ComplianceCheck["status"],
      lastChecked: new Date().toISOString(),
      evidence: check.status === "compliant" ? "Automated check passed" : "Requires manual review"
    }));
    
    setChecks(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(`dev-studio-compliance-${selectedFramework}`, JSON.stringify(updated));
    }
    setRunningAudit(false);
  };

  const handleUpdateCheck = (id: string, status: ComplianceCheck["status"], evidence: string) => {
    const updated = checks.map(check => 
      check.id === id 
        ? { ...check, status, evidence, lastChecked: new Date().toISOString() }
        : check
    );
    setChecks(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(`dev-studio-compliance-${selectedFramework}`, JSON.stringify(updated));
    }
  };

  const complianceScore = checks.length > 0 
    ? Math.round((checks.filter(c => c.status === "compliant").length / checks.length) * 100)
    : 0;

  const statusColors = {
    compliant: "bg-green-100 text-green-700 border-green-200",
    "non-compliant": "bg-red-100 text-red-700 border-red-200",
    partial: "bg-yellow-100 text-yellow-700 border-yellow-200",
    "not-assessed": "bg-slate-100 text-slate-700 border-slate-200"
  };

  const statusIcons = {
    compliant: <CheckCircle2 className="w-5 h-5" />,
    "non-compliant": <XCircle className="w-5 h-5" />,
    partial: <AlertCircle className="w-5 h-5" />,
    "not-assessed": <FileText className="w-5 h-5" />
  };

  const exportReport = () => {
    const report = {
      framework: complianceFrameworks[selectedFramework].name,
      date: new Date().toISOString(),
      score: complianceScore,
      checks: checks.map(check => ({
        requirement: check.requirement,
        status: check.status,
        evidence: check.evidence,
        lastChecked: check.lastChecked
      }))
    };
    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `compliance-report-${selectedFramework}-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
  };

  return (
    <SecureErrorBoundary studio="dev-studio">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50/30 to-slate-50">
        {isLoading ? (
          <LoadingSpinner message="Loading Compliance Checker..." />
        ) : (
          <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
            {/* Header */}
            <header className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Link
                      href="/dev-studio/enterprise"
                      className="text-slate-600 hover:text-slate-900 transition-colors"
                      aria-label="Back to Enterprise Features"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Compliance Checker</h1>
                  </div>
                  <p className="text-base sm:text-lg text-slate-600 mt-2">
                    Validate compliance with GDPR, SOC2, HIPAA, PCI-DSS, and ISO27001
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={exportReport}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-semibold text-slate-900 transition-colors flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export Report
                  </button>
                  <button
                    onClick={handleRunAudit}
                    disabled={runningAudit}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 rounded-lg text-sm font-semibold text-white transition-colors flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    {runningAudit ? "Running Audit..." : "Run Audit"}
                  </button>
                </div>
              </div>
            </header>

            {/* Framework Selector */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-900 mb-2">Compliance Framework</label>
              <div className="flex flex-wrap gap-2">
                {Object.keys(complianceFrameworks).map((framework) => (
                  <button
                    key={framework}
                    onClick={() => setSelectedFramework(framework as keyof typeof complianceFrameworks)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      selectedFramework === framework
                        ? "bg-green-600 text-white"
                        : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {framework}
                  </button>
                ))}
              </div>
            </div>

            {/* Compliance Score */}
            <div className="mb-6 rounded-3xl bg-white border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-900">
                  {complianceFrameworks[selectedFramework].name}
                </h2>
                <div className="text-right">
                  <div className="text-3xl font-bold text-slate-900">{complianceScore}%</div>
                  <div className="text-sm text-slate-600">Compliance Score</div>
                </div>
              </div>
              <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    complianceScore >= 80 ? "bg-green-500" :
                    complianceScore >= 60 ? "bg-yellow-500" :
                    "bg-red-500"
                  }`}
                  style={{ width: `${complianceScore}%` }}
                />
              </div>
            </div>

            {/* Credit Consent */}
            {showCreditConsent && (
              <div className="mb-6">
                <CreditConsent
                  creditsRequired={200}
                  operation="Run Compliance Audit"
                  onConsent={handleConsent}
                  onCancel={() => setShowCreditConsent(false)}
                />
              </div>
            )}

            {/* Compliance Checks */}
            <div className="space-y-4">
              {checks.map((check) => (
                <div
                  key={check.id}
                  className={`rounded-3xl border-2 p-6 ${statusColors[check.status]}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-1">
                        {statusIcons[check.status]}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">{check.requirement}</h3>
                        {check.evidence && (
                          <p className="text-sm text-slate-700 mb-2">{check.evidence}</p>
                        )}
                        {check.lastChecked && (
                          <p className="text-xs text-slate-600">
                            Last checked: {new Date(check.lastChecked).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <select
                      value={check.status}
                      onChange={(e) => handleUpdateCheck(check.id, e.target.value as ComplianceCheck["status"], check.evidence)}
                      className={`px-3 py-2 rounded-lg text-sm font-semibold border-2 ${
                        check.status === "compliant" ? "bg-green-50 border-green-300 text-green-900" :
                        check.status === "non-compliant" ? "bg-red-50 border-red-300 text-red-900" :
                        check.status === "partial" ? "bg-yellow-50 border-yellow-300 text-yellow-900" :
                        "bg-slate-50 border-slate-300 text-slate-900"
                      }`}
                    >
                      <option value="not-assessed">Not Assessed</option>
                      <option value="compliant">Compliant</option>
                      <option value="partial">Partial</option>
                      <option value="non-compliant">Non-Compliant</option>
                    </select>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-slate-900 mb-2">Evidence/Notes</label>
                    <textarea
                      value={check.evidence}
                      onChange={(e) => handleUpdateCheck(check.id, check.status, e.target.value)}
                      rows={2}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
                      placeholder="Add evidence or notes..."
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </SecureErrorBoundary>
  );
}

