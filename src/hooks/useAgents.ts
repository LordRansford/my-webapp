/**
 * Custom Hook: Agents List Management
 * 
 * Manages list of AI agents with filtering
 */

import { useState, useEffect, useCallback } from "react";

interface Agent {
  id: string;
  name: string;
  description?: string;
  status: string;
  createdAt: string;
}

interface UseAgentsOptions {
  limit?: number;
  offset?: number;
  status?: string;
  autoFetch?: boolean;
  onError?: (error: Error) => void;
}

export function useAgents({
  limit = 50,
  offset = 0,
  status,
  autoFetch = true,
  onError,
}: UseAgentsOptions = {}) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [total, setTotal] = useState(0);

  const fetchAgents = useCallback(async () => {
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

      const response = await fetch(`/api/ai-studio/agents?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch agents");
      }

      const data = await response.json();
      setAgents(data.data.agents);
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
      fetchAgents();
    }
  }, [autoFetch, fetchAgents]);

  const createAgent = useCallback(async (agentData: {
    name: string;
    description?: string;
    config: any;
  }) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/ai-studio/agents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(agentData),
      });

      if (!response.ok) {
        throw new Error("Failed to create agent");
      }

      const data = await response.json();
      setAgents((prev) => [data.data.agent, ...prev]);
      return data.data.agent;
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
    agents,
    isLoading,
    error,
    total,
    refetch: fetchAgents,
    create: createAgent,
  };
}

