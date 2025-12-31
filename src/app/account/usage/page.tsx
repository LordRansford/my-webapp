/**
 * Usage Analytics Page
 * 
 * Shows credit usage statistics, trends, and insights.
 */

"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BarChart3, TrendingUp, Calendar, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

interface UsageStats {
  period: "7d" | "30d" | "90d";
  totalCreditsUsed: number;
  totalToolRuns: number;
  averageCreditsPerRun: number;
  toolBreakdown: Array<{ toolId: string; toolName: string; credits: number; runs: number }>;
  dailyUsage: Array<{ date: string; credits: number; runs: number }>;
}

export default function UsagePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("30d");
  const [stats, setStats] = useState<UsageStats | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin?callbackUrl=/account/usage");
      return;
    }

    if (status === "authenticated") {
      fetchUsage();
    }
  }, [status, router, period]);

  async function fetchUsage() {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/account/usage?period=${period}`);
      if (!response.ok) {
        throw new Error("Failed to load usage statistics");
      }
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load usage");
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/30 to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-sky-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading usage statistics...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/30 to-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-8 h-8 text-sky-600" />
            <h1 className="text-4xl font-bold text-slate-900">Usage Analytics</h1>
          </div>
          <p className="text-lg text-slate-600">
            Track your credit consumption and tool usage patterns
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-amber-900">Error</p>
                <p className="text-sm text-amber-800 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Period Selector */}
        <div className="mb-6 flex items-center gap-3">
          <Calendar className="w-5 h-5 text-slate-600" />
          <div className="flex gap-2">
            {(["7d", "30d", "90d"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  period === p
                    ? "bg-sky-600 text-white"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-300"
                }`}
              >
                {p === "7d" ? "7 Days" : p === "30d" ? "30 Days" : "90 Days"}
              </button>
            ))}
          </div>
        </div>

        {stats && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Total Credits Used */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-sky-600" />
                <h3 className="text-sm font-medium text-slate-700">Total Credits Used</h3>
              </div>
              <p className="text-3xl font-bold text-slate-900">
                {stats.totalCreditsUsed.toLocaleString()}
              </p>
            </div>

            {/* Total Tool Runs */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-5 h-5 text-sky-600" />
                <h3 className="text-sm font-medium text-slate-700">Total Tool Runs</h3>
              </div>
              <p className="text-3xl font-bold text-slate-900">
                {stats.totalToolRuns.toLocaleString()}
              </p>
            </div>

            {/* Average per Run */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-sky-600" />
                <h3 className="text-sm font-medium text-slate-700">Average per Run</h3>
              </div>
              <p className="text-3xl font-bold text-slate-900">
                {stats.averageCreditsPerRun.toFixed(1)}
              </p>
            </div>
          </div>
        )}

        {/* Tool Breakdown */}
        {stats && stats.toolBreakdown.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Tool Usage Breakdown</h2>
            <div className="space-y-3">
              {stats.toolBreakdown.map((tool) => (
                <div key={tool.toolId} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                  <div>
                    <p className="font-medium text-slate-900">{tool.toolName}</p>
                    <p className="text-sm text-slate-600">{tool.runs} runs</p>
                  </div>
                  <p className="text-lg font-semibold text-slate-900">
                    {tool.credits.toLocaleString()} credits
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Back Link */}
        <div className="flex justify-start">
          <Link
            href="/account/credits"
            className="text-sm text-slate-600 hover:text-slate-900 font-medium"
          >
            ← Back to Credits
          </Link>
        </div>
      </div>
    </div>
  );
}
