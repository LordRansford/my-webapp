"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, ArrowRight, ArrowLeft, HelpCircle } from "lucide-react";

interface TourStep {
  id: string;
  target: string; // CSS selector
  title: string;
  content: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right" | "center";
}

interface GuidedTourProps {
  steps: TourStep[];
  tourId: string;
  onComplete?: () => void;
  onSkip?: () => void;
}

export default function GuidedTour({ steps, tourId, onComplete, onSkip }: GuidedTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const overlayRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if tour was already completed
    const completed = localStorage.getItem(`tour-${tourId}-completed`);
    if (!completed) {
      // Check if tour was started
      const started = localStorage.getItem(`tour-${tourId}-started`);
      if (!started) {
        // Auto-start after a delay
        const timer = setTimeout(() => {
          startTour();
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        // Resume from saved step
        const savedStep = parseInt(localStorage.getItem(`tour-${tourId}-step`) || "0");
        setCurrentStep(savedStep);
        startTour();
      }
    }
  }, [tourId]);

  const startTour = () => {
    setIsVisible(true);
    updatePosition();
    localStorage.setItem(`tour-${tourId}-started`, "true");
  };

  const updatePosition = () => {
    if (currentStep >= steps.length) return;

    const step = steps[currentStep];
    const targetElement = document.querySelector(step.target);
    
    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;

      const position = step.position || "bottom";
      let top = rect.top + scrollY;
      let left = rect.left + scrollX;

      switch (position) {
        case "top":
          top = rect.top + scrollY - 20;
          left = rect.left + scrollX + rect.width / 2;
          break;
        case "bottom":
          top = rect.bottom + scrollY + 20;
          left = rect.left + scrollX + rect.width / 2;
          break;
        case "left":
          top = rect.top + scrollY + rect.height / 2;
          left = rect.left + scrollX - 20;
          break;
        case "right":
          top = rect.top + scrollY + rect.height / 2;
          left = rect.right + scrollX + 20;
          break;
        case "center":
          top = rect.top + scrollY + rect.height / 2;
          left = rect.left + scrollX + rect.width / 2;
          break;
      }

      setPosition({ top, left });

      // Highlight target element
      targetElement.classList.add("tour-highlight");
      
      // Scroll into view
      targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  useEffect(() => {
    if (isVisible) {
      updatePosition();
      const handleResize = () => updatePosition();
      const handleScroll = () => updatePosition();
      
      window.addEventListener("resize", handleResize);
      window.addEventListener("scroll", handleScroll, true);
      
      return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("scroll", handleScroll, true);
        // Remove highlight
        const targetElement = document.querySelector(steps[currentStep]?.target);
        if (targetElement) {
          targetElement.classList.remove("tour-highlight");
        }
      };
    }
  }, [currentStep, isVisible, steps]);

  const handleNext = () => {
    const targetElement = document.querySelector(steps[currentStep]?.target);
    if (targetElement) {
      targetElement.classList.remove("tour-highlight");
    }

    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      localStorage.setItem(`tour-${tourId}-step`, nextStep.toString());
    } else {
      completeTour();
    }
  };

  const handlePrevious = () => {
    const targetElement = document.querySelector(steps[currentStep]?.target);
    if (targetElement) {
      targetElement.classList.remove("tour-highlight");
    }

    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      localStorage.setItem(`tour-${tourId}-step`, prevStep.toString());
    }
  };

  const handleSkip = () => {
    const targetElement = document.querySelector(steps[currentStep]?.target);
    if (targetElement) {
      targetElement.classList.remove("tour-highlight");
    }
    setIsVisible(false);
    localStorage.setItem(`tour-${tourId}-completed`, "true");
    onSkip?.();
  };

  const completeTour = () => {
    const targetElement = document.querySelector(steps[currentStep]?.target);
    if (targetElement) {
      targetElement.classList.remove("tour-highlight");
    }
    setIsVisible(false);
    localStorage.setItem(`tour-${tourId}-completed`, "true");
    localStorage.removeItem(`tour-${tourId}-started`);
    localStorage.removeItem(`tour-${tourId}-step`);
    onComplete?.();
  };

  const showAgain = () => {
    localStorage.removeItem(`tour-${tourId}-completed`);
    localStorage.removeItem(`tour-${tourId}-started`);
    localStorage.removeItem(`tour-${tourId}-step`);
    setCurrentStep(0);
    startTour();
  };

  if (!isVisible) {
    // Show help button to restart tour
    return (
      <button
        onClick={showAgain}
        className="fixed bottom-4 right-4 p-3 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-colors z-50"
        aria-label="Show guided tour"
        title="Show guided tour"
      >
        <HelpCircle className="w-5 h-5" />
      </button>
    );
  }

  const currentStepData = steps[currentStep];
  if (!currentStepData) return null;

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/50 z-40"
        onClick={handleNext}
      />

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="fixed z-50 bg-white rounded-xl shadow-2xl p-6 max-w-sm"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          transform: "translate(-50%, 0)",
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-title"
        aria-describedby="tour-content"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 id="tour-title" className="font-semibold text-slate-900 mb-1">{currentStepData.title}</h3>
            <p id="tour-content" className="text-xs text-slate-600">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
          <button
            onClick={handleSkip}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Skip tour"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div id="tour-description" className="text-sm text-slate-700 mb-4">{currentStepData.content}</div>

        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-3 py-2 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous step"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Previous
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
            aria-label={currentStep === steps.length - 1 ? "Finish tour" : "Next step"}
          >
            {currentStep === steps.length - 1 ? "Finish" : "Next"}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <style jsx global>{`
        .tour-highlight {
          position: relative;
          z-index: 45 !important;
          outline: 3px solid #9333ea !important;
          outline-offset: 2px;
          border-radius: 8px;
        }
      `}</style>
    </>
  );
}

