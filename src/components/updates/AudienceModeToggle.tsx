"use client";

import React, { memo } from "react";
import { Briefcase, Code, GraduationCap } from "lucide-react";

export type AudienceMode = "exec" | "engineer" | "learner";

interface AudienceModeToggleProps {
  mode: AudienceMode;
  onChange: (mode: AudienceMode) => void;
  className?: string;
}

const AudienceModeToggle = memo(function AudienceModeToggle({
  mode,
  onChange,
  className = "",
}: AudienceModeToggleProps) {
  const modes: Array<{ id: AudienceMode; label: string; icon: React.ReactNode }> = [
    { id: "exec", label: "Executive", icon: <Briefcase className="w-4 h-4" /> },
    { id: "engineer", label: "Engineer", icon: <Code className="w-4 h-4" /> },
    { id: "learner", label: "Learner", icon: <GraduationCap className="w-4 h-4" /> },
  ];
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm font-semibold text-slate-700">View as:</span>
      <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => onChange(m.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
              mode === m.id
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
            aria-pressed={mode === m.id}
            aria-label={`Switch to ${m.label} mode`}
            type="button"
          >
            {m.icon}
            <span className="hidden sm:inline">{m.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
});

export default AudienceModeToggle;
