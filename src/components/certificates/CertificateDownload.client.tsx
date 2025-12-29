"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import CreditConsent, { useCreditConsent } from "@/components/credits/CreditConsent";

const ESTIMATED_CREDITS = 5; // PDF generation cost

interface CertificateDownloadProps {
  certificateId: string;
}

export default function CertificateDownload({ certificateId }: CertificateDownloadProps) {
  const { data: session } = useSession();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { accepted, canProceed } = useCreditConsent(ESTIMATED_CREDITS, balance);

  useEffect(() => {
    if (!session?.user?.id) return;
    fetch("/api/credits/status")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        setBalance(typeof d?.balance === "number" ? d.balance : 0);
      })
      .catch(() => setBalance(0));
  }, [session?.user?.id]);

  const handleDownload = async () => {
    if (!canProceed) {
      setError("Please accept the credit estimate and ensure sufficient credits.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/certificates/${encodeURIComponent(certificateId)}/pdf`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.message || "Failed to download certificate PDF");
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${certificateId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to download certificate");
    } finally {
      setLoading(false);
    }
  };

  if (!session?.user?.id) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm text-slate-700">Sign in to download your certificate PDF.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <CreditConsent
        estimatedCredits={ESTIMATED_CREDITS}
        currentBalance={balance}
        onAccept={() => {}}
      />
      <button
        type="button"
        onClick={handleDownload}
        disabled={!canProceed || loading}
        className="button"
      >
        {loading ? "Downloading..." : "Download PDF"}
      </button>
      {error && (
        <p className="text-sm text-rose-600">{error}</p>
      )}
    </div>
  );
}

