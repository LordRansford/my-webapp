/**
 * Custom Hook: Datasets List Management
 * 
 * Manages list of datasets with pagination and filtering
 */

import { useState, useEffect, useCallback } from "react";

interface Dataset {
  id: string;
  name: string;
  type: string;
  size: number;
  status: string;
  createdAt: string;
}

interface UseDatasetsOptions {
  limit?: number;
  offset?: number;
  status?: string;
  autoFetch?: boolean;
  onError?: (error: Error) => void;
}

export function useDatasets({
  limit = 50,
  offset = 0,
  status,
  autoFetch = true,
  onError,
}: UseDatasetsOptions = {}) {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);

  const fetchDatasets = useCallback(async () => {
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

      const response = await fetch(`/api/ai-studio/datasets?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch datasets");
      }

      const data = await response.json();
      setDatasets(data.data.datasets);
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
      fetchDatasets();
    }
  }, [autoFetch, fetchDatasets]);

  const createDataset = useCallback(async (datasetData: {
    name: string;
    description?: string;
    type: string;
    size: number;
    filePath: string;
    license: string;
  }) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/ai-studio/datasets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datasetData),
      });

      if (!response.ok) {
        throw new Error("Failed to create dataset");
      }

      const data = await response.json();
      setDatasets((prev) => [data.data.dataset, ...prev]);
      return data.data.dataset;
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
    datasets,
    isLoading,
    error,
    total,
    refetch: fetchDatasets,
    create: createDataset,
  };
}

