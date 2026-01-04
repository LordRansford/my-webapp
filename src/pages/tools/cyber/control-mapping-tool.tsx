"use client";

import React from "react";
import Link from "next/link";
import ToolShell, { useToolInputs } from "@/components/tools/ToolShell";
import { getToolContract } from "@/lib/tools/loadContract";
import { createToolError } from "@/components/tools/ErrorPanel";
import type { ToolContract, ExecutionMode } from "@/components/tools/ToolShell";

const contract = getToolContract("control-mapping-tool");

const examples = [
  {
    title: "MFA Control → NIST CSF",
    inputs: {
      controlDescription: "Multi-factor authentication for all users",
      framework: "NIST_CSF",
      mapping: "PR.AC-7",
    },
  },
  {
    title: "Encryption Control → ISO 27001",
    inputs: {
      controlDescription: "Encryption at rest for sensitive data",
      framework: "ISO_27001",
      mapping: "A.10.1.1",
    },
  },
  {
    title: "Access Control → CIS Controls",
    inputs: {
      controlDescription: "Access control policies",
      framework: "CIS_Controls",
      mapping: "CIS 5.1",
    },
  },
];

const frameworkMappings: Record<string, Record<string, string>> = {
  NIST_CSF: {
    "Multi-factor authentication": "PR.AC-7",
    "Encryption at rest": "PR.DS-1",
    "Access control": "PR.AC-1",
    "Audit logging": "DE.AE-1",
  },
  ISO_27001: {
    "Multi-factor authentication": "A.9.4.2",
    "Encryption at rest": "A.10.1.1",
    "Access control": "A.9.1.1",
    "Audit logging": "A.12.4.1",
  },
  CIS_Controls: {
    "Multi-factor authentication": "CIS 6.5",
    "Encryption at rest": "CIS 3.4",
    "Access control": "CIS 5.1",
    "Audit logging": "CIS 8.1",
  },
};

function ControlMappingForm() {
  const { inputs, setInputs } = useToolInputs();
  const controlDescription = typeof inputs.controlDescription === "string" ? inputs.controlDescription : "";
  const framework = (inputs.framework as "NIST_CSF" | "ISO_27001" | "CIS_Controls") || "NIST_CSF";
  const mapping = typeof inputs.mapping === "string" ? inputs.mapping : "";

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="controlDescription" className="block text-sm font-semibold text-slate-900">
          Control Description <span className="text-red-600">*</span>
        </label>
        <textarea
          id="controlDescription"
          value={controlDescription}
          onChange={(e) => setInputs((prev) => ({ ...prev, controlDescription: e.target.value }))}
          rows={3}
          maxLength={500}
          className="mt-2 w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500"
          placeholder="e.g., Multi-factor authentication for all users"
        />
      </div>
      <div>
        <label htmlFor="framework" className="block text-sm font-semibold text-slate-900">
          Framework
        </label>
        <select
          id="framework"
          value={framework}
          onChange={(e) => setInputs((prev) => ({ ...prev, framework: e.target.value }))}
          className="mt-2 w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500"
        >
          <option value="NIST_CSF">NIST CSF</option>
          <option value="ISO_27001">ISO 27001</option>
          <option value="CIS_Controls">CIS Controls</option>
        </select>
      </div>
      <div>
        <label htmlFor="mapping" className="block text-sm font-semibold text-slate-900">
          Framework Mapping
        </label>
        <input
          id="mapping"
          type="text"
          value={mapping}
          onChange={(e) => setInputs((prev) => ({ ...prev, mapping: e.target.value }))}
          maxLength={200}
          className="mt-2 w-full rounded-lg border border-slate-300 p-3 text-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500"
          placeholder="e.g., PR.AC-7 (will be suggested if control matches known patterns)"
        />
      </div>
    </div>
  );
}

export default function ControlMappingToolPage() {
  if (!contract) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <p className="text-red-600">Tool contract not found.</p>
      </div>
    );
  }

  const handleRun = async (mode: ExecutionMode, inputs: Record<string, unknown>) => {
    const control = inputs.controlDescription as string;
    const fw = inputs.framework as string;
    const map = inputs.mapping as string;

    if (!control || control.trim().length === 0) {
      return {
        success: false,
        error: createToolError("validation_error", "control-mapping-tool", { field: "controlDescription" }),
      };
    }

    if (!["NIST_CSF", "ISO_27001", "CIS_Controls"].includes(fw)) {
      return {
        success: false,
        error: createToolError("unsupported_framework", "control-mapping-tool", { message: "Framework must be NIST_CSF, ISO_27001, or CIS_Controls" }),
      };
    }

    const frameworkMap = frameworkMappings[fw] || {};
    const suggestedMapping = Object.entries(frameworkMap).find(([key]) => control.toLowerCase().includes(key.toLowerCase()))?.[1] || map || "Manual mapping required";

    const result = {
      controlDescription: control,
      framework: fw,
      mapping: map || suggestedMapping,
      status: "Implemented",
      notes: "Review and validate mapping against framework documentation",
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
        <ControlMappingForm />
      </ToolShell>
    </div>
  );
}

