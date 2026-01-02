"use client";

import React, { useState, useCallback } from "react";
import { Rocket, CheckCircle2, Circle, Loader2, AlertCircle, Cloud, GitBranch, Settings } from "lucide-react";

export type DeploymentStep = {
  id: string;
  name: string;
  description: string;
  status: "pending" | "running" | "completed" | "failed";
  execute?: () => Promise<void>;
};

export type DeploymentTarget = "github" | "aws" | "azure" | "gcp" | "docker" | "kubernetes";

interface DeploymentWizardProps {
  target?: DeploymentTarget;
  steps?: DeploymentStep[];
  onDeploy?: (target: DeploymentTarget, config: Record<string, any>) => Promise<void>;
  className?: string;
}

const defaultSteps: DeploymentStep[] = [
  {
    id: "validate",
    name: "Validate Outputs",
    description: "Check all generated files for errors",
    status: "pending"
  },
  {
    id: "build",
    name: "Build Package",
    description: "Create deployment package",
    status: "pending"
  },
  {
    id: "test",
    name: "Run Tests",
    description: "Execute test suite",
    status: "pending"
  },
  {
    id: "deploy",
    name: "Deploy",
    description: "Deploy to target environment",
    status: "pending"
  },
  {
    id: "verify",
    name: "Verify Deployment",
    description: "Confirm deployment success",
    status: "pending"
  }
];

const targetIcons = {
  github: GitBranch,
  aws: Cloud,
  azure: Cloud,
  gcp: Cloud,
  docker: Settings,
  kubernetes: Settings
};

const targetLabels = {
  github: "GitHub",
  aws: "AWS",
  azure: "Azure",
  gcp: "Google Cloud",
  docker: "Docker",
  kubernetes: "Kubernetes"
};

export function DeploymentWizard({
  target = "github",
  steps = defaultSteps,
  onDeploy,
  className = ""
}: DeploymentWizardProps) {
  const [deploymentSteps, setDeploymentSteps] = useState<DeploymentStep[]>(steps);
  const [isDeploying, setIsDeploying] = useState(false);
  const [currentStepId, setCurrentStepId] = useState<string | null>(null);
  const [config, setConfig] = useState<Record<string, any>>({});

  const TargetIcon = targetIcons[target];
  const targetLabel = targetLabels[target];

  const updateStepStatus = useCallback((stepId: string, status: DeploymentStep["status"]) => {
    setDeploymentSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, status } : step
    ));
  }, []);

  const handleDeploy = useCallback(async () => {
    if (!onDeploy) return;

    setIsDeploying(true);
    setCurrentStepId(null);

    // Reset all steps
    setDeploymentSteps(prev => prev.map(step => ({ ...step, status: "pending" as const })));

    try {
      for (const step of deploymentSteps) {
        setCurrentStepId(step.id);
        updateStepStatus(step.id, "running");

        if (step.execute) {
          await step.execute();
        } else {
          // Simulate step execution
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        updateStepStatus(step.id, "completed");
      }

      // Final deployment
      await onDeploy(target, config);
    } catch (error) {
      const failedStep = deploymentSteps.find(s => s.id === currentStepId);
      if (failedStep) {
        updateStepStatus(failedStep.id, "failed");
      }
      console.error("Deployment failed:", error);
    } finally {
      setIsDeploying(false);
      setCurrentStepId(null);
    }
  }, [onDeploy, target, config, deploymentSteps, currentStepId, updateStepStatus]);

  const getStepIcon = (step: DeploymentStep) => {
    switch (step.status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case "running":
        return <Loader2 className="w-5 h-5 text-sky-600 animate-spin" />;
      case "failed":
        return <AlertCircle className="w-5 h-5 text-rose-600" />;
      default:
        return <Circle className="w-5 h-5 text-slate-300" />;
    }
  };

  const completedCount = deploymentSteps.filter(s => s.status === "completed").length;
  const progress = (completedCount / deploymentSteps.length) * 100;

  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Rocket className="w-6 h-6 text-sky-600" />
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Deployment Wizard</h2>
            <p className="text-sm text-slate-600">Deploy to {targetLabel}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TargetIcon className="w-5 h-5 text-slate-600" />
          <span className="text-sm font-medium text-slate-700">{targetLabel}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
          <span>Deployment Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-sky-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3 mb-6">
        {deploymentSteps.map((step, index) => {
          const isCurrent = currentStepId === step.id;
          const isCompleted = step.status === "completed";
          const isFailed = step.status === "failed";

          return (
            <div
              key={step.id}
              className={`rounded-xl border-2 p-4 transition-all ${
                isCurrent
                  ? "border-sky-500 bg-sky-50"
                  : isCompleted
                  ? "border-emerald-200 bg-emerald-50"
                  : isFailed
                  ? "border-rose-200 bg-rose-50"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getStepIcon(step)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-slate-900">
                      {index + 1}. {step.name}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">{step.description}</p>
                  {isFailed && (
                    <p className="text-sm text-rose-600 mt-2">
                      Deployment failed at this step. Please check the configuration and try again.
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deployment Button */}
      <button
        onClick={handleDeploy}
        disabled={isDeploying}
        className="w-full px-4 py-3 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isDeploying ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Deploying...
          </>
        ) : (
          <>
            <Rocket className="w-5 h-5" />
            Deploy to {targetLabel}
          </>
        )}
      </button>

      {/* Configuration (for expert mode) */}
      {Object.keys(config).length > 0 && (
        <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200">
          <p className="text-xs font-medium text-slate-700 mb-1">Configuration:</p>
          <pre className="text-xs text-slate-600 overflow-x-auto">
            {JSON.stringify(config, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
