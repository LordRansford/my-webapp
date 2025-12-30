"use client";

import React, { useState } from "react";
import { Check, ExternalLink, Loader2 } from "lucide-react";
import { providerManager } from "@/lib/ai-studio/providers";
import { awsProvider } from "@/lib/ai-studio/providers/aws";
import { gcpProvider } from "@/lib/ai-studio/providers/gcp";
import { azureProvider } from "@/lib/ai-studio/providers/azure";
import { huggingfaceProvider } from "@/lib/ai-studio/providers/huggingface";
import { CloudProvider } from "@/lib/ai-studio/providers";

// Register providers
providerManager.registerProvider(awsProvider);
providerManager.registerProvider(gcpProvider);
providerManager.registerProvider(azureProvider);
providerManager.registerProvider(huggingfaceProvider);

interface ProviderSelectorProps {
  onSelect?: (provider: CloudProvider) => void;
  serviceType?: "training" | "inference" | "storage" | "deployment";
}

export default function ProviderSelector({
  onSelect,
  serviceType,
}: ProviderSelectorProps) {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [connected, setConnected] = useState<Set<string>>(new Set());

  const providers = serviceType
    ? providerManager.getProvidersByService(serviceType)
    : providerManager.getAllProviders();

  const [error, setError] = useState<string | null>(null);

  const handleConnect = async (provider: CloudProvider) => {
    setConnecting(provider.id);
    setError(null);
    try {
      const result = await provider.authenticate();
      if (result.success) {
        setConnected((prev) => new Set(prev).add(provider.id));
        if (onSelect) {
          onSelect(provider);
        }
      } else {
        setError(result.error || "Connection failed");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Connection failed";
      setError(errorMessage);
      console.error("Connection failed:", error);
    } finally {
      setConnecting(null);
    }
  };

  const getProviderIcon = (id: string) => {
    switch (id) {
      case "aws":
        return "☁️";
      case "gcp":
        return "🔵";
      case "azure":
        return "🔷";
      case "huggingface":
        return "🤗";
      default:
        return "☁️";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">Cloud Providers</h3>
        <p className="text-sm text-slate-600">
          Connect to cloud providers for training, deployment, and storage
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {providers.map((provider) => (
          <div
            key={provider.id}
            className={`p-6 rounded-2xl border-2 transition-all ${
              selectedProvider === provider.id
                ? "border-purple-500 bg-purple-50"
                : "border-slate-200 bg-white hover:border-slate-300"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{getProviderIcon(provider.id)}</span>
                <div>
                  <h4 className="font-semibold text-slate-900">{provider.name}</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {Object.entries(provider.services).map(([service, available]) => (
                      <span
                        key={service}
                        className={`px-2 py-1 rounded-full text-xs ${
                          available
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              {connected.has(provider.id) && (
                <div className="p-1 bg-green-600 rounded-full">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            {error && connecting === provider.id && (
              <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                {error}
              </div>
            )}
            <div className="flex gap-2">
              {connected.has(provider.id) ? (
                <button
                  onClick={() => {
                    setSelectedProvider(provider.id);
                    onSelect?.(provider);
                  }}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold text-sm"
                  aria-label={`Use ${provider.name}`}
                >
                  Use Provider
                </button>
              ) : (
                <button
                  onClick={() => handleConnect(provider)}
                  disabled={connecting === provider.id}
                  className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                  aria-label={`Connect to ${provider.name}`}
                  aria-busy={connecting === provider.id}
                >
                  {connecting === provider.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <>
                      Connect
                      <ExternalLink className="w-4 h-4" aria-hidden="true" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

