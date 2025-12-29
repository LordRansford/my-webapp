/**
 * Custom Hook: Models List Management
 * 
 * Manages list of AI models with pagination and filtering
 */

import { useState, useEffect, useCallback } from "react";

interface Model {
  id: string;
  name: string;
  type: string;
  status: string;
  version: string;
  createdAt: string;
}

interface UseModelsOptions {
  limit?: number;
  offset?: number;
  status?: string;
  autoFetch?: boolean;
  onError?: (error: Error) => void;
}

export function useModels({
  limit = 50,
  offset = 0,
  status,
  autoFetch = true,
  onError,
}: UseModelsOptions = {}) {
  const [models, setModels] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);

  const fetchModels = useCallback(async () => {
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

      const response = await fetch(`/api/ai-studio/models?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch models");
      }

      const data = await response.json();
      setModels(data.data.models);
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
      fetchModels();
    }
  }, [autoFetch, fetchModels]);

  const createModel = useCallback(async (modelData: {
    name: string;
    description?: string;
    type: string;
    architecture: any;
  }) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/ai-studio/models", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(modelData),
      });

      if (!response.ok) {
        throw new Error("Failed to create model");
      }

      const data = await response.json();
      setModels((prev) => [data.data.model, ...prev]);
      return data.data.model;
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
    models,
    isLoading,
    error,
    total,
    refetch: fetchModels,
    create: createModel,
  };
}

