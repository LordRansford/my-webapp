/**
 * Purchase Credits Page
 * 
 * Allows authenticated users to purchase credit packs and view their balance.
 */

"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CreditCard, Zap, Check, Loader2, AlertCircle, TrendingUp } from "lucide-react";
import Link from "next/link";
import { CREDIT_PACKS, CREDIT_PRICE } from "@/lib/billing/plans";

interface CreditBalance {
  balance: number;
  usage: {
    daily: { used: number; cap: number; remaining: number; percentage: number };
    monthly: { used: number; cap: number; remaining: number; percentage: number };
  };
  plan: {
    key: string;
    label: string;
    monthlyCredits: number;
    dailyCap: number;
  };
  alerts: {
    daily: boolean;
    monthly: boolean;
  };
}

export default function PurchaseCreditsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [balance, setBalance] = useState<CreditBalance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin?callbackUrl=/account/credits");
      return;
    }

    if (status === "authenticated") {
      fetchBalance();
    }
  }, [status, router]);

  async function fetchBalance() {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/credits/balance");
      if (!response.ok) {
        throw new Error("Failed to load credit balance");
      }
      const data = await response.json();
      setBalance(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load balance");
    } finally {
      setLoading(false);
    }
  }

  async function handlePurchase(packId: string) {
    if (!session?.user) {
      router.push("/api/auth/signin?callbackUrl=/account/credits");
      return;
    }

    setPurchasing(true);
    setError(null);

    try {
      // TODO: Integrate with actual payment provider
      // For now, show a message that this is a stub
      alert(
        `Purchase flow for ${packId} pack would be initiated here.\n\n` +
        "This requires integration with your payment provider (Stripe, etc.).\n\n" +
        "The checkout session would be created and user redirected to payment."
      );
      
      // After successful payment, refresh balance
      // await fetchBalance();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Purchase failed");
    } finally {
      setPurchasing(false);
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/30 to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-sky-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading credit balance...</p>
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
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Credits</h1>
          <p className="text-lg text-slate-600">
            Purchase credits to use premium tools and features
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-amber-900">Error</p>
                <p className="text-sm text-amber-800 mt-1">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-amber-600 hover:text-amber-800"
                aria-label="Dismiss error"
              >
                ×
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Balance & Usage */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Balance */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-900">Current Balance</h2>
                <button
                  onClick={fetchBalance}
                  disabled={loading}
                  className="text-sm text-sky-600 hover:text-sky-700 font-medium"
                >
                  Refresh
                </button>
              </div>
              {balance ? (
                <>
                  <div className="flex items-baseline gap-3 mb-6">
                    <span className="text-5xl font-bold text-slate-900">
                      {balance.balance.toLocaleString()}
                    </span>
                    <span className="text-lg text-slate-600">credits</span>
                  </div>

                  {/* Usage Stats */}
                  <div className="space-y-4">
                    {/* Daily Usage */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">Daily Usage</span>
                        <span className="text-sm text-slate-600">
                          {balance.usage.daily.used} / {balance.usage.daily.cap}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full transition-all ${
                            balance.alerts.daily
                              ? "bg-amber-500"
                              : balance.usage.daily.percentage >= 50
                              ? "bg-sky-500"
                              : "bg-emerald-500"
                          }`}
                          style={{ width: `${Math.min(100, balance.usage.daily.percentage)}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {balance.usage.daily.remaining} remaining today
                      </p>
                    </div>

                    {/* Monthly Usage */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">Monthly Usage</span>
                        <span className="text-sm text-slate-600">
                          {balance.usage.monthly.used} / {balance.usage.monthly.cap}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full transition-all ${
                            balance.alerts.monthly
                              ? "bg-amber-500"
                              : balance.usage.monthly.percentage >= 50
                              ? "bg-sky-500"
                              : "bg-emerald-500"
                          }`}
                          style={{ width: `${Math.min(100, balance.usage.monthly.percentage)}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {balance.usage.monthly.remaining} remaining this month
                      </p>
                    </div>
                  </div>

                  {/* Plan Info */}
                  <div className="mt-6 pt-6 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-700">Current Plan</p>
                        <p className="text-lg font-semibold text-slate-900">{balance.plan.label}</p>
                      </div>
                      <Link
                        href="/account/upgrade"
                        className="text-sm text-sky-600 hover:text-sky-700 font-medium"
                      >
                        Upgrade →
                      </Link>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      {balance.plan.monthlyCredits.toLocaleString()} credits/month,{" "}
                      {balance.plan.dailyCap.toLocaleString()}/day cap
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-500">Unable to load balance</p>
                </div>
              )}
            </div>

            {/* Credit Packs */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900 mb-6">Purchase Credits</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {CREDIT_PACKS.map((pack) => (
                  <div
                    key={pack.id}
                    className={`rounded-xl border-2 p-5 transition-all cursor-pointer ${
                      selectedPack === pack.id
                        ? "border-sky-500 bg-sky-50"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                    onClick={() => setSelectedPack(pack.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-slate-900">{pack.label}</h3>
                      {selectedPack === pack.id && (
                        <Check className="w-5 h-5 text-sky-600" />
                      )}
                    </div>
                    <div className="mb-4">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-slate-900">£{pack.price}</span>
                      </div>
                      <p className="text-sm text-slate-600 mt-1">
                        {pack.credits.toLocaleString()} credits
                      </p>
                      {pack.id !== "starter" && (
                        <p className="text-xs text-emerald-600 mt-1 font-medium">
                          {Math.round((1 - pack.pricePerCredit / CREDIT_PRICE) * 100)}% savings
                        </p>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePurchase(pack.id);
                      }}
                      disabled={purchasing}
                      className="w-full px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {purchasing && selectedPack === pack.id ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing...
                        </span>
                      ) : (
                        "Purchase"
                      )}
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-4 text-center">
                Credits never expire. All purchases are final.
              </p>
            </div>
          </div>

          {/* Right Column: Info & Help */}
          <div className="space-y-6">
            {/* How Credits Work */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-sky-600" />
                How Credits Work
              </h2>
              <div className="space-y-3 text-sm text-slate-700">
                <p>
                  Credits are consumed when you use server-side tools and features. Client-side
                  tools are always free.
                </p>
                <p>
                  <strong>Base fee:</strong> 2 credits per server run
                </p>
                <p>
                  <strong>Compute:</strong> 1 credit per 2 seconds of CPU time
                </p>
                <p>
                  <strong>Memory:</strong> 1 credit per 4 seconds per GB RAM
                </p>
                <p className="pt-3 border-t border-slate-200">
                  <strong>Price:</strong> £{CREDIT_PRICE.toFixed(2)} per credit
                </p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick Links</h2>
              <div className="space-y-2">
                <Link
                  href="/account"
                  className="block text-sm text-sky-600 hover:text-sky-700 font-medium"
                >
                  Account Settings →
                </Link>
                <Link
                  href="/account/upgrade"
                  className="block text-sm text-sky-600 hover:text-sky-700 font-medium"
                >
                  Upgrade Plan →
                </Link>
                <Link
                  href="/account/usage"
                  className="block text-sm text-sky-600 hover:text-sky-700 font-medium"
                >
                  Usage History →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
