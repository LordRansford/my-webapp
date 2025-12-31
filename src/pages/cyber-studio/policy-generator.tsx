"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Lock, HelpCircle, Plus, Trash2, Download, CheckCircle2, FileText } from "lucide-react";
import SecureErrorBoundary from "@/components/studios/SecureErrorBoundary";
import StudioNavigation from "@/components/studios/StudioNavigation";
import HelpTooltip from "@/components/studios/HelpTooltip";
import CreditEstimate from "@/components/studios/CreditEstimate";

type PolicyType = "access_control" | "data_protection" | "incident_response" | "password" | "network_security" | "acceptable_use";
type PolicySection = "purpose" | "scope" | "policy" | "enforcement" | "review";

interface PolicySectionContent {
  id: string;
  section: PolicySection;
  content: string;
}

interface Policy {
  name: string;
  type: PolicyType;
  sections: PolicySectionContent[];
}

const policyTemplates: Record<PolicyType, Record<PolicySection, string>> = {
  access_control: {
    purpose: "This policy defines the access control requirements for all information systems and data resources.",
    scope: "This policy applies to all employees, contractors, and third parties who access organizational information systems.",
    policy: "Access to information systems shall be granted based on the principle of least privilege. All access requests must be approved by the appropriate authority.",
    enforcement: "Violations of this policy may result in disciplinary action, up to and including termination of employment.",
    review: "This policy shall be reviewed annually or when significant changes occur in the organization's structure or technology.",
  },
  data_protection: {
    purpose: "This policy establishes requirements for protecting sensitive and confidential data.",
    scope: "This policy applies to all data classified as confidential, restricted, or containing personal information.",
    policy: "All sensitive data must be encrypted at rest and in transit. Data access must be logged and monitored.",
    enforcement: "Non-compliance with this policy may result in legal action and disciplinary measures.",
    review: "This policy shall be reviewed annually to ensure compliance with applicable regulations.",
  },
  incident_response: {
    purpose: "This policy defines the procedures for responding to security incidents.",
    scope: "This policy applies to all security incidents affecting organizational information systems or data.",
    policy: "All security incidents must be reported immediately to the security team. Response procedures must be followed as defined in the incident response playbook.",
    enforcement: "Failure to report incidents in a timely manner may result in disciplinary action.",
    review: "This policy shall be reviewed after each major incident and updated as necessary.",
  },
  password: {
    purpose: "This policy establishes password requirements and management procedures.",
    scope: "This policy applies to all passwords used to access organizational information systems.",
    policy: "Passwords must be at least 12 characters long, contain uppercase, lowercase, numbers, and special characters. Passwords must be changed every 90 days.",
    enforcement: "Accounts with non-compliant passwords may be disabled until compliance is achieved.",
    review: "This policy shall be reviewed annually to align with current security best practices.",
  },
  network_security: {
    purpose: "This policy defines network security requirements and controls.",
    scope: "This policy applies to all network infrastructure and network-connected devices.",
    policy: "All network traffic must be monitored and logged. Firewalls must be configured according to security standards. Unauthorized network access is prohibited.",
    enforcement: "Violations of network security policies may result in immediate termination of network access.",
    review: "This policy shall be reviewed annually or when network infrastructure changes occur.",
  },
  acceptable_use: {
    purpose: "This policy defines acceptable use of organizational information systems and resources.",
    scope: "This policy applies to all users of organizational information systems, including employees, contractors, and third parties.",
    policy: "Information systems shall be used only for authorized business purposes. Prohibited activities include unauthorized access, data theft, and system disruption.",
    enforcement: "Violations of this policy may result in disciplinary action, legal action, or termination of access.",
    review: "This policy shall be reviewed annually to ensure it remains current with organizational needs and legal requirements.",
  },
};

export default function PolicyGeneratorPage() {
  const [policy, setPolicy] = useState<Policy>({
    name: "Security Policy",
    type: "access_control",
    sections: [
      { id: "1", section: "purpose", content: "" },
      { id: "2", section: "scope", content: "" },
      { id: "3", section: "policy", content: "" },
      { id: "4", section: "enforcement", content: "" },
      { id: "5", section: "review", content: "" },
    ],
  });
  const [generated, setGenerated] = useState(false);
  const [policyDoc, setPolicyDoc] = useState<string>("");

  function loadTemplate() {
    const template = policyTemplates[policy.type];
    setPolicy({
      ...policy,
      sections: policy.sections.map((s) => ({
        ...s,
        content: template[s.section],
      })),
    });
  }

  function updateSection(id: string, content: string) {
    setPolicy({
      ...policy,
      sections: policy.sections.map((s) => (s.id === id ? { ...s, content } : s)),
    });
  }

  function generatePolicy() {
    if (!policy.name.trim()) {
      alert("Please enter a policy name");
      return;
    }

    const doc = {
      policy: {
        name: policy.name,
        type: policy.type,
        version: "1.0",
        effectiveDate: new Date().toISOString().split("T")[0],
        lastReviewed: new Date().toISOString().split("T")[0],
      },
      sections: policy.sections.map((s) => ({
        section: s.section,
        title: s.section.charAt(0).toUpperCase() + s.section.slice(1).replace("_", " "),
        content: s.content,
      })),
      generatedAt: new Date().toISOString(),
    };

    // Format as readable document
    let formattedDoc = `# ${doc.policy.name}\n\n`;
    formattedDoc += `**Policy Type:** ${doc.policy.type.replace("_", " ")}\n`;
    formattedDoc += `**Version:** ${doc.policy.version}\n`;
    formattedDoc += `**Effective Date:** ${doc.policy.effectiveDate}\n`;
    formattedDoc += `**Last Reviewed:** ${doc.policy.lastReviewed}\n\n`;
    formattedDoc += "---\n\n";

    doc.sections.forEach((section) => {
      formattedDoc += `## ${section.title}\n\n`;
      formattedDoc += `${section.content}\n\n`;
    });

    setPolicyDoc(formattedDoc);
    setGenerated(true);
  }

  function handleDownload() {
    if (!policyDoc) return;
    const blob = new Blob([policyDoc], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${policy.name || "security-policy"}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleReset() {
    setPolicy({
      name: "Security Policy",
      type: "access_control",
      sections: [
        { id: "1", section: "purpose", content: "" },
        { id: "2", section: "scope", content: "" },
        { id: "3", section: "policy", content: "" },
        { id: "4", section: "enforcement", content: "" },
        { id: "5", section: "review", content: "" },
      ],
    });
    setGenerated(false);
    setPolicyDoc("");
  }

  const policyTypes = [
    { value: "access_control", label: "Access Control" },
    { value: "data_protection", label: "Data Protection" },
    { value: "incident_response", label: "Incident Response" },
    { value: "password", label: "Password" },
    { value: "network_security", label: "Network Security" },
    { value: "acceptable_use", label: "Acceptable Use" },
  ];

  const sectionLabels: Record<PolicySection, string> = {
    purpose: "Purpose",
    scope: "Scope",
    policy: "Policy Statement",
    enforcement: "Enforcement",
    review: "Review",
  };

  return (
    <SecureErrorBoundary studio="cyber-studio">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50/30 to-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
          <header className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Link href="/cyber-studio" className="text-slate-600 hover:text-slate-900 transition-colors" aria-label="Back to Cyber Studio">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-slate-500 to-slate-600 text-white">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Security Policy Generator</h1>
                  <p className="text-base sm:text-lg text-slate-600 mt-1">Generate security policies from templates</p>
                </div>
                <HelpTooltip
                  title="Security Policy Generator"
                  content={
                    <div className="space-y-4">
                      <p>Generate comprehensive security policies using templates and customize them for your organization.</p>
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-2">Features:</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                          <li>Policy templates for common security domains</li>
                          <li>Customizable policy sections</li>
                          <li>Export as Markdown document</li>
                          <li>Version tracking</li>
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
              <CreditEstimate toolId="cyber-studio-policy-generator" />
            </div>

            {!generated ? (
              <div className="space-y-6">
                {/* Policy Configuration */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Policy Name</label>
                    <input
                      type="text"
                      value={policy.name}
                      onChange={(e) => setPolicy({ ...policy, name: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-slate-500 focus:ring-2 focus:ring-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Policy Type</label>
                    <select
                      value={policy.type}
                      onChange={(e) => {
                        setPolicy({ ...policy, type: e.target.value as PolicyType });
                        // Reset sections when type changes
                        setPolicy((prev) => ({
                          ...prev,
                          sections: prev.sections.map((s) => ({ ...s, content: "" })),
                        }));
                      }}
                      className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-slate-500 focus:ring-2 focus:ring-slate-500"
                    >
                      {policyTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Load Template Button */}
                <div>
                  <button
                    onClick={loadTemplate}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-sm font-semibold transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    Load Template
                  </button>
                  <p className="text-xs text-slate-500 mt-1">Load a template for the selected policy type</p>
                </div>

                {/* Policy Sections */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Policy Sections</label>
                  <div className="space-y-4">
                    {policy.sections.map((section) => (
                      <div key={section.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                        <label className="block text-sm font-semibold text-slate-900 mb-2">
                          {sectionLabels[section.section]}
                        </label>
                        <textarea
                          value={section.content}
                          onChange={(e) => updateSection(section.id, e.target.value)}
                          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-slate-500 focus:ring-2 focus:ring-slate-500"
                          rows={4}
                          placeholder={`Enter ${sectionLabels[section.section].toLowerCase()} content...`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <div className="pt-4">
                  <button
                    onClick={generatePolicy}
                    disabled={!policy.name.trim()}
                    className="w-full sm:w-auto px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Generate Policy Document
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-semibold">Security policy generated successfully!</span>
                </div>

                {/* Policy Preview */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Policy Document</h3>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 max-h-96 overflow-y-auto">
                    <pre className="text-sm font-mono text-slate-700 whitespace-pre-wrap">{policyDoc}</pre>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleDownload}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download Policy
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 rounded-lg font-semibold transition-colors"
                  >
                    Create Another Policy
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
