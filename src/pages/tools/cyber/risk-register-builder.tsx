"use client";

import React, { useState } from "react";
import Link from "next/link";
import ToolShell from "@/components/tools/ToolShell";
import { getToolContract } from "@/lib/tools/loadContract";
import { createToolError } from "@/components/tools/ErrorPanel";
import type { ToolContract, ExecutionMode } from "@/components/tools/ToolShell";

const contract = getToolContract("risk-register-builder");

const examples = [
  {
    title: "Data Breach Risk",
    inputs: {
      risks: [
        {
          id: "1",
          description: "Unauthorized access to customer PII database",
          likelihood: "Medium",
          impact: "High",
          mitigations: "Encryption at rest, access controls, audit logging, regular security audits",
        },
        {
          id: "2",
          description: "Third-party vendor data breach",
          likelihood: "Low",
          impact: "High",
          mitigations: "Vendor security assessments, contractual requirements, monitoring",
        },
        {
          id: "3",
          description: "Employee accidentally shares sensitive data",
          likelihood: "High",
          impact: "Medium",
          mitigations: "Data loss prevention tools, training, access controls",
        },
      ],
    },
  },
  {
    title: "System Availability Risks",
    inputs: {
      risks: [
        {
          id: "1",
          description: "Cloud provider outage affecting production",
          likelihood: "Low",
          impact: "High",
          mitigations: "Multi-region deployment, disaster recovery plan",
        },
        {
          id: "2",
          description: "Database performance degradation",
          likelihood: "Medium",
          impact: "Medium",
          mitigations: "Performance monitoring, query optimization, capacity planning",
        },
      ],
    },
  },
  {
    title: "Compliance Risks",
    inputs: {
      risks: [
        {
          id: "1",
          description: "GDPR compliance violation",
          likelihood: "Medium",
          impact: "High",
          mitigations: "Regular compliance audits, data protection impact assessments, privacy by design",
        },
        {
          id: "2",
          description: "PCI DSS non-compliance",
          likelihood: "Low",
          impact: "High",
          mitigations: "Annual audits, secure payment processing, network segmentation",
        },
      ],
    },
  },
];

interface Risk {
  id: string;
  description: string;
  likelihood: "Low" | "Medium" | "High";
  impact: "Low" | "Medium" | "High";
  mitigations: string;
}

export default function RiskRegisterBuilderPage() {
  const [risks, setRisks] = useState<Risk[]>([
    { id: "1", description: "", likelihood: "Medium", impact: "Medium", mitigations: "" },
  ]);

  if (!contract) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <p className="text-red-600">Tool contract not found.</p>
      </div>
    );
  }

  const handleRun = async (mode: ExecutionMode, inputs: Record<string, unknown>) => {
    const risksInput = inputs.risks as Risk[];
    if (!Array.isArray(risksInput) || risksInput.length === 0) {
      return {
        success: false,
        error: createToolError("validation_error", "risk-register-builder", { message: "At least one risk is required" }),
      };
    }

    if (risksInput.length > 50) {
      return {
        success: false,
        error: createToolError("too_many_risks", "risk-register-builder", { message: "Maximum 50 risks allowed" }),
      };
    }

    // Calculate priority scores
    const priorityMap = { Low: 1, Medium: 2, High: 3 };
    const prioritized = risksInput
      .map((risk) => ({
        ...risk,
        score: priorityMap[risk.likelihood] * priorityMap[risk.impact],
      }))
      .sort((a, b) => b.score - a.score);

    const result = {
      totalRisks: prioritized.length,
      risks: prioritized,
      summary: {
        high: prioritized.filter((r) => r.score >= 6).length,
        medium: prioritized.filter((r) => r.score >= 3 && r.score < 6).length,
        low: prioritized.filter((r) => r.score < 3).length,
      },
    };

    return { success: true, output: JSON.stringify(result, null, 2) };
  };

  const addRisk = () => {
    setRisks([...risks, { id: String(risks.length + 1), description: "", likelihood: "Medium", impact: "Medium", mitigations: "" }]);
  };

  const updateRisk = (id: string, field: keyof Risk, value: string | "Low" | "Medium" | "High") => {
    setRisks(risks.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const removeRisk = (id: string) => {
    setRisks(risks.filter((r) => r.id !== id));
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      <nav className="mb-4">
        <Link href="/tools" className="text-sm font-semibold text-blue-700 hover:underline">
          ← Back to Tools
        </Link>
      </nav>

      <ToolShell contract={contract} onRun={handleRun} examples={examples} initialInputs={{ risks }}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Risks</h3>
            <button
              type="button"
              onClick={addRisk}
              className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800"
            >
              + Add Risk
            </button>
          </div>
          {risks.map((risk) => (
            <div key={risk.id} className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600">Risk #{risk.id}</span>
                <button
                  type="button"
                  onClick={() => removeRisk(risk.id)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-900">Description</label>
                  <textarea
                    value={risk.description}
                    onChange={(e) => updateRisk(risk.id, "description", e.target.value)}
                    rows={2}
                    className="mt-1 w-full rounded border border-slate-300 p-2 text-sm"
                    placeholder="Describe the risk..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-900">Likelihood</label>
                    <select
                      value={risk.likelihood}
                      onChange={(e) => updateRisk(risk.id, "likelihood", e.target.value as "Low" | "Medium" | "High")}
                      className="mt-1 w-full rounded border border-slate-300 p-2 text-sm"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-900">Impact</label>
                    <select
                      value={risk.impact}
                      onChange={(e) => updateRisk(risk.id, "impact", e.target.value as "Low" | "Medium" | "High")}
                      className="mt-1 w-full rounded border border-slate-300 p-2 text-sm"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-900">Mitigations</label>
                  <textarea
                    value={risk.mitigations}
                    onChange={(e) => updateRisk(risk.id, "mitigations", e.target.value)}
                    rows={2}
                    className="mt-1 w-full rounded border border-slate-300 p-2 text-sm"
                    placeholder="Describe mitigations..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </ToolShell>
    </div>
  );
}

