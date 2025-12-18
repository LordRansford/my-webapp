"use client";

import React from "react";

export function SecurityBanner() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50/70 px-4 py-3 text-sm text-amber-900 flex flex-col gap-1">
      <span className="font-semibold">Security reminder</span>
      <span className="text-xs text-amber-800">
        This studio is for education and experimentation. Do not upload production data or secrets. Outputs are demos; review before using anywhere safety-critical or financial.
      </span>
    </div>
  );
}
