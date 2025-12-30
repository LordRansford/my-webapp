"use client";

import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import { X, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import SecureErrorBoundary from "@/components/studios/SecureErrorBoundary";

export interface OnboardingStep {
  id: string;
  title: string;
  content: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface OnboardingFlowProps {
  flowId: string;
  steps: OnboardingStep[];
  onComplete?: () => void;
  onSkip?: () => void;
  showProgress?: boolean;
}

const OnboardingFlow = memo(function OnboardingFlow({
  flowId,
  steps,
  onComplete,
  onSkip,
  showProgress = true
}: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const dialogRef = useRef<HTMLDivElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // Check if onboarding was completed
    const completed = localStorage.getItem(`onboarding-${flowId}-completed`);
    if (completed) {
      return;
    }

    // Check if onboarding was started
    const started = localStorage.getItem(`onboarding-${flowId}-started`);
    if (!started) {
      // Auto-start after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
        localStorage.setItem(`onboarding-${flowId}-started`, "true");
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Resume from saved step
      const savedStep = parseInt(localStorage.getItem(`onboarding-${flowId}-step`) || "0");
      setCurrentStep(savedStep);
      setIsVisible(true);
    }
  }, [flowId]);

  const handleNext = useCallback(() => {
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      if (typeof window !== "undefined") {
        localStorage.setItem(`onboarding-${flowId}-step`, nextStep.toString());
      }
      // Focus next button after state update
      setTimeout(() => nextButtonRef.current?.focus(), 0);
    } else {
      handleComplete();
    }
  }, [currentStep, steps.length, flowId]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      if (typeof window !== "undefined") {
        localStorage.setItem(`onboarding-${flowId}-step`, prevStep.toString());
      }
    }
  }, [currentStep, flowId]);

  const handleComplete = useCallback(() => {
    setIsVisible(false);
    if (typeof window !== "undefined") {
      localStorage.setItem(`onboarding-${flowId}-completed`, "true");
      localStorage.removeItem(`onboarding-${flowId}-step`);
      localStorage.removeItem(`onboarding-${flowId}-started`);
    }
    if (onComplete) {
      onComplete();
    }
    // Restore focus
    lastFocusedElement.current?.focus();
  }, [flowId, onComplete]);

  const handleSkip = useCallback(() => {
    setIsVisible(false);
    if (typeof window !== "undefined") {
      localStorage.setItem(`onboarding-${flowId}-completed`, "true");
    }
    if (onSkip) {
      onSkip();
    }
    // Restore focus
    lastFocusedElement.current?.focus();
  }, [flowId, onSkip]);

  // Keyboard navigation and focus management
  useEffect(() => {
    if (!isVisible) return;

    // Store the element that had focus before opening
    lastFocusedElement.current = document.activeElement as HTMLElement;

    // Focus the next button when step changes
    const timer = setTimeout(() => {
      nextButtonRef.current?.focus();
    }, 0);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleSkip();
        return;
      }

      // Arrow key navigation
      if (e.key === "ArrowRight" && currentStep < steps.length - 1) {
        e.preventDefault();
        handleNext();
        return;
      }

      if (e.key === "ArrowLeft" && currentStep > 0) {
        e.preventDefault();
        handlePrevious();
        return;
      }

      // Focus trap: keep focus within dialog
      if (e.key === "Tab" && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden"; // Prevent background scrolling

    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isVisible, currentStep, steps.length, handleNext, handlePrevious, handleSkip]);

  if (!isVisible || steps.length === 0) {
    return null;
  }

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <SecureErrorBoundary studio="studios">
      <div 
        ref={dialogRef}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
        aria-describedby="onboarding-content"
      >
        <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
            <div className="flex-1">
              <h2 id="onboarding-title" className="text-xl font-bold text-slate-900">Getting Started</h2>
              {showProgress && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                    <span>Step {currentStep + 1} of {steps.length}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={handleSkip}
              className="text-slate-400 hover:text-slate-600 transition-colors ml-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded p-1"
              aria-label="Skip onboarding"
              type="button"
            >
              <X className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>

          {/* Content */}
          <div id="onboarding-content" className="p-6">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">{step.title}</h3>
            <div className="prose prose-slate max-w-none text-slate-700">
              {step.content}
            </div>
          </div>

          {/* Actions */}
          <div className="sticky bottom-0 bg-white border-t border-slate-200 p-6 flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 disabled:text-slate-400 rounded-lg text-sm font-semibold text-slate-900 transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              aria-label="Go to previous step"
              type="button"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              Previous
            </button>
            
            <div className="flex items-center gap-2">
              {steps.map((s, idx) => (
                <div
                  key={s.id}
                  className={`w-2 h-2 rounded-full ${
                    idx === currentStep
                      ? "bg-blue-600"
                      : idx < currentStep
                      ? "bg-green-500"
                      : "bg-slate-300"
                  }`}
                  aria-label={`Step ${idx + 1}`}
                />
              ))}
            </div>

            {step.action ? (
              <button
                ref={nextButtonRef}
                onClick={() => {
                  step.action?.onClick();
                  handleNext();
                }}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold text-white transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                aria-label={currentStep === steps.length - 1 ? "Complete onboarding" : "Go to next step"}
                type="button"
              >
                {step.action.label}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            ) : (
              <button
                ref={nextButtonRef}
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold text-white transition-colors flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                aria-label={currentStep === steps.length - 1 ? "Complete onboarding" : "Go to next step"}
                type="button"
              >
                {currentStep === steps.length - 1 ? "Complete" : "Next"}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </div>
    </SecureErrorBoundary>
  );
});

export default OnboardingFlow;

