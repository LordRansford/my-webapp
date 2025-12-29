/**
 * Custom Hook: Agent Management
 * 
 * Manages individual AI agent state and operations
 */

import { useState, useEffect, useCallback } from "react";

interface Agent {
  id: string;
  name: string;
  description?: string;
  config: {
    model: string;
    tools?: string[];
    memory?: any;
    temperature?: number;
  };
  status: string;
  version: string;
  createdAt: string;
  updatedAt: string;
}

interface UseAgentOptions {
  agentId: string | null;
  autoFetch?: boolean;
  onError?: (error: Error) => void;
}

export function useAgent({ agentId, autoFetch = true, onError }: UseAgentOptions) {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchAgent = useCallback(async () => {
    if (!agentId) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/ai-studio/agents/${agentId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch agent");
      }

      const data = await response.json();
      setAgent(data.data.agent);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error);
      if (onError) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [agentId, onError]);

  useEffect(() => {
    if (autoFetch && agentId) {
      fetchAgent();
    }
  }, [agentId, autoFetch, fetchAgent]);

  const updateAgent = useCallback(async (updates: Partial<Agent>) => {
    if (!agentId) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/ai-studio/agents/${agentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error("Failed to update agent");
      }

      const data = await response.json();
      setAgent(data.data.agent);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error);
      if (onError) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [agentId, onError]);

  const runAgent = useCallback(async (input: string, context?: any) => {
    if (!agentId) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/ai-studio/agents/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          agentId,
          input,
          context,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to run agent");
      }

      // Handle streaming response if applicable
      const contentType = response.headers.get("content-type");
      if (contentType?.includes("text/stream") || contentType?.includes("text/event-stream")) {
        // Handle streaming
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let result = "";

        while (reader) {
          const { done, value } = await reader.read();
          if (done) break;
          result += decoder.decode(value, { stream: true });
        }

        return { output: result };
      }

      const data = await response.json();
      return data.data;
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
  }, [agentId, onError]);

  const deleteAgent = useCallback(async () => {
    if (!agentId) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/ai-studio/agents/${agentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete agent");
      }

      setAgent(null);
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      setError(error);
      if (onError) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [agentId, onError]);

  return {
    agent,
    isLoading,
    error,
    refetch: fetchAgent,
    update: updateAgent,
    run: runAgent,
    delete: deleteAgent,
  };
}

