"use client";

/**
 * Proof of Concept: AI Agent Orchestrator
 * 
 * This component demonstrates:
 * - Visual agent workflow builder
 * - Agent configuration
 * - Tool integration
 * - Execution monitoring
 * - Cost tracking
 */

import React, { useState, useCallback } from "react";
import { Play, Pause, Square, Settings, Plus, Trash2, Zap, DollarSign } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  type: "single" | "manager" | "worker";
  model: string;
  tools: string[];
  status: "idle" | "running" | "completed" | "error";
}

interface Workflow {
  agents: Agent[];
  connections: { from: string; to: string }[];
}

export type AgentOrchestratorWorkflow = Workflow;

type AgentOrchestratorPOCProps = {
  /**
   * Optional preset injected by Examples.
   */
  initialWorkflow?: Workflow;
  loadedExampleLabel?: string;
};

export default function AgentOrchestratorPOC(props: AgentOrchestratorPOCProps) {
  const [workflow, setWorkflow] = useState<Workflow>(
    () =>
      props.initialWorkflow ?? {
        agents: [
          {
            id: "1",
            name: "Research Agent",
            type: "single",
            model: "gpt-4",
            tools: ["web-search", "code-execution"],
            status: "idle",
          },
          {
            id: "2",
            name: "Analysis Agent",
            type: "single",
            model: "gpt-4",
            tools: ["data-analysis", "visualization"],
            status: "idle",
          },
        ],
        connections: [{ from: "1", to: "2" }],
      }
  );

  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionLog, setExecutionLog] = useState<string[]>([]);
  const [totalCost, setTotalCost] = useState(0);

  const addAgent = useCallback(() => {
    const newAgent: Agent = {
      id: Date.now().toString(),
      name: `Agent ${workflow.agents.length + 1}`,
      type: "single",
      model: "gpt-4",
      tools: [],
      status: "idle",
    };
    setWorkflow({
      ...workflow,
      agents: [...workflow.agents, newAgent],
    });
  }, [workflow]);

  const removeAgent = useCallback((id: string) => {
    setWorkflow({
      agents: workflow.agents.filter((a) => a.id !== id),
      connections: workflow.connections.filter((c) => c.from !== id && c.to !== id),
    });
    if (selectedAgent === id) {
      setSelectedAgent(null);
    }
  }, [workflow, selectedAgent]);

  const updateAgent = useCallback((id: string, updates: Partial<Agent>) => {
    setWorkflow({
      ...workflow,
      agents: workflow.agents.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    });
  }, [workflow]);

  const addConnection = useCallback((from: string, to: string) => {
    if (!workflow.connections.some((c) => c.from === from && c.to === to)) {
      setWorkflow({
        ...workflow,
        connections: [...workflow.connections, { from, to }],
      });
    }
  }, [workflow]);

  const executeWorkflow = useCallback(async () => {
    setIsExecuting(true);
    setExecutionLog([]);
    setTotalCost(0);

    // Simulate workflow execution
    const agents = [...workflow.agents];
    let cost = 0;

    for (const agent of agents) {
      updateAgent(agent.id, { status: "running" });
      addLog(`Starting ${agent.name}...`);

      // Simulate agent execution
      for (let i = 0; i < 3; i++) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        addLog(`${agent.name}: Step ${i + 1}/3 completed`);
      }

      const agentCost = Math.random() * 0.1 + 0.05; // $0.05 - $0.15
      cost += agentCost;
      addLog(`${agent.name}: Completed (Cost: $${agentCost.toFixed(4)})`);

      updateAgent(agent.id, { status: "completed" });
    }

    setTotalCost(cost);
    setIsExecuting(false);
    addLog(`Workflow completed. Total cost: $${cost.toFixed(4)}`);
  }, [workflow, updateAgent]);

  const addLog = useCallback((message: string) => {
    setExecutionLog((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  }, []);

  const getAgentColor = (type: Agent["type"]) => {
    switch (type) {
      case "manager":
        return "bg-purple-500";
      case "worker":
        return "bg-blue-500";
      default:
        return "bg-primary-500";
    }
  };

  const getStatusColor = (status: Agent["status"]) => {
    switch (status) {
      case "running":
        return "bg-amber-500";
      case "completed":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-slate-400";
    }
  };

  const availableTools = [
    "web-search",
    "code-execution",
    "data-analysis",
    "visualization",
    "database-query",
    "api-call",
    "file-read",
    "file-write",
  ];

  return (
    <div className="space-y-6 p-6 bg-white rounded-2xl shadow-lg border border-slate-200">
      {props.loadedExampleLabel ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-semibold">Loaded example preset</p>
          <p className="mt-1">
            {props.loadedExampleLabel}. This orchestrator is a <strong>safe simulation</strong> (no external agents run).
          </p>
        </div>
      ) : null}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Agent Orchestrator POC</h2>
          <p className="text-sm text-slate-600 mt-1">
            Build and execute multi-agent workflows with tool integration
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg">
            <DollarSign className="w-4 h-4 text-slate-600" />
            <span className="font-semibold text-slate-900">${totalCost.toFixed(4)}</span>
          </div>
          <button
            onClick={executeWorkflow}
            disabled={isExecuting || workflow.agents.length === 0}
            className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            {isExecuting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Executing...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Execute Workflow
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Agent Palette */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-slate-900">Agents</h3>
            <button
              onClick={addAgent}
              className="p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2">
            {workflow.agents.map((agent) => (
              <div
                key={agent.id}
                className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedAgent === agent.id
                    ? "border-primary-500 bg-primary-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
                onClick={() => setSelectedAgent(agent.id)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`w-3 h-3 rounded-full ${getStatusColor(agent.status)}`}
                    title={agent.status}
                  />
                  <span className="font-medium text-slate-900 text-sm">{agent.name}</span>
                </div>
                <div className="text-xs text-slate-600">
                  {agent.model} • {agent.tools.length} tools
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Workflow Canvas */}
        <div className="col-span-2 space-y-4">
          <h3 className="font-semibold text-slate-900">Workflow Canvas</h3>
          <div className="p-6 bg-slate-50 rounded-lg min-h-[400px] relative">
            {workflow.agents.length === 0 ? (
              <div className="flex items-center justify-center h-full text-slate-500">
                <p>Add agents to build your workflow</p>
              </div>
            ) : (
              <div className="space-y-6">
                {workflow.agents.map((agent, index) => (
                  <div key={agent.id} className="relative">
                    <div
                      className={`flex items-center gap-4 p-4 bg-white border-2 rounded-lg ${
                        selectedAgent === agent.id
                          ? "border-primary-500 shadow-md"
                          : "border-slate-200"
                      }`}
                    >
                      <div
                        className={`w-12 h-12 ${getAgentColor(
                          agent.type
                        )} rounded-lg flex items-center justify-center text-white font-bold`}
                      >
                        {agent.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-900">{agent.name}</div>
                        <div className="text-sm text-slate-600">
                          {agent.model} • {agent.tools.length} tools
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 rounded-full ${getStatusColor(agent.status)}`}
                          title={agent.status}
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeAgent(agent.id);
                          }}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {index < workflow.agents.length - 1 && (
                      <div className="flex justify-center my-2">
                        <div className="w-0.5 h-8 bg-slate-300" />
                        <div className="absolute left-1/2 transform -translate-x-1/2 mt-2">
                          <Zap className="w-4 h-4 text-slate-400" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Agent Configuration */}
        <div className="space-y-4">
          <h3 className="font-semibold text-slate-900">Configuration</h3>
          {selectedAgent ? (
            (() => {
              const agent = workflow.agents.find((a) => a.id === selectedAgent);
              if (!agent) return null;

              return (
                <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <Settings className="w-4 h-4 text-slate-600" />
                    <span className="font-medium text-slate-900">{agent.name}</span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={agent.name}
                      onChange={(e) => updateAgent(selectedAgent, { name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Model</label>
                    <select
                      value={agent.model}
                      onChange={(e) => updateAgent(selectedAgent, { model: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="gpt-4">GPT-4</option>
                      <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                      <option value="claude-3">Claude 3</option>
                      <option value="llama-2">Llama 2</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Tools</label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {availableTools.map((tool) => (
                        <label
                          key={tool}
                          className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={agent.tools.includes(tool)}
                            onChange={(e) => {
                              const tools = e.target.checked
                                ? [...agent.tools, tool]
                                : agent.tools.filter((t) => t !== tool);
                              updateAgent(selectedAgent, { tools });
                            }}
                            className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
                          />
                          <span className="text-sm text-slate-700 capitalize">
                            {tool.replace("-", " ")}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="p-4 bg-slate-50 rounded-lg text-center text-slate-500">
              <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Select an agent to configure</p>
            </div>
          )}
        </div>
      </div>

      {/* Execution Log */}
      {executionLog.length > 0 && (
        <div className="mt-6 p-4 bg-slate-900 rounded-lg">
          <h3 className="font-semibold text-white mb-3">Execution Log</h3>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {executionLog.map((log, i) => (
              <div key={i} className="text-sm text-green-400 font-mono">
                {log}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

