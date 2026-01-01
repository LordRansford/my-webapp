"use client";

import React, { useState, useCallback } from "react";
import { Sparkles, Play, Loader2, CheckCircle2 } from "lucide-react";
import type { WorkflowStep } from "../automation/WorkflowEngine";

interface AIWorkflowGeneratorProps {
  description: string;
  context?: Record<string, any>;
  onGenerate?: (description: string, context?: Record<string, any>) => Promise<WorkflowStep[]>;
  onWorkflowReady?: (steps: WorkflowStep[]) => void;
  className?: string;
}

const defaultWorkflowGenerator = async (
  description: string,
  context?: Record<string, any>
): Promise<WorkflowStep[]> => {
  // Simple workflow generation based on keywords (would use AI/ML in production)
  const lower = description.toLowerCase();
  const steps: WorkflowStep[] = [];

  // Detect workflow type and generate steps
  if (lower.includes("data") || lower.includes("process")) {
    steps.push({
      id: "upload",
      name: "Upload Data",
      description: "Upload and validate input data",
      status: "pending",
      autoExecute: true,
      estimatedTime: 5,
      execute: async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { uploaded: true };
      }
    });

    steps.push({
      id: "validate",
      name: "Validate Data",
      description: "Check data quality and structure",
      status: "pending",
      autoExecute: true,
      dependencies: ["upload"],
      estimatedTime: 3,
      execute: async () => {
        await new Promise(resolve => setTimeout(resolve, 800));
        return { valid: true };
      }
    });

    if (lower.includes("analyze") || lower.includes("model")) {
      steps.push({
        id: "analyze",
        name: "Analyze Data",
        description: "Perform data analysis",
        status: "pending",
        autoExecute: true,
        dependencies: ["validate"],
        estimatedTime: 10,
        execute: async () => {
          await new Promise(resolve => setTimeout(resolve, 2000));
          return { analyzed: true };
        }
      });
    }

    steps.push({
      id: "export",
      name: "Export Results",
      description: "Generate and export outputs",
      status: "pending",
      autoExecute: true,
      dependencies: steps.length > 2 ? ["analyze"] : ["validate"],
      estimatedTime: 2,
      execute: async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return { exported: true };
      }
    });
  } else if (lower.includes("deploy") || lower.includes("publish")) {
    steps.push(
      {
        id: "build",
        name: "Build Package",
        description: "Create deployment package",
        status: "pending",
        autoExecute: true,
        estimatedTime: 5
      },
      {
        id: "test",
        name: "Run Tests",
        description: "Execute test suite",
        status: "pending",
        autoExecute: true,
        dependencies: ["build"],
        estimatedTime: 3
      },
      {
        id: "deploy",
        name: "Deploy",
        description: "Deploy to target environment",
        status: "pending",
        autoExecute: true,
        dependencies: ["test"],
        estimatedTime: 10
      }
    );
  } else {
    // Generic workflow
    steps.push(
      {
        id: "step1",
        name: "Step 1",
        description: "Initial processing",
        status: "pending",
        autoExecute: true,
        estimatedTime: 5
      },
      {
        id: "step2",
        name: "Step 2",
        description: "Secondary processing",
        status: "pending",
        autoExecute: true,
        dependencies: ["step1"],
        estimatedTime: 5
      }
    );
  }

  return steps;
};

export function AIWorkflowGenerator({
  description,
  context,
  onGenerate = defaultWorkflowGenerator,
  onWorkflowReady,
  className = ""
}: AIWorkflowGeneratorProps) {
  const [generating, setGenerating] = useState(false);
  const [generatedSteps, setGeneratedSteps] = useState<WorkflowStep[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!description.trim()) {
      setError("Please provide a workflow description");
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      const steps = await onGenerate(description, context);
      setGeneratedSteps(steps);
      if (onWorkflowReady) {
        onWorkflowReady(steps);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate workflow");
    } finally {
      setGenerating(false);
    }
  }, [description, context, onGenerate, onWorkflowReady]);

  React.useEffect(() => {
    if (description.trim() && description.length > 10) {
      handleGenerate();
    }
  }, [description]);

  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-sky-600" />
        <h3 className="text-lg font-semibold text-slate-900">AI Workflow Generator</h3>
      </div>

      <div className="mb-4">
        <p className="text-sm text-slate-600 mb-2">Describe what you want to accomplish:</p>
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
          <p className="text-sm text-slate-900">{description || "Enter a workflow description..."}</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-sm text-rose-800">
          {error}
        </div>
      )}

      {generating ? (
        <div className="text-center py-8">
          <Loader2 className="w-8 h-8 text-sky-600 animate-spin mx-auto mb-2" />
          <p className="text-sm text-slate-600">Generating workflow...</p>
        </div>
      ) : generatedSteps.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-emerald-700 mb-2">
            <CheckCircle2 className="w-4 h-4" />
            <span className="font-medium">Workflow Generated ({generatedSteps.length} steps)</span>
          </div>
          {generatedSteps.map((step, index) => (
            <div
              key={step.id}
              className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50"
            >
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-semibold">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="font-medium text-slate-900">{step.name}</div>
                <div className="text-sm text-slate-600">{step.description}</div>
                {step.estimatedTime && (
                  <div className="text-xs text-slate-500 mt-1">
                    Estimated: {step.estimatedTime}s
                  </div>
                )}
              </div>
            </div>
          ))}
          {onWorkflowReady && (
            <button
              onClick={() => onWorkflowReady(generatedSteps)}
              className="w-full mt-4 px-4 py-2 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition-colors flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4" />
              Use This Workflow
            </button>
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-slate-500 text-sm">
          Enter a description to generate a workflow
        </div>
      )}
    </div>
  );
}
