/**
 * Custom Hook: Training Jobs Management
 * 
 * Manages list of training jobs with real-time updates
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { useTrainingJob } from "./useTrainingJob";

interface TrainingJob {
  id: string;
  modelId: string;
  datasetId: string;
  status: string;
  progress: number;
  computeType: string;
  createdAt: string;
}

interface UseTrainingJobsOptions {
  limit?: number;
  offset?: number;
  status?: string;
  autoFetch?: boolean;
  pollInterval?: number; // Poll for updates
  onError?: (error: Error) => void;
}

export function useTrainingJobs({
  limit = 50,
  offset = 0,
  status,
  autoFetch = true,
  pollInterval = 5000, // 5 seconds
  onError,
}: UseTrainingJobsOptions = {}) {
  const [jobs, setJobs] = useState<TrainingJob[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchJobs = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
      });
      if (status) {
        params.append("status", status);
      }

      const response = await fetch(`/api/ai-studio/jobs?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch training jobs");
      }

      const data = await response.json();
      setJobs(data.data.jobs);
      setTotal(data.data.pagination.total);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error);
      if (onError) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [limit, offset, status, onError]);

  useEffect(() => {
    if (autoFetch) {
      fetchJobs();
    }
  }, [autoFetch, fetchJobs]);

  // Poll for updates on active jobs
  useEffect(() => {
    if (pollInterval > 0 && jobs.some((job) => job.status === "running" || job.status === "queued")) {
      pollIntervalRef.current = setInterval(() => {
        fetchJobs();
      }, pollInterval);

      return () => {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
        }
      };
    }
  }, [jobs, pollInterval, fetchJobs]);

  const createJob = useCallback(async (jobData: {
    modelId: string;
    datasetId: string;
    computeType?: string;
    config: any;
  }) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/ai-studio/models/train", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        throw new Error("Failed to create training job");
      }

      const data = await response.json();
      setJobs((prev) => [data.data.job, ...prev]);
      return data.data.job;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error);
      if (onError) {
        onError(error);
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [onError]);

  return {
    jobs,
    isLoading,
    error,
    total,
    refetch: fetchJobs,
    create: createJob,
  };
}

