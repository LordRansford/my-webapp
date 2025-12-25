"use client";

import React, { useEffect, useState } from "react";
import type { ToolContract } from "./ToolShell";

interface SelfTestResult {
  passed: boolean;
  message: string;
  missingFields?: string[];
}

interface ToolSelfTestProps {
  contract: ToolContract | null;
  defaultInputs: Record<string, unknown>;
  examples: Array<{ title: string; inputs: Record<string, unknown> }>;
  onRun?: (mode: "local" | "compute", inputs: Record<string, unknown>) => Promise<{
    success: boolean;
    output?: string | unknown;
    error?: { code: string; message: string };
  }>;
}

export default function ToolSelfTest({ contract, defaultInputs, examples, onRun }: ToolSelfTestProps) {
  const [testResult, setTestResult] = useState<SelfTestResult | null>(null);

  useEffect(() => {
    if (!contract) {
      setTestResult({
        passed: false,
        message: "Tool contract not found",
        missingFields: ["contract"],
      });
      return;
    }

    const missingFields: string[] = [];
    
    // Check contract completeness
    if (!contract.id) missingFields.push("contract.id");
    if (!contract.title) missingFields.push("contract.title");
    if (!contract.description) missingFields.push("contract.description");
    if (!contract.executionModes || contract.executionModes.length === 0) {
      missingFields.push("contract.executionModes");
    }
    if (!contract.inputs || contract.inputs.length === 0) {
      missingFields.push("contract.inputs");
    }
    if (!contract.limits) missingFields.push("contract.limits");
    if (!contract.creditModel) missingFields.push("contract.creditModel");

    // Check default inputs match contract
    if (contract.inputs) {
      for (const input of contract.inputs) {
        if (input.required && !(input.name in defaultInputs)) {
          missingFields.push(`defaultInputs.${input.name}`);
        }
      }
    }

    // Check examples
    if (examples.length < 2) {
      missingFields.push("examples (need at least 2)");
    }

    // Check runner
    if (contract.runner === "local" && !onRun) {
      missingFields.push("onRun handler (required for local execution)");
    }

    if (missingFields.length > 0) {
      setTestResult({
        passed: false,
        message: "This tool is misconfigured",
        missingFields,
      });
    } else {
      setTestResult({
        passed: true,
        message: "Tool configuration looks good",
      });
    }
  }, [contract, defaultInputs, examples, onRun]);

  if (!testResult || testResult.passed) {
    return null;
  }

  return (
    <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-4" role="alert">
      <div className="flex items-start gap-3">
        <span className="text-lg" aria-hidden="true">⚠️</span>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-amber-900">{testResult.message}</h3>
          {testResult.missingFields && testResult.missingFields.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-semibold text-amber-800">Missing fields:</p>
              <ul className="mt-1 list-disc list-inside text-xs text-amber-700">
                {testResult.missingFields.map((field, idx) => (
                  <li key={idx}>{field}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

