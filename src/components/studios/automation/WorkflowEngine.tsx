"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Play, Pause, Square, CheckCircle2, Circle, AlertCircle, Loader2, Settings, Zap } from "lucide-react";

export interface WorkflowStep {
  id: string;
  name: string;
  description?: string;
  status: "pending" | "running" | "completed" | "failed" | "skipped";
  autoExecute?: boolean;
  estimatedTime?: number; // in seconds
  dependencies?: string[]; // step IDs that must complete first
  execute?: () => Promise<any>;
  onComplete?: (result: any) => void;
  onError?: (error: Error) => void;
}

interface WorkflowEngineProps {
  steps: WorkflowStep[];
  onComplete?: (results: Record<string, any>) => void;
  autoStart?: boolean;
  showControls?: boolean;
  className?: string;
}

export function WorkflowEngine({
  steps,
  onComplete,
  autoStart = false,
  showControls = true,
  className = ""
}: WorkflowEngineProps) {
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>(steps);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStepId, setCurrentStepId] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, Error>>({});

  const canStart = useMemo(() => {
    return !isRunning && workflowSteps.some(s => s.status === "pending");
  }, [isRunning, workflowSteps]);

  const canResume = useMemo(() => {
    return isPaused && isRunning;
  }, [isPaused, isRunning]);

  const completedCount = useMemo(() => {
    return workflowSteps.filter(s => s.status === "completed").length;
  }, [workflowSteps]);

  const progress = useMemo(() => {
    if (workflowSteps.length === 0) return 0;
    return (completedCount / workflowSteps.length) * 100;
  }, [completedCount, workflowSteps.length]);

  const updateStepStatus = useCallback((stepId: string, status: WorkflowStep["status"], result?: any, error?: Error) => {
    setWorkflowSteps(prev => prev.map(step => {
      if (step.id === stepId) {
        return { ...step, status };
      }
      return step;
    }));

    if (result !== undefined) {
      setResults(prev => ({ ...prev, [stepId]: result }));
    }

    if (error) {
      setErrors(prev => ({ ...prev, [stepId]: error }));
    }
  }, []);

  const getReadySteps = useCallback((remainingSteps: WorkflowStep[]) => {
    return remainingSteps.filter(step => {
      if (step.status !== "pending") return false;
      if (!step.dependencies || step.dependencies.length === 0) return true;
      return step.dependencies.every(depId => {
        const depStep = workflowSteps.find(s => s.id === depId);
        return depStep?.status === "completed";
      });
    });
  }, [workflowSteps]);

  const executeStep = useCallback(async (step: WorkflowStep) => {
    if (!step.execute) {
      updateStepStatus(step.id, "skipped");
      return;
    }

    setCurrentStepId(step.id);
    updateStepStatus(step.id, "running");

    try {
      const result = await step.execute();
      updateStepStatus(step.id, "completed", result);
      
      if (step.onComplete) {
        step.onComplete(result);
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      updateStepStatus(step.id, "failed", undefined, err);
      
      if (step.onError) {
        step.onError(err);
      }
    } finally {
      setCurrentStepId(null);
    }
  }, [updateStepStatus]);

  const runWorkflow = useCallback(async () => {
    if (isRunning) return;

    setIsRunning(true);
    setIsPaused(false);
    setCurrentStepId(null);
    setResults({});
    setErrors({});

    // Reset all steps to pending
    setWorkflowSteps(prev => prev.map(step => ({ ...step, status: "pending" as const })));

    const remainingSteps = [...workflowSteps];
    const autoExecuteSteps = remainingSteps.filter(s => s.autoExecute !== false);

    while (autoExecuteSteps.length > 0 && !isPaused) {
      const readySteps = getReadySteps(autoExecuteSteps);
      
      if (readySteps.length === 0) {
        // Check if we're stuck (no ready steps but still have pending)
        const pendingSteps = autoExecuteSteps.filter(s => s.status === "pending");
        if (pendingSteps.length > 0) {
          // Mark as failed - circular dependency or missing dependency
          pendingSteps.forEach(step => {
            updateStepStatus(step.id, "failed", undefined, new Error("Dependency not met"));
          });
        }
        break;
      }

      // Execute ready steps (can be parallel)
      await Promise.all(readySteps.map(step => executeStep(step)));

      // Remove completed/failed steps from queue
      const stillPending = autoExecuteSteps.filter(s => s.status === "pending");
      autoExecuteSteps.length = 0;
      autoExecuteSteps.push(...stillPending);
    }

    setIsRunning(false);

    if (onComplete) {
      onComplete(results);
    }
  }, [isRunning, isPaused, workflowSteps, getReadySteps, executeStep, updateStepStatus, onComplete, results]);

  const pauseWorkflow = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resumeWorkflow = useCallback(() => {
    setIsPaused(false);
    // Continue execution
    runWorkflow();
  }, [runWorkflow]);

  const stopWorkflow = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    setCurrentStepId(null);
  }, []);

  const resetWorkflow = useCallback(() => {
    stopWorkflow();
    setWorkflowSteps(prev => prev.map(step => ({ ...step, status: "pending" as const })));
    setResults({});
    setErrors({});
  }, [stopWorkflow]);

  React.useEffect(() => {
    if (autoStart && canStart) {
      runWorkflow();
    }
  }, [autoStart, canStart, runWorkflow]);

  const getStepIcon = (step: WorkflowStep) => {
    switch (step.status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case "running":
        return <Loader2 className="w-5 h-5 text-sky-600 animate-spin" />;
      case "failed":
        return <AlertCircle className="w-5 h-5 text-rose-600" />;
      case "skipped":
        return <Circle className="w-5 h-5 text-slate-400" />;
      default:
        return <Circle className="w-5 h-5 text-slate-300" />;
    }
  };

  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Zap className="w-6 h-6 text-sky-600" />
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Workflow Automation</h2>
            <p className="text-sm text-slate-600">
              {completedCount} of {workflowSteps.length} steps completed
            </p>
          </div>
        </div>

        {showControls && (
          <div className="flex gap-2">
            {!isRunning && canStart && (
              <button
                onClick={runWorkflow}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition-colors flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Start
              </button>
            )}
            {isRunning && !isPaused && (
              <button
                onClick={pauseWorkflow}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
              >
                <Pause className="w-4 h-4" />
                Pause
              </button>
            )}
            {isPaused && (
              <button
                onClick={resumeWorkflow}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition-colors flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Resume
              </button>
            )}
            {isRunning && (
              <button
                onClick={stopWorkflow}
                className="px-4 py-2 border border-rose-300 text-rose-700 rounded-lg font-medium hover:bg-rose-50 transition-colors flex items-center gap-2"
              >
                <Square className="w-4 h-4" />
                Stop
              </button>
            )}
            {!isRunning && completedCount > 0 && (
              <button
                onClick={resetWorkflow}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-sky-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-3">
        {workflowSteps.map((step, index) => {
          const isCurrent = currentStepId === step.id;
          const hasError = errors[step.id];

          return (
            <div
              key={step.id}
              className={`rounded-xl border-2 p-4 transition-all ${
                isCurrent
                  ? "border-sky-500 bg-sky-50"
                  : step.status === "completed"
                  ? "border-emerald-200 bg-emerald-50"
                  : step.status === "failed"
                  ? "border-rose-200 bg-rose-50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getStepIcon(step)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">
                      {index + 1}. {step.name}
                    </h3>
                    {step.estimatedTime && (
                      <span className="text-xs text-slate-500">
                        ~{step.estimatedTime}s
                      </span>
                    )}
                  </div>
                  {step.description && (
                    <p className="text-sm text-slate-600 mt-1">{step.description}</p>
                  )}
                  {hasError && (
                    <p className="text-sm text-rose-600 mt-2">
                      Error: {hasError.message}
                    </p>
                  )}
                  {step.status === "completed" && results[step.id] && (
                    <div className="mt-2 text-xs text-slate-500">
                      ✓ Completed
                    </div>
                  )}
                  {step.dependencies && step.dependencies.length > 0 && (
                    <div className="mt-2 text-xs text-slate-500">
                      Depends on: {step.dependencies.join(", ")}
                    </div>
                  )}
                </div>
                {step.autoExecute === false && (
                  <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                    Manual
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
