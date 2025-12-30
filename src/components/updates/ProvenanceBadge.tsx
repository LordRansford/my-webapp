"use client";

import React, { memo } from "react";
import type { LicencePosture } from "@/lib/updates/types";

interface ProvenanceBadgeProps {
  licencePosture: LicencePosture;
  sourceName: string;
  fetchedAt: string;
  className?: string;
}

const ProvenanceBadge = memo(function ProvenanceBadge({
  licencePosture,
  sourceName,
  fetchedAt,
  className = "",
}: ProvenanceBadgeProps) {
  const badgeColors: Record<LicencePosture, string> = {
    OGL: "bg-blue-100 text-blue-800 border-blue-200",
    CC0: "bg-green-100 text-green-800 border-green-200",
    "public-domain-like": "bg-emerald-100 text-emerald-800 border-emerald-200",
    unknown: "bg-amber-100 text-amber-800 border-amber-200",
    restrictive: "bg-rose-100 text-rose-800 border-rose-200",
  };
  
  const badgeText: Record<LicencePosture, string> = {
    OGL: "OGL",
    CC0: "CC0",
    "public-domain-like": "Public Domain",
    unknown: "Unknown Licence",
    restrictive: "Restricted",
  };
  
  return (
    <div className={`flex items-center gap-2 text-xs ${className}`}>
      <span
        className={`px-2 py-1 rounded border font-medium ${badgeColors[licencePosture]}`}
        aria-label={`Licence: ${badgeText[licencePosture]}`}
      >
        {badgeText[licencePosture]}
      </span>
      <span className="text-slate-600" aria-label={`Source: ${sourceName}`}>
        {sourceName}
      </span>
      <time
        dateTime={fetchedAt}
        className="text-slate-500"
        aria-label={`Fetched at: ${new Date(fetchedAt).toLocaleString()}`}
      >
        {new Date(fetchedAt).toLocaleDateString()}
      </time>
    </div>
  );
});

export default ProvenanceBadge;
