"use client";

import React, { useState, ReactNode, useEffect, useMemo } from "react";
import CreditEstimate from "./CreditEstimate";
import ErrorPanel from "./ErrorPanel";
import ToolSelfTest from "./ToolSelfTest";
import RunReceiptPanel from "./RunReceiptPanel";
import { getDefaultInputs, getToolExamples, getToolExplain } from "@/lib/tools/loadCatalog";
import { runTool, validateInputs, type ValidationError } from "@/lib/tools/runTool";
import { createToolError } from "./ErrorPanel";
import type { ToolError } from "./ErrorPanel";
import type { UnifiedRunReceipt } from "@/lib/compute/receipts";

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
  onInputsChange?: (inputs: Record<string, unknown>) => void;
}

type Tab = "run" | "explain" | "examples";

// Simple markdown-like parser for explain text
function renderExplainText(text: string): React.ReactNode {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let currentParagraph: string[] = [];
  let inList = false;
  let listItems: string[] = [];

  function flushParagraph() {
    if (currentParagraph.length > 0) {
      elements.push(
        <p key={elements.length} className="mb-3 text-sm text-slate-700 leading-relaxed">
          {currentParagraph.join(' ')}
        </p>
      );
      currentParagraph = [];
    }
  }

  function flushList() {
    if (listItems.length > 0) {
      elements.push(
        <ul key={elements.length} className="mb-4 ml-6 list-disc space-y-1 text-sm text-slate-700">
          {listItems.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    // Headers
    if (line.startsWith('**') && line.endsWith('**')) {
      flushParagraph();
      flushList();
      const headerText = line.slice(2, -2);
      elements.push(
        <h3 key={elements.length} className="mb-3 mt-6 text-base font-semibold text-slate-900 first:mt-0">
          {headerText}
        </h3>
      );
      continue;
    }

    // List items
    if (line.startsWith('✅') || line.startsWith('❌') || line.startsWith('-')) {
      flushParagraph();
      if (!inList) inList = true;
      const itemText = line.replace(/^[✅❌-]\s*/, '');
      listItems.push(itemText);
      continue;
    }

    // Regular paragraph text
    flushList();
    currentParagraph.push(line);
  }

  flushParagraph();
  flushList();

  return <div>{elements}</div>;
}

export default function ToolShell({
  contract,
  children,
  onRun,
  initialInputs = {},
  examples = [],
  onInputsChange,
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
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<ToolError | null>(null);
  const [receipt, setReceipt] = useState<UnifiedRunReceipt | null>(null);
  const [status, setStatus] = useState<"idle" | "running" | "completed" | "failed">("idle");
  const [isRunning, setIsRunning] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [showResetReminder, setShowResetReminder] = useState(false);

  // Reset inputs when defaults change
  useEffect(() => {
    if (Object.keys(mergedDefaults).length > 0 && Object.keys(inputs).length === 0) {
      setInputs(mergedDefaults);
    }
  }, [mergedDefaults, inputs]);

  // Notify parent when inputs change (for syncing textarea)
  useEffect(() => {
    if (onInputsChange) {
      onInputsChange(inputs);
    }
  }, [inputs, onInputsChange]);

  // Show reset reminder if there's output/error but user hasn't reset
  useEffect(() => {
    if ((output || error) && status !== "idle") {
      setShowResetReminder(true);
    } else {
      setShowResetReminder(false);
    }
  }, [output, error, status]);

  // Validate inputs whenever they change
  useEffect(() => {
    const validation = validateInputs(contract, inputs);
    setValidationErrors(validation.errors);
  }, [contract, inputs]);

  const handleRun = async () => {
    if (isRunning) return;

    // Clear previous results
    setOutput(null);
    setError(null);
    setReceipt(null);
    setShowResetReminder(false);
    setStatus("running");
    setIsRunning(true);

    try {
      // Use unified runner if onRun not provided, otherwise use custom handler
      let result: { success: boolean; output?: string | unknown; error?: ToolError; receipt?: UnifiedRunReceipt | null };
      
      if (onRun) {
        result = await onRun(mode, inputs);
      } else {
        // Use unified runner
        const runResult = await runTool(contract, mode, inputs);
        if (runResult.ok) {
          result = {
            success: true,
            output: runResult.output,
            receipt: (runResult.receipt as UnifiedRunReceipt | null) ?? null,
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
        if (result.receipt) setReceipt(result.receipt);
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
    setReceipt(null);
    setStatus("idle");
    setValidationErrors([]);
    setShowResetReminder(false);
  };

  const handleStop = () => {
    setIsRunning(false);
    setStatus("idle");
  };

  const handleLoadExample = (example: { title: string; inputs: Record<string, unknown> }) => {
    // Clear previous results when loading example
    setOutput(null);
    setError(null);
    setReceipt(null);
    setStatus("idle");
    setShowResetReminder(false);
    // Load the example inputs
    setInputs(example.inputs);
    // Switch to Run tab so user can see the loaded code
    setActiveTab("run");
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
        <div className="flex flex-wrap gap-4 text-sm text-slate-600">
          <span>Limits: {contract.limits.cpuMs}ms CPU, {contract.limits.memoryMb}MB memory, {contract.limits.outputKb}KB output</span>
          {contract.securityNotes && (
            <span className="text-amber-700">Important: {contract.securityNotes}</span>
          )}
        </div>
      </header>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b border-slate-200">
        {(["run", "explain", "examples"] as Tab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`border-b-2 px-4 py-2 text-sm font-semibold capitalize transition ${
              activeTab === tab
                ? "border-slate-900 text-slate-900"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Reset Reminder Banner */}
      {showResetReminder && (
        <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4" role="alert">
          <div className="flex items-start gap-3">
            <span className="text-lg" aria-hidden="true">💡</span>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-blue-900">Ready for a new run?</h3>
              <p className="mt-1 text-xs text-blue-700">
                Click <strong>Reset</strong> to clear the previous results and start fresh. This ensures your code runs with clean inputs.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowResetReminder(false)}
              className="text-blue-600 hover:text-blue-800"
              aria-label="Dismiss reminder"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {activeTab === "run" && (
        <div className="space-y-6">
          {/* Mode Selector */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-slate-700">Execution Mode:</span>
            <div className="flex gap-2 rounded-lg border border-slate-300 p-1">
              {contract.executionModes.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  disabled={m === "compute" && !contract.runner.startsWith("/api/")}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                    mode === m
                      ? "bg-slate-900 text-white"
                      : "bg-transparent text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  }`}
                >
                  {m === "local" ? "Local" : "Compute"}
                </button>
              ))}
            </div>
            {mode === "compute" && !contract.runner.startsWith("/api/") && (
              <p className="text-sm text-amber-700">
                Compute mode is temporarily unavailable. Use Local mode.
              </p>
            )}
          </div>

          {/* Credit Estimate */}
          <CreditEstimate contract={contract} mode={mode} inputs={inputs} />

          {/* Input Fields (children) */}
          {children}

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

          {/* Receipt Display (compute runs) */}
          {receipt && !error ? <RunReceiptPanel receipt={receipt} /> : null}

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
        <div className="max-w-3xl">
          {catalogExplain ? (
            renderExplainText(catalogExplain)
          ) : (
            <>
              <h3 className="mb-3 text-base font-semibold text-slate-900">What this tool is for</h3>
              <p className="mb-3 text-sm text-slate-700 leading-relaxed">{contract.description}</p>
              <h3 className="mb-3 mt-6 text-base font-semibold text-slate-900">Limits</h3>
              <ul className="mb-4 ml-6 list-disc space-y-1 text-sm text-slate-700">
                <li>CPU: {contract.limits.cpuMs}ms</li>
                <li>Memory: {contract.limits.memoryMb}MB</li>
                <li>Output: {contract.limits.outputKb}KB</li>
                <li>Input: {contract.limits.inputKb}KB</li>
              </ul>
              {contract.securityNotes && (
                <>
                  <h3 className="mb-3 mt-6 text-base font-semibold text-slate-900">Security</h3>
                  <p className="mb-3 text-sm text-slate-700 leading-relaxed">{contract.securityNotes}</p>
                </>
              )}
            </>
          )}
        </div>
      )}

      {activeTab === "examples" && (
        <div className="space-y-4">
          {allExamples.length > 0 ? (
            <>
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <p className="text-sm text-blue-800">
                  <strong>💡 Tip:</strong> Click Load this example to see it in action. After loading, click Run to execute it. Use Reset to clear results before trying a new example.
                </p>
              </div>
              {allExamples.map((example, idx) => (
                <div key={idx} className="rounded-lg border border-slate-200 bg-white p-4">
                  <h3 className="mb-2 text-sm font-semibold text-slate-900">{example.title}</h3>
                  {example.expectedOutput && (
                    <div className="mb-3 rounded bg-slate-50 p-2 text-xs text-slate-600">
                      <strong>Expected output:</strong> {example.expectedOutput}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => handleLoadExample(example)}
                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                  >
                    Load this example
                  </button>
                </div>
              ))}
            </>
          ) : (
            <p className="text-sm text-slate-600">No examples available for this tool.</p>
          )}
        </div>
      )}
    </div>
  );
}

