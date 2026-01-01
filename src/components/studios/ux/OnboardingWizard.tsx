"use client";

import React, { useState, useCallback } from "react";
import { GraduationCap, ArrowRight, ArrowLeft, CheckCircle2, X } from "lucide-react";

interface OnboardingStep {
  id: string;
  title: string;
  content: React.ReactNode;
  skipable?: boolean;
}

interface OnboardingWizardProps {
  steps: OnboardingStep[];
  onComplete?: () => void;
  onSkip?: () => void;
  showProgress?: boolean;
  className?: string;
}

export function OnboardingWizard({
  steps,
  onComplete,
  onSkip,
  showProgress = true,
  className = ""
}: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const handleNext = useCallback(() => {
    setCompletedSteps(prev => new Set([...prev, currentStep]));
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      if (onComplete) {
        onComplete();
      }
    }
  }, [currentStep, steps.length, onComplete]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const handleSkip = useCallback(() => {
    if (onSkip) {
      onSkip();
    } else if (onComplete) {
      onComplete();
    }
  }, [onSkip, onComplete]);

  const progress = ((currentStep + 1) / steps.length) * 100;
  const currentStepData = steps[currentStep];

  if (!currentStepData) {
    return null;
  }

  return (
    <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 ${className}`}>
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-sky-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Welcome to Studios</h2>
              <p className="text-sm text-slate-600">Step {currentStep + 1} of {steps.length}</p>
            </div>
          </div>
          <button
            onClick={handleSkip}
            className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Skip"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        {showProgress && (
          <div className="px-6 py-4 border-b border-slate-200">
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
        )}

        {/* Step Indicators */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-center gap-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentStep
                  ? "bg-sky-600 w-8"
                  : completedSteps.has(index)
                  ? "bg-emerald-600"
                  : "bg-slate-300"
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <h3 className="text-2xl font-semibold text-slate-900 mb-4">
            {currentStepData.title}
          </h3>
          <div className="text-slate-700">
            {currentStepData.content}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex gap-2">
            {currentStepData.skipable && (
              <button
                onClick={handleSkip}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                Skip
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition-colors flex items-center gap-2"
            >
              {currentStep === steps.length - 1 ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Complete
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
