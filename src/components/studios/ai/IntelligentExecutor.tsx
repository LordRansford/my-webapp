"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Brain, Play, Pause, CheckCircle2, AlertCircle, Loader2, Zap } from "lucide-react";
import type { WorkflowStep } from "../automation/WorkflowEngine";

interface IntelligentExecutorProps {
  steps: WorkflowStep[];
  onExecute?: (step: WorkflowStep) => Promise<any>;
  onOptimize?: (steps: WorkflowStep[]) => WorkflowStep[];
  showOptimizations?: boolean;
  className?: string;
}

export function IntelligentExecutor({
  steps,
  onExecute,
  onOptimize,
  showOptimizations = true,
  className = ""
}: IntelligentExecutorProps) {
  const [optimizedSteps, setOptimizedSteps] = useState<WorkflowStep[]>(steps);
  const [executionPlan, setExecutionPlan] = useState<Array<{ stepId: string; order: number; parallel: boolean }>>([]);
  const [executing, setExecuting] = useState(false);

  const analyzeAndOptimize = useCallback(() => {
    let optimized = [...steps];

    // Detect parallelizable steps
    const independentSteps = optimized.filter(step => 
      !step.dependencies || step.dependencies.length === 0
    );

    if (independentSteps.length > 1) {
      // Mark independent steps as parallelizable
      optimized = optimized.map(step => {
        if (independentSteps.some(s => s.id === step.id)) {
          return { ...step, parallel: true };
        }
        return step;
      });
    }

    // Optimize step order based on dependencies
    const ordered: WorkflowStep[] = [];
    const processed = new Set<string>();

    const addStep = (step: WorkflowStep) => {
      if (processed.has(step.id)) return;

      if (step.dependencies && step.dependencies.length > 0) {
        step.dependencies.forEach(depId => {
          const depStep = optimized.find(s => s.id === depId);
          if (depStep) addStep(depStep);
        });
      }

      ordered.push(step);
      processed.add(step.id);
    };

    optimized.forEach(step => addStep(step));

    // Apply custom optimizations if provided
    if (onOptimize) {
      optimized = onOptimize(ordered);
    } else {
      optimized = ordered;
    }

    setOptimizedSteps(optimized);

    // Create execution plan
    const plan: Array<{ stepId: string; order: number; parallel: boolean }> = [];
    let order = 0;
    const currentLevel: string[] = [];

    optimized.forEach((step, index) => {
      const canRunParallel = !step.dependencies || 
        step.dependencies.every(depId => 
          plan.find(p => p.stepId === depId) !== undefined
        );

      if (canRunParallel && currentLevel.length < 3) {
        currentLevel.push(step.id);
        plan.push({ stepId: step.id, order, parallel: currentLevel.length > 1 });
      } else {
        if (currentLevel.length > 0) {
          order++;
          currentLevel.length = 0;
        }
        currentLevel.push(step.id);
        plan.push({ stepId: step.id, order, parallel: false });
      }
    });

    setExecutionPlan(plan);
  }, [steps, onOptimize]);

  React.useEffect(() => {
    analyzeAndOptimize();
  }, [analyzeAndOptimize]);

  const optimizations = useMemo(() => {
    const optims: string[] = [];
    
    const parallelCount = executionPlan.filter(p => p.parallel).length;
    if (parallelCount > 0) {
      optims.push(`${parallelCount} steps can run in parallel`);
    }

    const estimatedTime = optimizedSteps.reduce((sum, step) => 
      sum + (step.estimatedTime || 0), 0
    );
    if (estimatedTime < steps.reduce((sum, step) => sum + (step.estimatedTime || 0), 0)) {
      optims.push(`Estimated time reduced to ${estimatedTime}s`);
    }

    return optims;
  }, [executionPlan, optimizedSteps, steps]);

  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-sky-600" />
          <h3 className="text-lg font-semibold text-slate-900">Intelligent Executor</h3>
        </div>
        <button
          onClick={analyzeAndOptimize}
          className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
        >
          <Zap className="w-4 h-4" />
          Re-optimize
        </button>
      </div>

      {showOptimizations && optimizations.length > 0 && (
        <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-emerald-900 mb-1">Optimizations Applied</p>
              <ul className="space-y-1">
                {optimizations.map((opt, index) => (
                  <li key={index} className="text-xs text-emerald-800">• {opt}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {optimizedSteps.map((step, index) => {
          const planEntry = executionPlan.find(p => p.stepId === step.id);
          const isParallel = planEntry?.parallel;

          return (
            <div
              key={step.id}
              className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-white"
            >
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                  isParallel
                    ? "bg-purple-100 text-purple-700"
                    : "bg-sky-100 text-sky-700"
                }`}>
                  {index + 1}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-slate-900">{step.name}</span>
                  {isParallel && (
                    <span className="px-2 py-0.5 rounded text-xs bg-purple-100 text-purple-700">
                      Parallel
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-600">{step.description}</p>
                {step.estimatedTime && (
                  <p className="text-xs text-slate-500 mt-1">
                    ~{step.estimatedTime}s
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {optimizedSteps.length === 0 && (
        <div className="text-center py-8 text-slate-500 text-sm">
          No steps to execute
        </div>
      )}
    </div>
  );
}
