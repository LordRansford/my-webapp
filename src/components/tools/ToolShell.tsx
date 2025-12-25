"use client";

import React, { useState, ReactNode, useEffect, useMemo } from "react";
import CreditEstimate from "./CreditEstimate";
import ErrorPanel from "./ErrorPanel";
import ToolSelfTest from "./ToolSelfTest";
import { getDefaultInputs, getToolExamples, getToolExplain } from "@/lib/tools/loadCatalog";
import { runTool, validateInputs, type ValidationError } from "@/lib/tools/runTool";
import { createToolError } from "./ErrorPanel";
import type { ToolError } from "./ErrorPanel";

export type ExecutionMode = "local" | "compute";

export interface ToolContract {
  id: string;
  title: string;
  description: string;
  category?: string;
  difficulty?: string;
  route: string;
  executionModes: ExecutionMode[];
  defaultMode: ExecutionMode;
  inputs: Array<{
    name: string;
    type: string;
    limits: string;
    required?: boolean;
    default?: unknown;
  }>;
  limits: {
    cpuMs: number;
    wallMs: number;
    memoryMb: number;
    inputKb: number;
    outputKb: number;
  };
  creditModel: {
    baseCredits: number;
    perKbCredits: number;
    complexityMultiplierHints?: Record<string, number>;
  };
  runner: string;
  failureModes: string[];
  statusStates: string[];
  securityNotes?: string;
}

interface ToolShellProps {
  contract: ToolContract;
  children: ReactNode;
  onRun?: (mode: ExecutionMode, inputs: Record<string, unknown>) => Promise<{
    success: boolean;
    output?: string | unknown;
    error?: ToolError;
  }>;
  initialInputs?: Record<string, unknown>;
  examples?: Array<{ title: string; inputs: Record<string, unknown>; expectedOutput?: string }>;
}

type Tab = "run" | "explain" | "examples";

export default function ToolShell({
  contract,
  children,
  onRun,
  initialInputs = {},
  examples = [],
}: ToolShellProps) {
  // Load defaults and examples from catalog
  const catalogDefaults = useMemo(() => getDefaultInputs(contract.id), [contract.id]);
  const catalogExamples = useMemo(() => getToolExamples(contract.id), [contract.id]);
  const catalogExplain = useMemo(() => getToolExplain(contract.id), [contract.id]);

  // Merge catalog examples with prop examples
  const allExamples = useMemo(() => {
    const merged = [...catalogExamples, ...examples];
    // Deduplicate by title
    const seen = new Set<string>();
    return merged.filter((ex) => {
      if (seen.has(ex.title)) return false;
      seen.add(ex.title);
      return true;
    });
  }, [catalogExamples, examples]);

  // Merge defaults: catalog > contract defaults > initialInputs
  const mergedDefaults = useMemo(() => {
    const contractDefaults: Record<string, unknown> = {};
    if (contract.inputs) {
      for (const input of contract.inputs) {
        if (input.default !== undefined) {
          contractDefaults[input.name] = input.default;
        }
      }
    }
    return { ...contractDefaults, ...catalogDefaults, ...initialInputs };
  }, [contract, catalogDefaults, initialInputs]);

  const [activeTab, setActiveTab] = useState<Tab>("run");
  const [mode, setMode] = useState<ExecutionMode>(contract.defaultMode);
  const [inputs, setInputs] = useState<Record<string, unknown>>(mergedDefaults);
  const [status, setStatus] = useState<string>("idle");
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<ToolError | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  // Validate inputs on change
  useEffect(() => {
    const validation = validateInputs(contract, inputs);
    setValidationErrors(validation.errors);
  }, [contract, inputs]);

  const handleRun = async () => {
    // Pre-validate
    const validation = validateInputs(contract, inputs);
    if (!validation.valid) {
      setError({
        code: "validation_error",
        message: `Please fix these fields: ${validation.errors.map((e) => e.field).join(", ")}`,
        fixSuggestion: validation.errors.map((e) => e.message).join(". "),
      });
      // Scroll to first error field
      const firstErrorField = document.querySelector(`[name="${validation.errors[0].field}"]`);
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
        (firstErrorField as HTMLElement).focus();
      }
      return;
    }

    setStatus("running");
    setIsRunning(true);
    setError(null);
    setOutput(null);

    try {
      // Use unified runner if onRun not provided, otherwise use custom handler
      let result: { success: boolean; output?: string | unknown; error?: ToolError };
      
      if (onRun) {
        result = await onRun(mode, inputs);
      } else {
        // Use unified runner
        const runResult = await runTool(contract, mode, inputs);
        if (runResult.ok) {
          result = {
            success: true,
            output: runResult.output,
          };
        } else {
          result = {
            success: false,
            error: runResult.error ? createToolError(runResult.error.code, contract.id, {
              message: runResult.error.message,
              whatToDo: runResult.error.whatToDo,
            }) : createToolError("unknown_error", contract.id),
          };
        }
      }

      if (result.success) {
        setStatus("completed");
        setOutput(typeof result.output === "string" ? result.output : JSON.stringify(result.output, null, 2));
      } else {
        setStatus("failed");
        setError(result.error || {
          code: "unknown_error",
          message: "An unknown error occurred.",
        });
      }
    } catch (err) {
      setStatus("failed");
      setError({
        code: "runtime_error",
        message: err instanceof Error ? err.message : "Execution failed",
        fixSuggestion: "Check your inputs and try again.",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setInputs(mergedDefaults);
    setOutput(null);
    setError(null);
    setStatus("idle");
    setValidationErrors([]);
  };

  const handleStop = () => {
    setIsRunning(false);
    setStatus("idle");
  };

  const canRun = (mode === "local" || (mode === "compute" && contract.runner.startsWith("/api/"))) && validationErrors.length === 0;

  return (
    <div className="tool-shell">
      {/* Self Test Banner */}
      <ToolSelfTest
        contract={contract}
        defaultInputs={mergedDefaults}
        examples={allExamples}
        onRun={onRun}
      />

      {/* Header */}
      <header className="mb-6 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">{contract.title}</h1>
            <p className="mt-2 text-base text-slate-700">{contract.description}</p>
            <p className="mt-2 text-sm italic text-slate-600">Dedicated to Charis Chung Amponsah</p>
          </div>
        </div>

        {/* Limits & Security */}
        <div className="flex flex-wrap gap-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
          <div>
            <span className="font-semibold text-slate-900">Limits:</span>{" "}
            <span className="text-slate-700">
              {contract.limits.cpuMs}ms CPU, {contract.limits.memoryMb}MB memory, {contract.limits.outputKb}KB output
            </span>
          </div>
          {contract.securityNotes && (
            <div>
              <span className="font-semibold text-slate-900">Security:</span>{" "}
              <span className="text-slate-700">{contract.securityNotes}</span>
            </div>
          )}
        </div>
      </header>

      {/* Tabs */}
      <div className="mb-6 border-b border-slate-200">
        <nav className="flex gap-4" role="tablist">
          {(["run", "explain", "examples"] as Tab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
              className={`border-b-2 px-4 py-2 text-sm font-semibold transition ${
                activeTab === tab
                  ? "border-slate-900 text-slate-900"
                  : "border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-800"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "run" && (
        <div className="space-y-6">
          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <h3 className="mb-2 text-sm font-semibold text-amber-900">Fix these fields:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-amber-800">
                {validationErrors.map((err, idx) => (
                  <li key={idx}>
                    <strong>{err.field}:</strong> {err.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Mode Switch */}
          {contract.executionModes.length > 1 && (
            <div className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4">
              <span className="text-sm font-semibold text-slate-900">Execution Mode:</span>
              <div className="flex gap-2">
                {contract.executionModes.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    disabled={m === "compute" && !contract.runner.startsWith("/api/")}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                      mode === m
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {m === "local" ? "Local (Free)" : "Compute (Credits)"}
                  </button>
                ))}
              </div>
              {mode === "compute" && !contract.runner.startsWith("/api/") && (
                <p className="text-sm text-amber-700">
                  Compute mode is temporarily unavailable. Use Local mode.
                </p>
              )}
            </div>
          )}

          {/* Credit Estimate */}
          <CreditEstimate contract={contract} mode={mode} inputs={inputs} />

          {/* Inputs - rendered by children */}
          <div className="space-y-4">{children}</div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleRun}
              disabled={isRunning || !canRun}
              className="rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
            >
              {isRunning ? "Running..." : "Run"}
            </button>
            {isRunning && (
              <button
                type="button"
                onClick={handleStop}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
              >
                Stop
              </button>
            )}
            <button
              type="button"
              onClick={handleReset}
              disabled={isRunning}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
            >
              Reset
            </button>
            {output && (
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(output);
                }}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
              >
                Copy Output
              </button>
            )}
          </div>

          {/* Error Display */}
          {error && <ErrorPanel error={error} onDismiss={() => setError(null)} />}

          {/* Output Display */}
          {output !== null && !error && (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <h3 className="mb-2 text-sm font-semibold text-slate-900">Output</h3>
              <pre className="overflow-auto rounded bg-white p-3 text-sm text-slate-800">
                {output}
              </pre>
            </div>
          )}
        </div>
      )}

      {activeTab === "explain" && (
        <div className="prose prose-sm max-w-none">
          {catalogExplain ? (
            <div className="whitespace-pre-wrap text-sm text-slate-700">{catalogExplain}</div>
          ) : (
            <>
              <h3>What this tool is for</h3>
              <p>{contract.description}</p>
              <h3>Limits</h3>
              <ul>
                <li>CPU: {contract.limits.cpuMs}ms</li>
                <li>Memory: {contract.limits.memoryMb}MB</li>
                <li>Output: {contract.limits.outputKb}KB</li>
                <li>Input: {contract.limits.inputKb}KB</li>
              </ul>
              {contract.securityNotes && (
                <>
                  <h3>Security</h3>
                  <p>{contract.securityNotes}</p>
                </>
              )}
            </>
          )}
        </div>
      )}

      {activeTab === "examples" && (
        <div className="space-y-4">
          {allExamples.length > 0 ? (
            allExamples.map((example, idx) => (
              <div key={idx} className="rounded-lg border border-slate-200 bg-white p-4">
                <h3 className="mb-2 text-sm font-semibold text-slate-900">{example.title}</h3>
                {example.expectedOutput && (
                  <div className="mb-3 rounded bg-slate-50 p-2 text-xs text-slate-600">
                    <strong>Expected output:</strong> {example.expectedOutput}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setInputs(example.inputs)}
                  className="text-sm text-slate-700 underline hover:text-slate-900"
                >
                  Load this example
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-600">No examples available for this tool.</p>
          )}
        </div>
      )}
    </div>
  );
}
