"use client";

import React from "react";

type DonationNoticeProps = {
  className?: string;
};

export default function DonationNotice({ className = "" }: DonationNoticeProps) {
  return (
    <div className={`rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 shadow-sm ${className}`}>
      <div className="flex items-start gap-3">
        <div aria-hidden="true" className="mt-0.5 text-lg">
          💙
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-amber-900">Donation requested for commercial exports without attribution</p>
          <p className="text-amber-800">
            Hosting, maintenance, and continuous improvements are funded by voluntary donations. If you plan to use this
            commercially without keeping attribution, please acknowledge that intent with a donation or permission
            token. It remains optional today, but it keeps the lights on.
          </p>
          <ul className="list-disc pl-5 text-amber-800">
            <li>Supports hosting and print-friendly rendering</li>
            <li>Funds accessibility and layout fixes</li>
            <li>Helps us keep templates editable and friendly</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
