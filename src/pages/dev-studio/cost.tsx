"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Zap, HelpCircle, TrendingUp, DollarSign } from "lucide-react";
import SecureErrorBoundary from "@/components/studios/SecureErrorBoundary";
import StudioNavigation from "@/components/studios/StudioNavigation";
import HelpTooltip from "@/components/studios/HelpTooltip";
import CreditEstimate from "@/components/studios/CreditEstimate";

type Platform = "vercel" | "aws" | "gcp" | "azure";

interface ResourceConfig {
  cpu: number; // vCPU cores
  memory: number; // GB
  storage: number; // GB
  bandwidth: number; // GB/month
  requests: number; // requests/month
}

const platformPricing: Record<Platform, { cpu: number; memory: number; storage: number; bandwidth: number; requests: number }> = {
  vercel: {
    cpu: 0.0001, // per vCPU-hour
    memory: 0.00005, // per GB-hour
    storage: 0.0002, // per GB-month
    bandwidth: 0.0001, // per GB
    requests: 0.000001, // per request
  },
  aws: {
    cpu: 0.00008,
    memory: 0.00004,
    storage: 0.00015,
    bandwidth: 0.00009,
    requests: 0.0000008,
  },
  gcp: {
    cpu: 0.00009,
    memory: 0.000045,
    storage: 0.00018,
    bandwidth: 0.000095,
    requests: 0.0000009,
  },
  azure: {
    cpu: 0.000085,
    memory: 0.000042,
    storage: 0.00016,
    bandwidth: 0.000092,
    requests: 0.00000085,
  },
};

export default function CostPage() {
  const [platform, setPlatform] = useState<Platform>("vercel");
  const [resources, setResources] = useState<ResourceConfig>({
    cpu: 1,
    memory: 1,
    storage: 10,
    bandwidth: 100,
    requests: 1000000,
  });

  const costs = useMemo(() => {
    const pricing = platformPricing[platform];
    const monthly = {
      compute: (resources.cpu * pricing.cpu * 24 * 30) + (resources.memory * pricing.memory * 24 * 30),
      storage: resources.storage * pricing.storage,
      bandwidth: resources.bandwidth * pricing.bandwidth,
      requests: resources.requests * pricing.requests,
    };
    const total = monthly.compute + monthly.storage + monthly.bandwidth + monthly.requests;
    return {
      monthly,
      yearly: total * 12,
      breakdown: {
        compute: (monthly.compute / total) * 100,
        storage: (monthly.storage / total) * 100,
        bandwidth: (monthly.bandwidth / total) * 100,
        requests: (monthly.requests / total) * 100,
      },
    };
  }, [platform, resources]);

  const platforms: { value: Platform; label: string; description: string }[] = [
    { value: "vercel", label: "Vercel", description: "Serverless platform for frontend" },
    { value: "aws", label: "AWS", description: "Amazon Web Services" },
    { value: "gcp", label: "Google Cloud", description: "Google Cloud Platform" },
    { value: "azure", label: "Azure", description: "Microsoft Azure" },
  ];

  return (
    <SecureErrorBoundary studio="dev-studio">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-yellow-50/30 to-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
          <header className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Link
                  href="/dev-studio"
                  className="text-slate-600 hover:text-slate-900 transition-colors"
                  aria-label="Back to Dev Studio"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Cost Calculator</h1>
                  <p className="text-base sm:text-lg text-slate-600 mt-1">
                    Real-time infrastructure cost estimation
                  </p>
                </div>
                <HelpTooltip
                  title="Cost Calculator"
                  content={
                    <div className="space-y-4">
                      <p>
                        The Cost Calculator estimates how much it will cost to run your application on 
                        cloud platforms. It helps you plan your budget.
                      </p>
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-2">Features:</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                          <li>Estimate costs for different cloud platforms</li>
                          <li>Compare pricing across providers</li>
                          <li>Calculate monthly and yearly costs</li>
                          <li>Optimize infrastructure costs</li>
                        </ul>
                      </div>
                    </div>
                  }
                />
              </div>
              <StudioNavigation studioType="dev" showHub={true} />
            </div>
          </header>

          <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
            {/* Credit Estimate */}
            <div className="mb-6">
              <CreditEstimate toolId="dev-studio-cost" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Configuration */}
              <div className="lg:col-span-2 space-y-6">
                {/* Platform Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Cloud Platform
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {platforms.map((p) => (
                      <button
                        key={p.value}
                        onClick={() => setPlatform(p.value)}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          platform === p.value
                            ? "border-yellow-500 bg-yellow-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="font-semibold text-slate-900">{p.label}</div>
                        <div className="text-xs text-slate-600 mt-1">{p.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Resource Configuration */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Resource Requirements
                  </label>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">
                        vCPU Cores: {resources.cpu}
                      </label>
                      <input
                        type="range"
                        min="0.5"
                        max="16"
                        step="0.5"
                        value={resources.cpu}
                        onChange={(e) =>
                          setResources({ ...resources, cpu: parseFloat(e.target.value) })
                        }
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">
                        Memory (GB): {resources.memory}
                      </label>
                      <input
                        type="range"
                        min="0.5"
                        max="64"
                        step="0.5"
                        value={resources.memory}
                        onChange={(e) =>
                          setResources({ ...resources, memory: parseFloat(e.target.value) })
                        }
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">
                        Storage (GB): {resources.storage}
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="1000"
                        step="1"
                        value={resources.storage}
                        onChange={(e) =>
                          setResources({ ...resources, storage: parseInt(e.target.value) })
                        }
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">
                        Bandwidth (GB/month): {resources.bandwidth}
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="10000"
                        step="10"
                        value={resources.bandwidth}
                        onChange={(e) =>
                          setResources({ ...resources, bandwidth: parseInt(e.target.value) })
                        }
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-1">
                        Requests (million/month): {(resources.requests / 1000000).toFixed(1)}
                      </label>
                      <input
                        type="range"
                        min="0.1"
                        max="100"
                        step="0.1"
                        value={resources.requests / 1000000}
                        onChange={(e) =>
                          setResources({
                            ...resources,
                            requests: parseFloat(e.target.value) * 1000000,
                          })
                        }
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Cost Summary */}
              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-yellow-50 to-amber-50 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <DollarSign className="w-5 h-5 text-yellow-600" />
                    <h3 className="text-lg font-semibold text-slate-900">Cost Estimate</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-slate-600 mb-1">Monthly Cost</div>
                      <div className="text-3xl font-bold text-slate-900">
                        £{(costs.monthly.compute + costs.monthly.storage + costs.monthly.bandwidth + costs.monthly.requests).toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-600 mb-1">Yearly Cost</div>
                      <div className="text-2xl font-bold text-slate-900">
                        £{costs.yearly.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Cost Breakdown</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600">Compute</span>
                        <span className="font-medium text-slate-900">
                          £{costs.monthly.compute.toFixed(2)}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{ width: `${costs.breakdown.compute}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600">Storage</span>
                        <span className="font-medium text-slate-900">
                          £{costs.monthly.storage.toFixed(2)}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{ width: `${costs.breakdown.storage}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600">Bandwidth</span>
                        <span className="font-medium text-slate-900">
                          £{costs.monthly.bandwidth.toFixed(2)}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{ width: `${costs.breakdown.bandwidth}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600">Requests</span>
                        <span className="font-medium text-slate-900">
                          £{costs.monthly.requests.toFixed(2)}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{ width: `${costs.breakdown.requests}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Platform Comparison */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Compare Platforms</h3>
                  <div className="space-y-2 text-sm">
                    {platforms.map((p) => {
                      const pricing = platformPricing[p.value];
                      const pCosts =
                        (resources.cpu * pricing.cpu * 24 * 30) +
                        (resources.memory * pricing.memory * 24 * 30) +
                        (resources.storage * pricing.storage) +
                        (resources.bandwidth * pricing.bandwidth) +
                        (resources.requests * pricing.requests);
                      return (
                        <div
                          key={p.value}
                          className={`flex justify-between p-2 rounded ${
                            platform === p.value ? "bg-yellow-50" : ""
                          }`}
                        >
                          <span className="text-slate-700">{p.label}</span>
                          <span className="font-medium text-slate-900">£{pCosts.toFixed(2)}/mo</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SecureErrorBoundary>
  );
}
