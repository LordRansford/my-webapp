"use client";

import React, { useMemo, useState } from "react";
import DonationNotice from "@/components/templates/DonationNotice";
import ExportActions from "@/components/templates/ExportActions";
import SubmissionHistory, { addSubmissionEntry } from "@/components/templates/SubmissionHistory";
import { buildDocumentMetadata, stripGeneratorMetadata } from "@/utils/documentMetadata";
import { ExportFormat, evaluateExportPolicy, UsageMode } from "@/utils/exportPolicy";

type ExportGateProps = {
  templateName: string;
  usageMode: UsageMode;
  includeAttribution?: boolean;
  hasDonationToken?: boolean;
  hasPermissionToken?: boolean;
  onExport?: (format: ExportFormat, payload: { metadata: Record<string, unknown>; enforceAttribution: boolean }) => void;
};

export default function ExportGate({
  templateName,
  usageMode,
  includeAttribution = true,
  hasDonationToken = false,
  hasPermissionToken = false,
  onExport,
}: ExportGateProps) {
  const [status, setStatus] = useState<string | null>(null);

  const policy = useMemo(
    () => evaluateExportPolicy(usageMode, { hasDonation: hasDonationToken, hasPermission: hasPermissionToken }),
    [usageMode, hasDonationToken, hasPermissionToken]
  );

  const handleExport = (format: ExportFormat) => {
    if (!policy.allowed) {
      setStatus(policy.message);
      return;
    }

    const metadata = buildDocumentMetadata({
      title: templateName,
      usageMode,
      includeAttribution: policy.enforceAttribution || includeAttribution,
    });
    const sanitized = stripGeneratorMetadata(metadata);

    addSubmissionEntry({
      templateName,
      usageMode,
      format,
      timestamp: Date.now(),
    });

    onExport?.(format, { metadata: sanitized, enforceAttribution: policy.enforceAttribution });
    setStatus(`Prepared ${format.toUpperCase()} with ${policy.enforceAttribution ? "" : "optional "}attribution.`);
  };

  const attributionText =
    usageMode === "internal"
      ? "Signature removed. Marked internal-only."
      : policy.enforceAttribution
        ? "Attribution locked for this export."
        : "Attribution optional when a donation or permission token is present.";

  return (
    <div className="space-y-4 rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Controlled export</p>
        <h2 className="text-xl font-semibold text-slate-900">{templateName}</h2>
        <p className="text-sm text-slate-700">{policy.message}</p>
        <p className="text-xs text-slate-600">{attributionText}</p>
      </div>

      {!policy.allowed && policy.requireDonation && <DonationNotice />}

      <div className="space-y-3">
        <p className="text-sm font-semibold text-slate-900">Choose a format</p>
        <ExportActions
          formats={policy.formats.length ? policy.formats : ["pdf", "docx", "web", "print"]}
          disabled={!policy.allowed}
          disabledReason={!policy.allowed ? policy.message : undefined}
          onExport={handleExport}
        />
        <div className="rounded-2xl bg-slate-50/80 p-3 text-xs text-slate-700">
          <p className="font-semibold text-slate-900">What you get</p>
          <ul className="mt-1 list-disc pl-4 space-y-1">
            <li>Editable where appropriate (DOCX, web form)</li>
            <li>Layout preserved for print and PDF</li>
            <li>Metadata cleaned of generators and AI fingerprints</li>
            <li>Accessibility retained; buttons keyboard friendly</li>
          </ul>
        </div>
      </div>

      <SubmissionHistory />

      <div className="sr-only" role="status" aria-live="polite">
        {status}
      </div>
    </div>
  );
}
