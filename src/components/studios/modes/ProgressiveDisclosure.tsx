"use client";

import React, { useState, ReactNode } from "react";
import { ChevronDown, ChevronUp, Info } from "lucide-react";

interface ProgressiveDisclosureProps {
  title: string;
  description?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  level?: "basic" | "intermediate" | "advanced";
  className?: string;
}

const levelLabels = {
  basic: "Basic",
  intermediate: "Intermediate",
  advanced: "Expert"
};

const levelColors = {
  basic: "bg-emerald-50 border-emerald-200 text-emerald-700",
  intermediate: "bg-amber-50 border-amber-200 text-amber-700",
  advanced: "bg-rose-50 border-rose-200 text-rose-700"
};

export function ProgressiveDisclosure({
  title,
  description,
  children,
  defaultOpen = false,
  level = "basic",
  className = ""
}: ProgressiveDisclosureProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`rounded-xl border-2 transition-all ${className} ${
      isOpen ? levelColors[level] : "border-slate-200 bg-white"
    }`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-opacity-80 transition-colors text-left"
      >
        <div className="flex items-center gap-3 flex-1">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-slate-900">{title}</h4>
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${levelColors[level]}`}>
                {levelLabels[level]}
              </span>
            </div>
            {description && (
              <p className="text-sm text-slate-600 mt-1">{description}</p>
            )}
          </div>
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="border-t-2 border-current border-opacity-20 p-4">
          {children}
        </div>
      )}
    </div>
  );
}
