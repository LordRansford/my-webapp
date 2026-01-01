"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Activity, Cpu, HardDrive, Zap, AlertTriangle, TrendingUp } from "lucide-react";

interface ResourceUsage {
  cpu: number; // percentage
  memory: number; // percentage
  storage: number; // bytes
  network?: number; // bytes/sec
}

interface ScaleManagerProps {
  currentUsage: ResourceUsage;
  limits?: ResourceUsage;
  onScale?: (scale: number) => Promise<void>;
  showControls?: boolean;
  className?: string;
}

export function ScaleManager({
  currentUsage,
  limits = { cpu: 100, memory: 100, storage: 1024 * 1024 * 1024 }, // 1GB default
  onScale,
  showControls = true,
  className = ""
}: ScaleManagerProps) {
  const [scaling, setScaling] = useState(false);
  const [scaleFactor, setScaleFactor] = useState(1);

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  const getUsageColor = (usage: number, limit: number) => {
    const percentage = (usage / limit) * 100;
    if (percentage >= 90) return "text-rose-600";
    if (percentage >= 70) return "text-amber-600";
    return "text-emerald-600";
  };

  const getUsageBarColor = (usage: number, limit: number) => {
    const percentage = (usage / limit) * 100;
    if (percentage >= 90) return "bg-rose-600";
    if (percentage >= 70) return "bg-amber-600";
    return "bg-emerald-600";
  };

  const handleScale = useCallback(async () => {
    if (!onScale) return;
    setScaling(true);
    try {
      await onScale(scaleFactor);
    } catch (error) {
      console.error("Scaling failed:", error);
    } finally {
      setScaling(false);
    }
  }, [onScale, scaleFactor]);

  const cpuPercentage = (currentUsage.cpu / limits.cpu) * 100;
  const memoryPercentage = (currentUsage.memory / limits.memory) * 100;
  const storagePercentage = (currentUsage.storage / limits.storage) * 100;

  const isNearLimit = cpuPercentage >= 80 || memoryPercentage >= 80 || storagePercentage >= 80;

  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-sky-600" />
          <h3 className="text-lg font-semibold text-slate-900">Scale & Performance</h3>
        </div>
        {isNearLimit && (
          <div className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">Near Limits</span>
          </div>
        )}
      </div>

      {/* Resource Usage */}
      <div className="space-y-4 mb-6">
        {/* CPU Usage */}
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-slate-600" />
              <span className="font-medium text-slate-700">CPU</span>
            </div>
            <span className={getUsageColor(currentUsage.cpu, limits.cpu)}>
              {currentUsage.cpu.toFixed(1)}% / {limits.cpu}%
            </span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${getUsageBarColor(currentUsage.cpu, limits.cpu)} transition-all duration-300`}
              style={{ width: `${Math.min(cpuPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Memory Usage */}
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-slate-600" />
              <span className="font-medium text-slate-700">Memory</span>
            </div>
            <span className={getUsageColor(currentUsage.memory, limits.memory)}>
              {currentUsage.memory.toFixed(1)}% / {limits.memory}%
            </span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${getUsageBarColor(currentUsage.memory, limits.memory)} transition-all duration-300`}
              style={{ width: `${Math.min(memoryPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Storage Usage */}
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-slate-600" />
              <span className="font-medium text-slate-700">Storage</span>
            </div>
            <span className={getUsageColor(currentUsage.storage, limits.storage)}>
              {formatBytes(currentUsage.storage)} / {formatBytes(limits.storage)}
            </span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${getUsageBarColor(currentUsage.storage, limits.storage)} transition-all duration-300`}
              style={{ width: `${Math.min(storagePercentage, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Scaling Controls */}
      {showControls && onScale && (
        <div className="border-t border-slate-200 pt-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Scale Factor: {scaleFactor}x
              </label>
              <input
                type="range"
                min={0.5}
                max={10}
                step={0.5}
                value={scaleFactor}
                onChange={(e) => setScaleFactor(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>0.5x</span>
                <span>5x</span>
                <span>10x</span>
              </div>
            </div>
            <button
              onClick={handleScale}
              disabled={scaling}
              className="px-4 py-2 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              {scaling ? "Scaling..." : "Apply Scale"}
            </button>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {isNearLimit && (
        <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200">
          <div className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-medium mb-1">Resource Usage High</p>
              <p>Consider scaling up or optimizing your workflow to prevent performance issues.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
