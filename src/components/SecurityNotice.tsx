"use client";

import React from "react";

export function SecurityNotice() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50/70 px-4 py-3 text-sm text-amber-900 flex flex-col gap-1">
      <span className="font-semibold">Security note</span>
      <span className="text-xs text-amber-800">
        This is a learning sandbox. Do not paste real secrets or live customer data. Outputs are for education, not production compliance.
      </span>
    </div>
  );
}
