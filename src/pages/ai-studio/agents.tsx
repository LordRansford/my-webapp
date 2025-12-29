/**
 * AI Studio - Agents Page
 * 
 * Example page demonstrating agent management
 */

import React, { useState } from "react";
import { AIStudioErrorBoundary } from "@/components/ai-studio/AIStudioErrorBoundary";
import { useAgents } from "@/hooks/useAgents";
import ErrorDisplay from "@/components/ai-studio/ErrorDisplay";
import LoadingSpinner from "@/components/ai-studio/LoadingSpinner";
import StatusBadge from "@/components/ai-studio/StatusBadge";
import EmptyState from "@/components/ai-studio/EmptyState";
import { useApiError } from "@/hooks/useApiError";
import { Bot, Plus, Play, Settings, Trash2 } from "lucide-react";
import { api } from "@/lib/ai-studio/api-client";

export default function AgentsPage() {
  const { error, handleError, clearError, retry } = useApiError();
  const { agents, isLoading, create } = useAgents({ autoFetch: true, onError: handleError });
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [runningAgentId, setRunningAgentId] = useState<string | null>(null);

  const selectedAgent = selectedAgentId
    ? agents.find((a) => a.id === selectedAgentId)
    : null;

  const handleCreateAgent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      await create({
        name: formData.get("name") as string,
        description: formData.get("description") as string || undefined,
        config: {
          model: formData.get("model") as string,
          temperature: parseFloat(formData.get("temperature") as string) || 0.7,
        },
      });
      setShowCreateForm(false);
    } catch (err) {
      handleError(err);
    }
  };

  const handleRunAgent = async (agentId: string) => {
    setRunningAgentId(agentId);
    try {
      const result = await retry(() =>
        api.agents.run({
          agentId,
          input: "Hello, how can you help me?",
        })
      );
      console.log("Agent result:", result);
      alert("Agent executed successfully! Check console for results.");
    } catch (err) {
      handleError(err);
    } finally {
      setRunningAgentId(null);
    }
  };

  return (
    <AIStudioErrorBoundary>
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                  <Bot className="w-8 h-8 text-primary-600" />
                  AI Agents
                </h1>
                <p className="text-slate-600 mt-2">
                  Create and manage AI agents. Configure models, tools, and memory for intelligent automation.
                </p>
              </div>
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="button primary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Agent
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6">
              <ErrorDisplay
                error={error}
                onRetry={() => retry(() => Promise.resolve())}
                onDismiss={clearError}
              />
            </div>
          )}

          {/* Create Form */}
          {showCreateForm && (
            <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Create New Agent</h2>
              <form onSubmit={handleCreateAgent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Agent Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="My AI Agent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="What does this agent do?"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Model
                    </label>
                    <select
                      name="model"
                      required
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="gpt-4">GPT-4</option>
                      <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                      <option value="claude-3">Claude 3</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Temperature
                    </label>
                    <input
                      type="number"
                      name="temperature"
                      min="0"
                      max="2"
                      step="0.1"
                      defaultValue="0.7"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="button primary">
                    Create Agent
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="button secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Agents List */}
          {isLoading ? (
            <LoadingSpinner message="Loading agents..." />
          ) : agents.length === 0 ? (
            <EmptyState
              icon={Bot}
              title="No agents yet"
              description="Create your first AI agent to get started with intelligent automation."
              action={{
                label: "Create Agent",
                onClick: () => setShowCreateForm(true),
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all cursor-pointer ${
                    selectedAgentId === agent.id
                      ? "ring-2 ring-primary-500 border-primary-500"
                      : "hover:shadow-md"
                  }`}
                  onClick={() => setSelectedAgentId(agent.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary-100 rounded-lg">
                        <Bot className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{agent.name}</h3>
                        <StatusBadge status={agent.status} className="mt-1" />
                      </div>
                    </div>
                  </div>
                  {agent.description && (
                    <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                      {agent.description}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRunAgent(agent.id);
                      }}
                      disabled={runningAgentId === agent.id}
                      className="flex-1 button secondary text-sm flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      {runningAgentId === agent.id ? "Running..." : "Run"}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAgentId(agent.id);
                      }}
                      className="button secondary text-sm p-2"
                      title="Settings"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AIStudioErrorBoundary>
  );
}

