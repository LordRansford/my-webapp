"use client";

import React from "react";
import { User, Zap, HelpCircle } from "lucide-react";

export type UserMode = "beginner" | "expert";

interface ModeToggleProps {
  mode: UserMode;
  onChange: (mode: UserMode) => void;
  showHelp?: boolean;
  className?: string;
}

export function ModeToggle({
  mode,
  onChange,
  showHelp = true,
  className = ""
}: ModeToggleProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
        <button
          onClick={() => onChange("beginner")}
          className={`px-4 py-2 rounded-md font-medium transition-all flex items-center gap-2 ${
            mode === "beginner"
              ? "bg-white text-sky-600 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <User className="w-4 h-4" />
          Beginner
        </button>
        <button
          onClick={() => onChange("expert")}
          className={`px-4 py-2 rounded-md font-medium transition-all flex items-center gap-2 ${
            mode === "expert"
              ? "bg-white text-sky-600 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Zap className="w-4 h-4" />
          Expert
        </button>
      </div>

      {showHelp && (
        <div className="group relative">
          <button
            className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Mode help"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
          <div className="absolute left-0 top-full mt-2 w-64 p-3 bg-white border border-slate-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
            <div className="text-sm text-slate-700 space-y-2">
              <div>
                <strong className="text-slate-900">Beginner Mode:</strong>
                <p className="mt-1">Guided workflows with smart defaults. Most work is automated.</p>
              </div>
              <div>
                <strong className="text-slate-900">Expert Mode:</strong>
                <p className="mt-1">Full control with advanced options and customization.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
