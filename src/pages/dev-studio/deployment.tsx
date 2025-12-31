"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Cloud, HelpCircle, Play, Download, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import SecureErrorBoundary from "@/components/studios/SecureErrorBoundary";
import StudioNavigation from "@/components/studios/StudioNavigation";
import HelpTooltip from "@/components/studios/HelpTooltip";
import CreditEstimate from "@/components/studios/CreditEstimate";

type Platform = "vercel" | "aws" | "gcp" | "azure";
type DeploymentType = "static" | "serverless" | "container" | "vm";

interface DeploymentConfig {
  projectName: string;
  platform: Platform;
  deploymentType: DeploymentType;
  repositoryUrl?: string;
  buildCommand?: string;
  outputDirectory?: string;
  environmentVariables?: Array<{ key: string; value: string }>;
}

export default function DeploymentPage() {
  const [config, setConfig] = useState<DeploymentConfig>({
    projectName: "",
    platform: "vercel",
    deploymentType: "static",
    buildCommand: "npm run build",
    outputDirectory: "dist",
  });
  const [deploying, setDeploying] = useState(false);
  const [deployed, setDeployed] = useState(false);
  const [deploymentResult, setDeploymentResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleDeploy() {
    if (!config.projectName.trim()) {
      setError("Please enter a project name");
      return;
    }

    setDeploying(true);
    setError(null);
    setDeployed(false);

    try {
      const response = await fetch("/api/dev-studio/deployment/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toolId: "dev-studio-deployment",
          config,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Deployment failed");
      }

      setDeploymentResult(data);
      setDeployed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Deployment failed");
    } finally {
      setDeploying(false);
    }
  }

  function handleReset() {
    setConfig({
      projectName: "",
      platform: "vercel",
      deploymentType: "static",
      buildCommand: "npm run build",
      outputDirectory: "dist",
    });
    setDeployed(false);
    setDeploymentResult(null);
    setError(null);
  }

  const platforms = [
    { value: "vercel", label: "Vercel", description: "Serverless platform for frontend" },
    { value: "aws", label: "AWS", description: "Amazon Web Services" },
    { value: "gcp", label: "Google Cloud", description: "Google Cloud Platform" },
    { value: "azure", label: "Azure", description: "Microsoft Azure" },
  ];

  const deploymentTypes = [
    { value: "static", label: "Static Site" },
    { value: "serverless", label: "Serverless Function" },
    { value: "container", label: "Container" },
    { value: "vm", label: "Virtual Machine" },
  ];

  return (
    <SecureErrorBoundary studio="dev-studio">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-50">
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
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                  <Cloud className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Deployment Wizard</h1>
                  <p className="text-base sm:text-lg text-slate-600 mt-1">Multi-cloud deployment (Vercel, AWS, GCP, Azure)</p>
                </div>
                <HelpTooltip
                  title="Deployment Wizard"
                  content={
                    <div className="space-y-4">
                      <p>
                        The Deployment Wizard guides you through putting your application on the internet so others can use it.
                      </p>
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-2">Features:</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                          <li>Deploy to multiple cloud platforms</li>
                          <li>Configure build settings</li>
                          <li>Set environment variables</li>
                          <li>Generate deployment scripts</li>
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
              <CreditEstimate toolId="dev-studio-deployment" />
            </div>

            {error && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-red-900">Deployment Error</p>
                    <p className="text-sm text-red-800 mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {!deployed ? (
              <div className="space-y-6">
                {/* Project Configuration */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Project Name</label>
                  <input
                    type="text"
                    value={config.projectName}
                    onChange={(e) => setConfig({ ...config, projectName: e.target.value })}
                    placeholder="my-awesome-app"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Platform Selection */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Cloud Platform</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {platforms.map((platform) => (
                      <button
                        key={platform.value}
                        onClick={() => setConfig({ ...config, platform: platform.value as Platform })}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          config.platform === platform.value
                            ? "border-emerald-500 bg-emerald-50"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="font-semibold text-slate-900">{platform.label}</div>
                        <div className="text-xs text-slate-600 mt-1">{platform.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Deployment Type */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Deployment Type</label>
                  <select
                    value={config.deploymentType}
                    onChange={(e) => setConfig({ ...config, deploymentType: e.target.value as DeploymentType })}
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
                  >
                    {deploymentTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Repository URL */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Repository URL (optional)</label>
                  <input
                    type="text"
                    value={config.repositoryUrl || ""}
                    onChange={(e) => setConfig({ ...config, repositoryUrl: e.target.value })}
                    placeholder="https://github.com/username/repo"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Build Configuration */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Build Command</label>
                    <input
                      type="text"
                      value={config.buildCommand || ""}
                      onChange={(e) => setConfig({ ...config, buildCommand: e.target.value })}
                      placeholder="npm run build"
                      className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Output Directory</label>
                    <input
                      type="text"
                      value={config.outputDirectory || ""}
                      onChange={(e) => setConfig({ ...config, outputDirectory: e.target.value })}
                      placeholder="dist"
                      className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 font-mono text-sm"
                    />
                  </div>
                </div>

                {/* Deploy Button */}
                <div className="pt-4">
                  <button
                    onClick={handleDeploy}
                    disabled={deploying || !config.projectName.trim()}
                    className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {deploying ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Deploying...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Deploy Application
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-semibold">Deployment configuration generated successfully!</span>
                </div>

                {/* Deployment Result */}
                {deploymentResult && (
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Deployment Configuration</h3>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium text-slate-700">Platform:</span>{" "}
                          <span className="text-slate-900">{config.platform.toUpperCase()}</span>
                        </div>
                        <div>
                          <span className="font-medium text-slate-700">Deployment URL:</span>{" "}
                          <span className="text-emerald-600">
                            {deploymentResult.deploymentUrl || "https://your-app.example.com"}
                          </span>
                        </div>
                        {deploymentResult.instructions && (
                          <div className="mt-4">
                            <p className="font-medium text-slate-700 mb-2">Next Steps:</p>
                            <ul className="list-disc list-inside space-y-1 text-slate-600">
                              {deploymentResult.instructions.map((step: string, idx: number) => (
                                <li key={idx}>{step}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 rounded-lg font-semibold transition-colors"
                  >
                    Create Another Deployment
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SecureErrorBoundary>
  );
}
