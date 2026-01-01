/**
 * Tutorial Overlay Component
 * 
 * Interactive tutorial system with step-by-step guidance.
 */

"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { X, ChevronRight, ChevronLeft, Check } from "lucide-react";

export interface TutorialStep {
  id: string;
  title: string;
  content: string;
  targetElement?: string; // CSS selector for element to highlight
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  interactive?: boolean; // Whether user needs to interact to proceed
  action?: string; // Description of action user needs to perform
}

interface TutorialOverlayProps {
  steps: TutorialStep[];
  onComplete?: () => void;
  onSkip?: () => void;
  startImmediately?: boolean;
}

export function TutorialOverlay({
  steps,
  onComplete,
  onSkip,
  startImmediately = false,
}: TutorialOverlayProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isActive, setIsActive] = useState(startImmediately);
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const currentStep = steps[currentStepIndex];

  // Highlight target element
  useEffect(() => {
    if (!isActive || !currentStep?.targetElement) {
      setHighlightedElement(null);
      return;
    }

    const element = document.querySelector(currentStep.targetElement) as HTMLElement;
    if (element) {
      setHighlightedElement(element);
      // Scroll element into view
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      setHighlightedElement(null);
    }
  }, [isActive, currentStep, currentStepIndex]);

  // Position tooltip relative to highlighted element
  useEffect(() => {
    if (!highlightedElement || !tooltipRef.current) return;

    const updatePosition = () => {
      const rect = highlightedElement.getBoundingClientRect();
      const tooltip = tooltipRef.current;
      if (!tooltip) return;

      const position = currentStep.position || 'bottom';
      let top = 0;
      let left = 0;

      switch (position) {
        case 'top':
          top = rect.top - tooltip.offsetHeight - 10;
          left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2;
          break;
        case 'bottom':
          top = rect.bottom + 10;
          left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2;
          break;
        case 'left':
          top = rect.top + rect.height / 2 - tooltip.offsetHeight / 2;
          left = rect.left - tooltip.offsetWidth - 10;
          break;
        case 'right':
          top = rect.top + rect.height / 2 - tooltip.offsetHeight / 2;
          left = rect.right + 10;
          break;
        case 'center':
          top = window.innerHeight / 2 - tooltip.offsetHeight / 2;
          left = window.innerWidth / 2 - tooltip.offsetWidth / 2;
          break;
      }

      tooltip.style.top = `${top}px`;
      tooltip.style.left = `${left}px`;
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [highlightedElement, currentStep]);

  const handleNext = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      setIsActive(false);
      onComplete?.();
    }
  }, [currentStepIndex, steps.length, onComplete]);

  const handlePrevious = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  }, [currentStepIndex]);

  const handleSkip = useCallback(() => {
    setIsActive(false);
    onSkip?.();
  }, [onSkip]);

  if (!isActive || steps.length === 0) {
    return null;
  }

  return (
    <>
      {/* Overlay backdrop */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/50 z-50"
        style={{
          clipPath: highlightedElement
            ? `polygon(
                0% 0%, 
                0% 100%, 
                ${highlightedElement.getBoundingClientRect().left}px 100%, 
                ${highlightedElement.getBoundingClientRect().left}px ${highlightedElement.getBoundingClientRect().top}px, 
                ${highlightedElement.getBoundingClientRect().right}px ${highlightedElement.getBoundingClientRect().top}px, 
                ${highlightedElement.getBoundingClientRect().right}px ${highlightedElement.getBoundingClientRect().bottom}px, 
                ${highlightedElement.getBoundingClientRect().left}px ${highlightedElement.getBoundingClientRect().bottom}px, 
                ${highlightedElement.getBoundingClientRect().left}px 100%, 
                100% 100%, 
                100% 0%
              )`
            : undefined,
        }}
      />

      {/* Highlighted element border */}
      {highlightedElement && (
        <div
          className="fixed z-50 pointer-events-none border-4 border-blue-500 rounded-lg shadow-lg"
          style={{
            top: highlightedElement.getBoundingClientRect().top - 4,
            left: highlightedElement.getBoundingClientRect().left - 4,
            width: highlightedElement.getBoundingClientRect().width + 8,
            height: highlightedElement.getBoundingClientRect().height + 8,
          }}
        />
      )}

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="fixed z-50 bg-white rounded-xl shadow-2xl p-6 max-w-sm border-2 border-blue-500"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="text-xs font-medium text-blue-600 mb-1">
              Step {currentStepIndex + 1} of {steps.length}
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              {currentStep.title}
            </h3>
          </div>
          <button
            onClick={handleSkip}
            className="p-1 hover:bg-slate-100 rounded transition-colors"
            aria-label="Skip tutorial"
          >
            <X className="h-5 w-5 text-slate-600" />
          </button>
        </div>

        <p className="text-sm text-slate-600 mb-4">
          {currentStep.content}
        </p>

        {currentStep.action && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-medium text-blue-900">
              {currentStep.action}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {currentStepIndex > 0 && (
              <button
                onClick={handlePrevious}
                className="px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 w-1.5 rounded-full ${
                    index === currentStepIndex
                      ? 'bg-blue-600'
                      : index < currentStepIndex
                      ? 'bg-green-600'
                      : 'bg-slate-300'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              className="px-4 py-1.5 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1"
            >
              {currentStepIndex === steps.length - 1 ? (
                <>
                  <Check className="h-4 w-4" />
                  Complete
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
