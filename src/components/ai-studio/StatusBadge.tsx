"use client";

/**
 * Status Badge Component
 * 
 * Displays status with appropriate color coding
 */

import React from "react";
import { getStatusColor } from "@/lib/ai-studio/formatters";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export default function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const colorClasses = getStatusColor(status);
  const displayStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorClasses} ${className}`}
    >
      {displayStatus}
    </span>
  );
}

