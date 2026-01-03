"use client";

import React, { useState } from "react";
import { X, ArrowRight, CheckCircle2, Circle, Loader2 } from "lucide-react";
import { AIStudioExample } from "@/lib/ai-studio/examples/types";
import { createProjectFromExample, getLastOpenedProjectId, getProjectById, setLastOpenedProjectId } from "@/lib/ai-studio/projects/store";

interface ExampleLoaderProps {
  example: AIStudioExample;
  onClose: () => void;
  onLoad: () => void;
}

export default function ExampleLoader({ example, onLoad, onClose }: ExampleLoaderProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const handleLoad = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Create a real local project artefact so "Load" is not theatre.
      // This gives users something tangible to return to, export, and run.
      const lastId = getLastOpenedProjectId();
      const existing = lastId ? getProjectById(lastId) : null;
      const project =
        existing && existing.exampleId === example.id
          ? existing
          : createProjectFromExample(example);
      setLastOpenedProjectId(project.id);
      setIsLoading(false);
      onLoad();
    } catch (err) {
      setIsLoading(false);
      setError(err instanceof Error ? err.message : "Failed to load example");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">{example.title}</h2>
            <p className="text-sm text-slate-600 mt-1">{example.description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl">
              <div className="text-xs text-slate-600 mb-1">Audience</div>
              <div className="font-semibold text-slate-900 capitalize">{example.audience}</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <div className="text-xs text-slate-600 mb-1">Difficulty</div>
              <div className="font-semibold text-slate-900 capitalize">{example.difficulty}</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <div className="text-xs text-slate-600 mb-1">Time</div>
              <div className="font-semibold text-slate-900">{example.estimatedTime}</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <div className="text-xs text-slate-600 mb-1">Credits</div>
              <div className="font-semibold text-slate-900">{example.estimatedCredits}</div>
            </div>
          </div>

          {/* Preview */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
            <h3 className="font-semibold text-slate-900 mb-3">Preview</h3>
            <div className="space-y-3">
              <div>
                <div className="text-xs text-slate-600 mb-1">Input:</div>
                <div className="text-sm text-slate-900 bg-white p-2 rounded border border-slate-200">
                  {typeof example.preview.input === "string" 
                    ? example.preview.input 
                    : JSON.stringify(example.preview.input, null, 2)}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-600 mb-1">Output:</div>
                <div className="text-sm text-slate-900 bg-white p-2 rounded border border-slate-200">
                  {typeof example.preview.output === "string" 
                    ? example.preview.output 
                    : JSON.stringify(example.preview.output, null, 2)}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-600 mb-1">Explanation:</div>
                <div className="text-sm text-slate-700">{example.preview.explanation}</div>
              </div>
            </div>
          </div>

          {/* Tutorial Steps */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Step-by-Step Tutorial</h3>
            <div className="space-y-3">
              {example.tutorial.map((step, index) => (
                <div
                  key={step.step}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    index === currentStep
                      ? "border-purple-500 bg-purple-50"
                      : index < currentStep
                      ? "border-green-200 bg-green-50"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {index < currentStep ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      ) : (
                        <Circle className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-slate-600">Step {step.step}</span>
                        <h4 className="font-semibold text-slate-900">{step.title}</h4>
                      </div>
                      <p className="text-sm text-slate-700 mb-2">{step.description}</p>
                      <div className="text-xs text-slate-600 bg-white px-2 py-1 rounded border border-slate-200 inline-block">
                        {step.action}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous Step
              </button>
              <button
                onClick={() => setCurrentStep(Math.min(example.tutorial.length - 1, currentStep + 1))}
                disabled={currentStep === example.tutorial.length - 1}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Step
              </button>
            </div>
          </div>

          {/* Prerequisites */}
          {example.prerequisites.length > 0 && (
            <div className="border border-slate-200 rounded-xl p-4 bg-amber-50">
              <h3 className="font-semibold text-slate-900 mb-2">Prerequisites</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
                {example.prerequisites.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-6 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-6 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors font-medium"
            aria-label="Close example preview"
          >
            Cancel
          </button>
          <button
            onClick={handleLoad}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold disabled:opacity-50"
            aria-busy={isLoading}
            aria-label="Load example"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                <span>Loading...</span>
              </>
            ) : (
              <>
                Load Example
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

