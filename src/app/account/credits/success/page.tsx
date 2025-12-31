/**
 * Payment Success Page
 * 
 * Shown after successful credit purchase via Stripe.
 */

"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams?.get("session_id") || null;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creditsGranted, setCreditsGranted] = useState<number | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError("No session ID provided");
      setLoading(false);
      return;
    }

    // Verify payment and get credits granted
    const verifyPayment = async () => {
      try {
        const response = await fetch(`/api/billing/verify-payment?session_id=${sessionId}`);
        if (!response.ok) {
          throw new Error("Failed to verify payment");
        }
        const data = await response.json();
        setCreditsGranted(data.creditsGranted || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to verify payment");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/30 to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-sky-600 mx-auto mb-4" />
          <p className="text-slate-600">Verifying payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/30 to-slate-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="rounded-2xl border border-amber-200 bg-white p-8 shadow-sm text-center">
            <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Payment Verification Failed</h1>
            <p className="text-slate-600 mb-6">{error}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/account/credits"
                className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-semibold transition-colors"
              >
                Back to Credits
              </Link>
              <Link
                href="/account"
                className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 rounded-lg font-semibold transition-colors"
              >
                Account Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/30 to-slate-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="rounded-2xl border border-emerald-200 bg-white p-8 shadow-sm text-center">
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Payment Successful!</h1>
          <p className="text-slate-600 mb-4">
            Your payment has been processed successfully.
          </p>
          {creditsGranted && (
            <div className="mb-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <p className="text-sm text-emerald-800 mb-1">Credits Added</p>
              <p className="text-3xl font-bold text-emerald-900">
                {creditsGranted.toLocaleString()}
              </p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/account/credits"
              className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-semibold transition-colors"
            >
              View Credits
            </Link>
            <Link
              href="/studios/hub"
              className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 rounded-lg font-semibold transition-colors"
            >
              Go to Studios
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
