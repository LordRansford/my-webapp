/**
 * Custom Hook: Dataset Management
 * 
 * Manages dataset state, fetching, and operations
 */

import { useState, useEffect, useCallback } from "react";

interface Dataset {
  id: string;
  name: string;
  type: string;
  size: number;
  rows?: number;
  columns?: number;
  license: string;
  status: string;
  qualityScore?: number;
  createdAt: string;
  updatedAt: string;
}

interface UseDatasetOptions {
  datasetId: string | null;
  autoFetch?: boolean;
  onError?: (error: Error) => void;
}

export function useDataset({ datasetId, autoFetch = true, onError }: UseDatasetOptions) {
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchDataset = useCallback(async () => {
    if (!datasetId) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/ai-studio/datasets/${datasetId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch dataset");
      }

      const data = await response.json();
      setDataset(data.data.dataset);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error);
      if (onError) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [datasetId, onError]);

  useEffect(() => {
    if (autoFetch && datasetId) {
      fetchDataset();
    }
  }, [datasetId, autoFetch, fetchDataset]);

  const updateDataset = useCallback(async (updates: Partial<Dataset>) => {
    if (!datasetId) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/ai-studio/datasets/${datasetId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to update dataset");
      }

      const data = await response.json();
      setDataset(data.data.dataset);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error);
      if (onError) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [datasetId, onError]);

  const deleteDataset = useCallback(async () => {
    if (!datasetId) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/ai-studio/datasets/${datasetId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete dataset");
      }

      setDataset(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error);
      if (onError) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [datasetId, onError]);

  return {
    dataset,
    isLoading,
    error,
    refetch: fetchDataset,
    update: updateDataset,
    delete: deleteDataset,
  };
}

