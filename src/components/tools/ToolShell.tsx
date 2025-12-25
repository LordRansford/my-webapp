"use client";

import React, { useState, ReactNode } from "react";
import CreditEstimate from "./CreditEstimate";
import ErrorPanel from "./ErrorPanel";
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
  examples?: Array<{ title: string; inputs: Record<string, unknown> }>;
}

type Tab = "run" | "explain" | "examples";

export default function ToolShell({
  contract,
  children,
  onRun,
  initialInputs = {},
  examples = [],
}: ToolShellProps) {
  const [activeTab, setActiveTab] = useState<Tab>("run");
  const [mode, setMode] = useState<ExecutionMode>(contract.defaultMode);
  const [inputs, setInputs] = useState<Record<string, unknown>>(initialInputs);
  const [status, setStatus] = useState<string>("idle");
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<ToolError | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = async () => {
    if (!onRun) {
      setError({
        code: "not_implemented",
        message: "This tool's execution is not yet implemented.",
        fixSuggestion: "Please check back later or use a different tool.",
      });
      return;
    }

    setStatus("running");
    setIsRunning(true);
    setError(null);
    setOutput(null);

    try {
      const result = await onRun(mode, inputs);
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
    setInputs(initialInputs);
    setOutput(null);
    setError(null);
    setStatus("idle");
  };

  const handleStop = () => {
    // For local execution, we can't actually stop, but we can reset
    setIsRunning(false);
    setStatus("idle");
  };

  const canRun = mode === "local" || (mode === "compute" && contract.runner.startsWith("/api/"));

  return (
    <div className="tool-shell">
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
                  navigator.clipboard.writeText(JSON.stringify(output, null, 2));
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
        </div>
      )}

      {activeTab === "examples" && (
        <div className="space-y-4">
          {examples.length > 0 ? (
            examples.map((example, idx) => (
              <div key={idx} className="rounded-lg border border-slate-200 bg-white p-4">
                <h3 className="mb-2 text-sm font-semibold text-slate-900">{example.title}</h3>
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

