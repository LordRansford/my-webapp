"use client";

import React from "react";
import { CheckCircle2, Circle, Clock } from "lucide-react";

interface ProgressBadgeProps {
  status: "completed" | "in-progress" | "not-started";
  label?: string;
  className?: string;
}

export default function ProgressBadge({ 
  status, 
  label,
  className = "" 
}: ProgressBadgeProps) {
  const getIcon = () => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case "in-progress":
        return <Clock className="w-4 h-4 text-blue-600" />;
      default:
        return <Circle className="w-4 h-4 text-slate-400" />;
    }
  };

  const getStyles = () => {
    switch (status) {
      case "completed":
        return "bg-green-50 text-green-700 border-green-200";
      case "in-progress":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium ${getStyles()} ${className}`}>
      {getIcon()}
      {label && <span>{label}</span>}
    </div>
  );
}

