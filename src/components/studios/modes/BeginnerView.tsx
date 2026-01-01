"use client";

import React, { ReactNode } from "react";
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

interface Step {
  id: string;
  title: string;
  description: string;
  completed?: boolean;
  action?: () => void;
}

interface BeginnerViewProps {
  title: string;
  description?: string;
  steps?: Step[];
  currentStep?: number;
  onStepComplete?: (stepId: string) => void;
  children?: ReactNode;
  showAutomation?: boolean;
  automationMessage?: string;
  className?: string;
}

export function BeginnerView({
  title,
  description,
  steps = [],
  currentStep = 0,
  onStepComplete,
  children,
  showAutomation = true,
  automationMessage = "We'll handle most of the work automatically. Just follow the steps below.",
  className = ""
}: BeginnerViewProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-sky-50 to-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-sky-100 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-sky-600" />
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
            {description && (
              <p className="text-slate-600 mt-2">{description}</p>
            )}
            {showAutomation && (
              <div className="mt-4 p-3 bg-sky-50 border border-sky-200 rounded-lg">
                <p className="text-sm text-sky-800 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  {automationMessage}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Guided Steps */}
      {steps.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Guided Steps</h3>
          <div className="space-y-4">
            {steps.map((step, index) => {
              const isActive = index === currentStep;
              const isCompleted = step.completed || index < currentStep;
              const isUpcoming = index > currentStep;

              return (
                <div
                  key={step.id}
                  className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all ${
                    isActive
                      ? "border-sky-500 bg-sky-50"
                      : isCompleted
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex-shrink-0">
                    {isCompleted ? (
                      <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                    ) : (
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                          isActive
                            ? "bg-sky-600 text-white"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {index + 1}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900">{step.title}</h4>
                    <p className="text-sm text-slate-600 mt-1">{step.description}</p>
                    {isActive && step.action && (
                      <button
                        onClick={step.action}
                        className="mt-3 px-4 py-2 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition-colors flex items-center gap-2"
                      >
                        Continue
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Content */}
      {children && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {children}
        </div>
      )}
    </div>
  );
}
