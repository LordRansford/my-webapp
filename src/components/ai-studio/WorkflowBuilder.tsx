"use client";

import React, { useState, Suspense } from "react";
import { 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  ArrowDown,
  Plus,
  X,
  Save,
  Play,
  Loader2
} from "lucide-react";
import ErrorBoundaryWrapper from "./ErrorBoundaryWrapper";
import LoadingSpinner from "./LoadingSpinner";

interface WorkflowStep {
  id: string;
  type: "use-case" | "dataset" | "model" | "training" | "validation" | "deploy";
  title: string;
  status: "pending" | "in-progress" | "completed" | "error";
  data?: Record<string, unknown>;
  validation?: {
    isValid: boolean;
    errors?: string[];
  };
}

interface WorkflowBuilderProps {
  onComplete?: (workflow: WorkflowStep[]) => void;
  initialSteps?: WorkflowStep[];
}

const defaultSteps: Omit<WorkflowStep, "id" | "status">[] = [
  { type: "use-case", title: "Choose Use Case" },
  { type: "dataset", title: "Select or Upload Dataset" },
  { type: "model", title: "Choose Model Architecture" },
  { type: "training", title: "Configure Training" },
  { type: "validation", title: "Validate and Review" },
  { type: "deploy", title: "Deploy or Export" },
];

export default function WorkflowBuilder({ onComplete, initialSteps }: WorkflowBuilderProps) {
  const [steps, setSteps] = useState<WorkflowStep[]>(
    initialSteps ||
      defaultSteps.map((step, index) => ({
        ...step,
        id: `step-${index}`,
        status: index === 0 ? "in-progress" : "pending",
      }))
  );
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const currentStep = steps[currentStepIndex];

  const handleStepComplete = (stepId: string, data?: Record<string, unknown>) => {
    setSteps((prev) =>
      prev.map((step) => {
        if (step.id === stepId) {
          return {
            ...step,
            status: "completed",
            data,
            validation: { isValid: true },
          };
        }
        if (step.status === "in-progress") {
          return { ...step, status: "pending" };
        }
        return step;
      })
    );

    // Move to next step
    const nextIndex = steps.findIndex((s) => s.id === stepId) + 1;
    if (nextIndex < steps.length) {
      setCurrentStepIndex(nextIndex);
      setSteps((prev) =>
        prev.map((step, index) => {
          if (index === nextIndex) {
            return { ...step, status: "in-progress" };
          }
          return step;
        })
      );
    }
  };

  const handleStepClick = (index: number) => {
    // Only allow clicking on completed steps or the next pending step
    const clickedStep = steps[index];
    if (clickedStep.status === "completed" || index === currentStepIndex + 1) {
      setCurrentStepIndex(index);
      setSteps((prev) =>
        prev.map((s, i) => {
          if (i === index) {
            return { ...s, status: "in-progress" };
          }
          if (i === currentStepIndex) {
            return { ...s, status: "pending" };
          }
          return s;
        })
      );
    }
  };

  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    try {
      // Save to localStorage
      localStorage.setItem("ai-studio-workflow", JSON.stringify(steps));
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsSaving(false);
    } catch (error) {
      setIsSaving(false);
      setSaveError(error instanceof Error ? error.message : "Failed to save workflow");
    }
  };

  const handleRun = () => {
    if (onComplete) {
      onComplete(steps);
    }
  };

  const getStepIcon = (step: WorkflowStep) => {
    switch (step.status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "in-progress":
        return <Circle className="w-5 h-5 text-purple-600 fill-purple-600" />;
      case "error":
        return <X className="w-5 h-5 text-red-600" />;
      default:
        return <Circle className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStepColor = (step: WorkflowStep) => {
    switch (step.status) {
      case "completed":
        return "border-green-500 bg-green-50";
      case "in-progress":
        return "border-purple-500 bg-purple-50";
      case "error":
        return "border-red-500 bg-red-50";
      default:
        return "border-slate-300 bg-white";
    }
  };

  const allCompleted = steps.every((s) => s.status === "completed");
  const canProceed = steps.slice(0, currentStepIndex + 1).every((s) => s.status === "completed");

  return (
    <ErrorBoundaryWrapper>
      <div className="space-y-6">
      {/* Progress Bar */}
      <div className="relative">
        <div className="hidden md:flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex-1 flex flex-col items-center">
                <button
                  onClick={() => handleStepClick(index)}
                  className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                    index <= currentStepIndex
                      ? getStepColor(step)
                      : "border-slate-300 bg-white"
                  } ${index === currentStepIndex ? "ring-4 ring-purple-200" : ""}`}
                  disabled={index > currentStepIndex + 1}
                  aria-label={`Step ${index + 1}: ${step.title}`}
                >
                  {getStepIcon(step)}
                </button>
                <div className="mt-2 text-center">
                  <div className="text-xs font-medium text-slate-700">{step.title}</div>
                  <div className="text-xs text-slate-500 capitalize">{step.status}</div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    index < currentStepIndex ? "bg-green-500" : "bg-slate-300"
                  }`}
                  aria-hidden="true"
                />
              )}
            </React.Fragment>
          ))}
        </div>
        {/* Mobile Progress */}
        <div className="md:hidden mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium text-slate-700">
              Step {currentStepIndex + 1} of {steps.length}
            </span>
            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-600 transition-all duration-300"
                style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                aria-hidden="true"
              />
            </div>
          </div>
          <div className="text-sm font-semibold text-slate-900">{currentStep.title}</div>
        </div>
      </div>

      {/* Current Step Content */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-slate-900">{currentStep.title}</h3>
          <div className="text-sm text-slate-600">
            Step {currentStepIndex + 1} of {steps.length}
          </div>
        </div>

        <div className="space-y-4">
          {currentStep.type === "use-case" && (
            <UseCaseStep onComplete={(data) => handleStepComplete(currentStep.id, data)} />
          )}
          {currentStep.type === "dataset" && (
            <DatasetStep onComplete={(data) => handleStepComplete(currentStep.id, data)} />
          )}
          {currentStep.type === "model" && (
            <ModelStep onComplete={(data) => handleStepComplete(currentStep.id, data)} />
          )}
          {currentStep.type === "training" && (
            <TrainingStep onComplete={(data) => handleStepComplete(currentStep.id, data)} />
          )}
          {currentStep.type === "validation" && (
            <ValidationStep steps={steps} onComplete={(data) => handleStepComplete(currentStep.id, data)} />
          )}
          {currentStep.type === "deploy" && (
            <DeployStep steps={steps} onComplete={(data) => handleStepComplete(currentStep.id, data)} />
          )}
        </div>
      </div>

      {/* Error Display */}
      {saveError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {saveError}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
          aria-busy={isSaving}
          aria-label="Save workflow progress"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" aria-hidden="true" />
              <span>Save Progress</span>
            </>
          )}
        </button>

        <div className="flex gap-3">
          {currentStepIndex > 0 && (
            <button
              onClick={() => {
                setCurrentStepIndex(currentStepIndex - 1);
                setSteps((prev) =>
                  prev.map((s, i) => {
                    if (i === currentStepIndex - 1) {
                      return { ...s, status: "in-progress" };
                    }
                    if (i === currentStepIndex) {
                      return { ...s, status: "pending" };
                    }
                    return s;
                  })
                );
              }}
              className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Previous
            </button>
          )}

          {allCompleted && (
            <button
              onClick={handleRun}
              className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
              aria-label="Run workflow"
            >
              <Play className="w-4 h-4" aria-hidden="true" />
              Run Workflow
            </button>
          )}
        </div>
      </div>
      </div>
    </ErrorBoundaryWrapper>
  );
}

// Step Components
function UseCaseStep({ onComplete }: { onComplete: (data: { useCase: string }) => void }) {
  const [selectedUseCase, setSelectedUseCase] = useState("");

  const useCases = [
    { id: "classification", label: "Classification", description: "Categorize data into classes" },
    { id: "regression", label: "Regression", description: "Predict numerical values" },
    { id: "generation", label: "Text/Image Generation", description: "Generate new content" },
    { id: "analysis", label: "Data Analysis", description: "Analyze and extract insights" },
  ];

  return (
    <div className="space-y-4">
      <p className="text-slate-700">Select the type of AI task you want to accomplish:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {useCases.map((uc) => (
          <button
            key={uc.id}
            onClick={() => setSelectedUseCase(uc.id)}
            className={`p-4 rounded-xl border-2 text-left transition-all ${
              selectedUseCase === uc.id
                ? "border-purple-500 bg-purple-50"
                : "border-slate-200 hover:border-slate-300"
            }`}
            aria-pressed={selectedUseCase === uc.id}
            aria-label={`Select ${uc.label} use case`}
          >
            <h4 className="font-semibold text-slate-900 mb-1">{uc.label}</h4>
            <p className="text-sm text-slate-600">{uc.description}</p>
          </button>
        ))}
      </div>
      {selectedUseCase && (
        <button
          onClick={() => onComplete({ useCase: selectedUseCase })}
          className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
        >
          Continue
        </button>
      )}
    </div>
  );
}

function DatasetStep({ onComplete }: { onComplete: (data: { dataset: string }) => void }) {
  return (
    <div className="space-y-4">
      <p className="text-slate-700">Upload a dataset or select from examples:</p>
      <div className="flex gap-4">
        <button className="flex-1 px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
          Upload Dataset
        </button>
        <button className="flex-1 px-4 py-3 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
          Browse Examples
        </button>
      </div>
      <button
        onClick={() => onComplete({ dataset: "example" })}
        className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
      >
        Continue with Example
      </button>
    </div>
  );
}

function ModelStep({ onComplete }: { onComplete: (data: { model: string }) => void }) {
  return (
    <div className="space-y-4">
      <p className="text-slate-700">Choose a model architecture:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {["Simple Neural Network", "ResNet", "BERT"].map((model) => (
          <button
            key={model}
            onClick={() => onComplete({ model })}
            className="p-4 border border-slate-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all text-left"
            aria-label={`Select ${model} model`}
          >
            <h4 className="font-semibold text-slate-900">{model}</h4>
          </button>
        ))}
      </div>
    </div>
  );
}

function TrainingStep({ onComplete }: { onComplete: (data: { training: { epochs: number; batchSize: number } }) => void }) {
  return (
    <div className="space-y-4">
      <p className="text-slate-700">Configure training parameters:</p>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Epochs</label>
          <input type="number" defaultValue={10} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Batch Size</label>
          <input type="number" defaultValue={32} className="w-full px-3 py-2 border border-slate-300 rounded-lg" />
        </div>
      </div>
      <button
        onClick={() => onComplete({ training: { epochs: 10, batchSize: 32 } })}
        className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
      >
        Continue
      </button>
    </div>
  );
}

function ValidationStep({ steps, onComplete }: { steps: WorkflowStep[]; onComplete: (data: { validated: boolean }) => void }) {
  return (
    <div className="space-y-4">
      <p className="text-slate-700">Review your configuration:</p>
      <div className="space-y-2">
        {steps.slice(0, -2).map((step) => (
          <div key={step.id} className="p-3 bg-slate-50 rounded-lg">
            <div className="font-medium text-slate-900">{step.title}</div>
            <div className="text-sm text-slate-600">
              {step.data ? JSON.stringify(step.data) : "Not configured"}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => onComplete({ validated: true })}
        className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
      >
        Validate and Continue
      </button>
    </div>
  );
}

function DeployStep({ steps, onComplete }: { steps: WorkflowStep[]; onComplete: (data: { deployment: string }) => void }) {
  return (
    <div className="space-y-4">
      <p className="text-slate-700">Choose deployment option:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => onComplete({ deployment: "api" })}
          className="p-4 border border-slate-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all text-left"
          aria-label="Deploy as API"
        >
          <h4 className="font-semibold text-slate-900 mb-1">Deploy as API</h4>
          <p className="text-sm text-slate-600">Deploy to cloud for production use</p>
        </button>
        <button
          onClick={() => onComplete({ deployment: "export" })}
          className="p-4 border border-slate-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all text-left"
          aria-label="Export model"
        >
          <h4 className="font-semibold text-slate-900 mb-1">Export Model</h4>
          <p className="text-sm text-slate-600">Download model for local use</p>
        </button>
      </div>
    </div>
  );
}

