"use client";

import React, { useState } from "react";
import { GitBranch, Cloud, Workflow, Settings, CheckCircle2, XCircle, Loader2 } from "lucide-react";

type IntegrationType = "git" | "ci-cd" | "cloud" | "api";

interface Integration {
  id: string;
  type: IntegrationType;
  name: string;
  status: "connected" | "disconnected" | "connecting" | "error";
  config?: Record<string, any>;
}

interface IntegrationManagerProps {
  integrations?: Integration[];
  onConnect?: (type: IntegrationType) => Promise<void>;
  onDisconnect?: (id: string) => Promise<void>;
  onConfigure?: (id: string, config: Record<string, any>) => Promise<void>;
  className?: string;
}

const integrationIcons = {
  git: GitBranch,
  "ci-cd": Workflow,
  cloud: Cloud,
  api: Settings
};

const integrationLabels = {
  git: "Git Repository",
  "ci-cd": "CI/CD Pipeline",
  cloud: "Cloud Platform",
  api: "API Integration"
};

const defaultIntegrations: Integration[] = [
  {
    id: "git-1",
    type: "git",
    name: "GitHub",
    status: "disconnected"
  },
  {
    id: "ci-cd-1",
    type: "ci-cd",
    name: "GitHub Actions",
    status: "disconnected"
  },
  {
    id: "cloud-1",
    type: "cloud",
    name: "AWS",
    status: "disconnected"
  }
];

export function IntegrationManager({
  integrations = defaultIntegrations,
  onConnect,
  onDisconnect,
  onConfigure,
  className = ""
}: IntegrationManagerProps) {
  const [localIntegrations, setLocalIntegrations] = useState<Integration[]>(integrations);

  const handleConnect = async (type: IntegrationType) => {
    const integration = localIntegrations.find(i => i.type === type);
    if (!integration) return;

    setLocalIntegrations(prev => prev.map(i => 
      i.id === integration.id ? { ...i, status: "connecting" as const } : i
    ));

    try {
      if (onConnect) {
        await onConnect(type);
      }
      setLocalIntegrations(prev => prev.map(i => 
        i.id === integration.id ? { ...i, status: "connected" as const } : i
      ));
    } catch (error) {
      setLocalIntegrations(prev => prev.map(i => 
        i.id === integration.id ? { ...i, status: "error" as const } : i
      ));
    }
  };

  const handleDisconnect = async (id: string) => {
    try {
      if (onDisconnect) {
        await onDisconnect(id);
      }
      setLocalIntegrations(prev => prev.map(i => 
        i.id === id ? { ...i, status: "disconnected" as const } : i
      ));
    } catch (error) {
      console.error("Disconnect failed:", error);
    }
  };

  const getStatusIcon = (status: Integration["status"]) => {
    switch (status) {
      case "connected":
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case "connecting":
        return <Loader2 className="w-5 h-5 text-sky-600 animate-spin" />;
      case "error":
        return <XCircle className="w-5 h-5 text-rose-600" />;
      default:
        return <XCircle className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusColor = (status: Integration["status"]) => {
    switch (status) {
      case "connected":
        return "border-emerald-200 bg-emerald-50";
      case "connecting":
        return "border-sky-200 bg-sky-50";
      case "error":
        return "border-rose-200 bg-rose-50";
      default:
        return "border-slate-200 bg-white";
    }
  };

  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-sky-600" />
          <h3 className="text-lg font-semibold text-slate-900">Integrations</h3>
        </div>
      </div>

      <div className="space-y-3">
        {localIntegrations.map((integration) => {
          const Icon = integrationIcons[integration.type];
          const label = integrationLabels[integration.type];

          return (
            <div
              key={integration.id}
              className={`rounded-xl border-2 p-4 ${getStatusColor(integration.status)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-slate-600" />
                  <div>
                    <div className="font-semibold text-slate-900">{integration.name}</div>
                    <div className="text-sm text-slate-600">{label}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusIcon(integration.status)}
                  {integration.status === "connected" ? (
                    <button
                      onClick={() => handleDisconnect(integration.id)}
                      className="px-3 py-1.5 text-sm border border-rose-300 text-rose-700 rounded-lg hover:bg-rose-50 transition-colors"
                    >
                      Disconnect
                    </button>
                  ) : (
                    <button
                      onClick={() => handleConnect(integration.type)}
                      disabled={integration.status === "connecting"}
                      className="px-3 py-1.5 text-sm bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Connect
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 rounded-lg bg-slate-50 text-sm text-slate-600">
        <p className="font-semibold text-slate-900 mb-1">Integration Benefits:</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>Git: Version control and collaboration</li>
          <li>CI/CD: Automated testing and deployment</li>
          <li>Cloud: Direct deployment to production</li>
          <li>API: Programmatic access and automation</li>
        </ul>
      </div>
    </div>
  );
}
