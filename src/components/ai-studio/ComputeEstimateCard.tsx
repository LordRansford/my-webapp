"use client";

/**
 * Compute Estimate Card Component
 * 
 * Displays cost and duration estimates for AI operations
 */

import React, { useState, useEffect } from "react";
import { Calculator, Clock, DollarSign, Zap } from "lucide-react";
import { estimateComputeCost, formatCost, formatDuration, type ComputeRequest } from "@/lib/ai-studio/compute";

interface ComputeEstimateCardProps {
  request: ComputeRequest;
  onEstimateChange?: (estimate: any) => void;
}

export default function ComputeEstimateCard({
  request,
  onEstimateChange,
}: ComputeEstimateCardProps) {
  const [estimate, setEstimate] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEstimate = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/ai-studio/compute/estimate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(request),
        });

        if (!response.ok) {
          throw new Error("Failed to get estimate");
        }

        const data = await response.json();
        setEstimate(data.data);
        if (onEstimateChange) {
          onEstimateChange(data.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

    if (request.model) {
      fetchEstimate();
    }
  }, [request, onEstimateChange]);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center gap-3">
          <Calculator className="w-5 h-5 text-slate-400 animate-pulse" />
          <span className="text-sm text-slate-600">Calculating estimate...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <p className="text-sm font-semibold text-red-900">Error</p>
        <p className="text-sm text-red-700 mt-1">{error}</p>
      </div>
    );
  }

  if (!estimate) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-5 h-5 text-primary-600" />
        <h3 className="font-semibold text-slate-900">Cost Estimate</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 bg-white rounded-lg border border-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="text-xs text-slate-600">Estimated Cost</span>
          </div>
          <p className="text-lg font-bold text-slate-900">
            {formatCost(estimate.estimatedCost)}
          </p>
        </div>

        <div className="p-3 bg-white rounded-lg border border-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-xs text-slate-600">Duration</span>
          </div>
          <p className="text-lg font-bold text-slate-900">
            {formatDuration(estimate.estimatedDuration)}
          </p>
        </div>
      </div>

      {estimate.computeUnits > 1 && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200 mb-4">
          <Zap className="w-4 h-4 text-amber-600" />
          <span className="text-xs text-amber-800">
            {estimate.computeUnits} compute unit{estimate.computeUnits > 1 ? "s" : ""} required
          </span>
        </div>
      )}

      {estimate.breakdown && (
        <details className="mt-4">
          <summary className="text-sm font-medium text-slate-700 cursor-pointer">
            View breakdown
          </summary>
          <div className="mt-3 space-y-2 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Model complexity:</span>
              <span>${estimate.breakdown.model.toFixed(4)}/hr</span>
            </div>
            {estimate.breakdown.dataset > 0 && (
              <div className="flex justify-between">
                <span>Dataset processing:</span>
                <span>${estimate.breakdown.dataset.toFixed(4)}/hr</span>
              </div>
            )}
            {estimate.breakdown.gpuHours && (
              <div className="flex justify-between">
                <span>GPU hours:</span>
                <span>{estimate.breakdown.gpuHours.toFixed(2)}</span>
              </div>
            )}
          </div>
        </details>
      )}
    </div>
  );
}

