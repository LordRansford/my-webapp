"use client";

/**
 * Training Job Monitor Component
 * 
 * Real-time monitoring of training jobs with metrics visualization
 */

import React, { useEffect, useState } from "react";
import { Play, Pause, Square, TrendingUp, Clock, DollarSign } from "lucide-react";

interface TrainingJob {
  id: string;
  modelId: string;
  status: "queued" | "running" | "completed" | "failed" | "cancelled";
  progress: number;
  currentEpoch?: number;
  totalEpochs?: number;
  metrics?: {
    loss: number;
    accuracy: number;
    valLoss?: number;
    valAccuracy?: number;
  };
  metricsHistory?: {
    loss: number[];
    accuracy: number[];
    valLoss?: number[];
    valAccuracy?: number[];
  };
  startedAt?: string;
  estimatedCompletion?: string;
  cost?: number;
}

interface TrainingJobMonitorProps {
  jobId: string;
  onCancel?: () => void;
}

export default function TrainingJobMonitor({ jobId, onCancel }: TrainingJobMonitorProps) {
  const [job, setJob] = useState<TrainingJob | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  // Simulate polling for job updates
  useEffect(() => {
    if (!jobId) return;

    // Initial fetch
    fetchJob();

    // Poll every 2 seconds if job is running
    if (job?.status === "running") {
      setIsPolling(true);
      const interval = setInterval(() => {
        fetchJob();
      }, 2000);

      return () => {
        clearInterval(interval);
        setIsPolling(false);
      };
    }
  }, [jobId, job?.status]);

  const fetchJob = async () => {
    // In production, this would call: GET /api/ai-studio/jobs/:jobId
    // Simulated response
    const simulatedJob: TrainingJob = {
      id: jobId,
      modelId: "model_123",
      status: "running",
      progress: 0.65,
      currentEpoch: 65,
      totalEpochs: 100,
      metrics: {
        loss: 0.15,
        accuracy: 0.92,
        valLoss: 0.18,
        valAccuracy: 0.90,
      },
      metricsHistory: {
        loss: Array.from({ length: 65 }, (_, i) => 0.5 - (i * 0.005)),
        accuracy: Array.from({ length: 65 }, (_, i) => 0.7 + (i * 0.003)),
        valLoss: Array.from({ length: 65 }, (_, i) => 0.5 - (i * 0.004)),
        valAccuracy: Array.from({ length: 65 }, (_, i) => 0.7 + (i * 0.003)),
      },
      startedAt: new Date(Date.now() - 130000).toISOString(),
      estimatedCompletion: new Date(Date.now() + 70000).toISOString(),
      cost: 0.35,
    };

    setJob(simulatedJob);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getElapsedTime = () => {
    if (!job?.startedAt) return 0;
    return Math.floor((Date.now() - new Date(job.startedAt).getTime()) / 1000);
  };

  const getEstimatedTimeRemaining = () => {
    if (!job?.estimatedCompletion) return 0;
    return Math.floor((new Date(job.estimatedCompletion).getTime() - Date.now()) / 1000);
  };

  if (!job) {
    return (
      <div className="p-8 bg-white rounded-2xl border border-slate-200 shadow-lg">
        <div className="text-center text-slate-500">Loading job information...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Training Job Monitor</h3>
            <p className="text-sm text-slate-600 mt-1">Job ID: {job.id}</p>
          </div>
          <div className="flex items-center gap-2">
            {job.status === "running" && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                Running
              </div>
            )}
            {job.status === "completed" && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                Completed
              </div>
            )}
            {job.status === "failed" && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                Failed
              </div>
            )}
            {onCancel && job.status === "running" && (
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold flex items-center gap-2"
              >
                <Square className="w-4 h-4" />
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="p-6 space-y-4">
        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="font-medium text-slate-700">
              Epoch {job.currentEpoch || 0} / {job.totalEpochs || 0}
            </span>
            <span className="text-slate-600">{Math.round(job.progress * 100)}%</span>
          </div>
          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300"
              style={{ width: `${job.progress * 100}%` }}
            />
          </div>
        </div>

        {/* Metrics Grid */}
        {job.metrics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="text-sm text-slate-600 mb-1">Loss</div>
              <div className="text-2xl font-bold text-slate-900">
                {job.metrics.loss.toFixed(4)}
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="text-sm text-slate-600 mb-1">Accuracy</div>
              <div className="text-2xl font-bold text-green-600">
                {(job.metrics.accuracy * 100).toFixed(2)}%
              </div>
            </div>
            {job.metrics.valLoss !== undefined && (
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="text-sm text-slate-600 mb-1">Val Loss</div>
                <div className="text-2xl font-bold text-slate-900">
                  {job.metrics.valLoss.toFixed(4)}
                </div>
              </div>
            )}
            {job.metrics.valAccuracy !== undefined && (
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="text-sm text-slate-600 mb-1">Val Accuracy</div>
                <div className="text-2xl font-bold text-green-600">
                  {(job.metrics.valAccuracy * 100).toFixed(2)}%
                </div>
              </div>
            )}
          </div>
        )}

        {/* Time & Cost Info */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-400" />
            <div>
              <div className="text-xs text-slate-600">Elapsed</div>
              <div className="text-sm font-semibold text-slate-900">
                {formatDuration(getElapsedTime())}
              </div>
            </div>
          </div>
          {job.estimatedCompletion && (
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-slate-400" />
              <div>
                <div className="text-xs text-slate-600">Remaining</div>
                <div className="text-sm font-semibold text-slate-900">
                  {formatDuration(getEstimatedTimeRemaining())}
                </div>
              </div>
            </div>
          )}
          {job.cost !== undefined && (
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-slate-400" />
              <div>
                <div className="text-xs text-slate-600">Cost</div>
                <div className="text-sm font-semibold text-slate-900">${job.cost.toFixed(4)}</div>
              </div>
            </div>
          )}
        </div>

        {/* Metrics Chart Placeholder */}
        {job.metricsHistory && job.metricsHistory.loss.length > 0 && (
          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary-500" />
              <h4 className="font-semibold text-slate-900">Training Metrics</h4>
            </div>
            <div className="h-64 flex items-center justify-center text-slate-500">
              <div className="text-center">
                <p>Chart visualization would go here</p>
                <p className="text-xs mt-2">
                  Loss: {job.metricsHistory.loss.length} points | Accuracy:{" "}
                  {job.metricsHistory.accuracy.length} points
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

