/**
 * Custom Hook: Training Job Management
 * 
 * Manages training job state, polling, and updates
 */

import { useState, useEffect, useCallback } from "react";

interface TrainingJob {
  id: string;
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
  cost?: number;
}

interface UseTrainingJobOptions {
  jobId: string | null;
  pollInterval?: number;
  onComplete?: (job: TrainingJob) => void;
  onError?: (error: Error) => void;
}

export function useTrainingJob({
  jobId,
  pollInterval = 2000,
  onComplete,
  onError,
}: UseTrainingJobOptions) {
  const [job, setJob] = useState<TrainingJob | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchJob = useCallback(async () => {
    if (!jobId) return;

    try {
      setIsLoading(true);
      setError(null);

      // In production, this would be: GET /api/ai-studio/jobs/:jobId
      const response = await fetch(`/api/ai-studio/jobs/${jobId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch job");
      }

      const data = await response.json();
      setJob(data.job);

      // Call callbacks
      if (data.job.status === "completed" && onComplete) {
        onComplete(data.job);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error);
      if (onError) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [jobId, onComplete, onError]);

  // Poll for updates when job is running
  useEffect(() => {
    if (!jobId) return;

    // Initial fetch
    fetchJob();

    // Set up polling if job is active
    if (job?.status === "running" || job?.status === "queued") {
      const interval = setInterval(() => {
        fetchJob();
      }, pollInterval);

      return () => clearInterval(interval);
    }
  }, [jobId, job?.status, pollInterval, fetchJob]);

  const cancelJob = useCallback(async () => {
    if (!jobId) return;

    try {
      const response = await fetch(`/api/ai-studio/jobs/${jobId}/cancel`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to cancel job");
      }

      // Refresh job status
      await fetchJob();
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error);
      if (onError) {
        onError(error);
      }
    }
  }, [jobId, fetchJob, onError]);

  return {
    job,
    isLoading,
    error,
    refetch: fetchJob,
    cancel: cancelJob,
  };
}

