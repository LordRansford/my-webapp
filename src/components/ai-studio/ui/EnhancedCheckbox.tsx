"use client";

import React from "react";
import { Check } from "lucide-react";

interface EnhancedCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export default function EnhancedCheckbox({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className = "",
}: EnhancedCheckboxProps) {
  return (
    <label
      className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
        checked
          ? "border-purple-500 bg-purple-50"
          : "border-slate-200 bg-white hover:border-slate-300"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      <div className="flex-shrink-0 mt-0.5">
        <div
          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
            checked
              ? "border-purple-600 bg-purple-600"
              : "border-slate-300 bg-white"
          }`}
        >
          {checked && <Check className="w-4 h-4 text-white" />}
        </div>
      </div>
      <div className="flex-1">
        <div className="font-medium text-slate-900">{label}</div>
        {description && (
          <div className="text-sm text-slate-600 mt-1">{description}</div>
        )}
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="sr-only"
        aria-label={label}
      />
    </label>
  );
}

