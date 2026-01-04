"use client";

import React from "react";
import Link from "next/link";
import ToolShell, { useToolInputs } from "@/components/tools/ToolShell";
import { getToolContract } from "@/lib/tools/loadContract";
import { createToolError } from "@/components/tools/ErrorPanel";
import type { ToolContract, ExecutionMode } from "@/components/tools/ToolShell";

const contract = getToolContract("data-classification-helper");

const examples = [
  {
    title: "Customer PII (GDPR)",
    inputs: {
      assetName: "Customer Personal Identifiable Information",
      sensitivity: "Confidential",
      compliance: ["GDPR"],
      impact: "High",
    },
  },
  {
    title: "Medical Records (HIPAA)",
    inputs: {
      assetName: "Patient Health Records",
      sensitivity: "Restricted",
      compliance: ["HIPAA"],
      impact: "High",
    },
  },
  {
    title: "Public Marketing Content",
    inputs: {
      assetName: "Website Content and Blog Posts",
      sensitivity: "Public",
      compliance: [],
      impact: "Low",
    },
  },
];

function DataClassificationForm() {
  const { inputs, setInputs } = useToolInputs();
  const assetName = typeof inputs.assetName === "string" ? inputs.assetName : "";
  const sensitivity =
    (inputs.sensitivity as "Public" | "Internal" | "Confidential" | "Restricted") || "Internal";
  const compliance = Array.isArray(inputs.compliance) ? (inputs.compliance as string[]) : [];
  const impact = (inputs.impact as "High" | "Medium" | "Low") || "Medium";

  const toggleCompliance = (comp: string) => {
    setInputs((prev) => {
      const current = Array.isArray(prev.compliance) ? ([...(prev.compliance as string[])] as string[]) : [];
      const next = current.includes(comp) ? current.filter((c) => c !== comp) : [...current, comp];
      return { ...prev, compliance: next };
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="assetName" className="block text-sm font-semibold text-slate-900">
          Data Asset Name <span className="text-red-600">*</span>
        </label>
        <input
          id="assetName"
          type="text"
          value={assetName}
          onChange={(e) => setInputs((prev) => ({ ...prev, assetName: e.target.value }))}
          maxLength={200}
          className="mt-2 w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500"
          placeholder="e.g., Customer PII, Sales figures"
        />
      </div>
      <div>
        <label htmlFor="sensitivity" className="block text-sm font-semibold text-slate-900">
          Sensitivity Level
        </label>
        <select
          id="sensitivity"
          value={sensitivity}
          onChange={(e) => setInputs((prev) => ({ ...prev, sensitivity: e.target.value }))}
          className="mt-2 w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500"
        >
          <option value="Public">Public</option>
          <option value="Internal">Internal</option>
          <option value="Confidential">Confidential</option>
          <option value="Restricted">Restricted</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-semibold text-slate-900 mb-2">Compliance Requirements</label>
        <div className="space-y-2">
          {["GDPR", "HIPAA", "PCI_DSS", "None"].map((comp) => (
            <label key={comp} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={compliance.includes(comp)}
                onChange={() => toggleCompliance(comp)}
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500"
              />
              <span className="text-sm text-slate-700">{comp}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <label htmlFor="impact" className="block text-sm font-semibold text-slate-900">
          Impact of Breach
        </label>
        <select
          id="impact"
          value={impact}
          onChange={(e) => setInputs((prev) => ({ ...prev, impact: e.target.value }))}
          className="mt-2 w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>
    </div>
  );
}

export default function DataClassificationHelperPage() {
  if (!contract) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <p className="text-red-600">Tool contract not found.</p>
      </div>
    );
  }

  const handleRun = async (mode: ExecutionMode, inputs: Record<string, unknown>) => {
    const asset = inputs.assetName as string;
    const sens = inputs.sensitivity as string;
    const comp = inputs.compliance as string[];
    const imp = inputs.impact as string;

    if (!asset || asset.trim().length === 0) {
      return {
        success: false,
        error: createToolError("validation_error", "data-classification-helper", { field: "assetName" }),
      };
    }

    const classification = `${sens}${comp.length > 0 ? ` - ${comp.join(", ")}` : ""}`;
    
    const controls: string[] = [];
    if (sens === "Restricted" || imp === "High") {
      controls.push("Encryption at rest");
      controls.push("Access control");
    }
    if (sens === "Confidential" || sens === "Restricted") {
      controls.push("Data masking");
      controls.push("Audit logging");
    }
    if (comp.includes("GDPR")) {
      controls.push("Right to erasure");
      controls.push("Data portability");
    }
    if (comp.includes("HIPAA")) {
      controls.push("PHI encryption");
      controls.push("Access logs");
    }

    const result = {
      assetName: asset,
      classification,
      sensitivity: sens,
      compliance: comp,
      impact: imp,
      recommendedControls: controls,
      handlingGuidance: {
        storage: sens === "Restricted" ? "Encrypted storage only" : sens === "Confidential" ? "Access-controlled storage" : "Standard storage",
        transmission: sens === "Restricted" || sens === "Confidential" ? "Encrypted in transit" : "Standard transmission",
        sharing: sens === "Restricted" ? "No external sharing" : sens === "Confidential" ? "NDA required" : "Standard sharing",
      },
    };

    return { success: true, output: JSON.stringify(result, null, 2) };
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      <nav className="mb-4">
        <Link href="/tools" className="text-sm font-semibold text-blue-700 hover:underline">
          ← Back to Tools
        </Link>
      </nav>

      <ToolShell contract={contract} onRun={handleRun} examples={examples}>
        <DataClassificationForm />
      </ToolShell>
    </div>
  );
}

