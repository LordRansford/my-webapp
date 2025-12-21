"use client";

import React, { useMemo, useState } from "react";
import { MailSearch } from "lucide-react";
import { CyberToolCard } from "./CyberToolCard";

type AuthResult = {
  spf?: string;
  dkim?: string;
  dmarc?: string;
};

function extractAuthResults(raw: string): AuthResult {
  const lines = raw.split(/\r?\n/);
  const result: AuthResult = {};

  for (const line of lines) {
    const lower = line.toLowerCase();
    if (lower.startsWith("authentication-results:")) {
      if (lower.includes("spf=")) {
        const match = lower.match(/spf=([a-z]+)/);
        if (match) result.spf = match[1];
      }
      if (lower.includes("dkim=")) {
        const match = lower.match(/dkim=([a-z]+)/);
        if (match) result.dkim = match[1];
      }
      if (lower.includes("dmarc=")) {
        const match = lower.match(/dmarc=([a-z]+)/);
        if (match) result.dmarc = match[1];
      }
    }
  }

  return result;
}

function classifyAuth(result: AuthResult): string {
  const { spf, dkim, dmarc } = result;

  if (!spf && !dkim && !dmarc) {
    return "No SPF, DKIM or DMARC results were found in the headers. This does not prove the mail is fake, but it means you have less automated help.";
  }

  if (spf === "pass" && dkim === "pass" && dmarc === "pass") {
    return "SPF, DKIM and DMARC all passed. This makes spoofing less likely, but it does not guarantee the content is benign. Still treat links and attachments with care.";
  }

  if (dmarc === "fail" || spf === "fail" || dkim === "fail") {
    return "At least one email authentication check failed. Treat this message as suspicious and verify through another channel before acting.";
  }

  return "Some authentication checks passed but not all fields are clear. Combine this result with your own judgement and organisational guidance.";
}

export function EmailAuthTool() {
  const [rawEmail, setRawEmail] = useState("Authentication-Results: example.com; spf=pass; dkim=pass; dmarc=pass");

  const auth = useMemo(() => extractAuthResults(rawEmail), [rawEmail]);
  const verdict = useMemo(() => classifyAuth(auth), [auth]);

  return (
    <CyberToolCard
      id="email-auth-title"
      title="Email header and authentication explainer"
      icon={<MailSearch className="h-4 w-4" aria-hidden="true" />}
      description="Paste full email headers and see what SPF, DKIM and DMARC are saying in plain language, without sending your mail anywhere."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
          <label htmlFor="email-input" className="block text-xs font-semibold text-slate-700">
            Paste raw email headers or source
          </label>
          <textarea
            id="email-input"
            value={rawEmail}
            onChange={(e) => setRawEmail(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 min-h-[140px] resize-vertical"
            placeholder="Use your mail client’s View original or Show source feature and paste everything here."
          />
          <p className="text-xs text-slate-500">This tool does not contact any external service. It only parses what you paste locally.</p>
        </div>

        <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700 space-y-1">
            <p className="font-semibold text-slate-900">Authentication results</p>
            <p className="text-sm">
              SPF: <span className="font-semibold text-slate-900">{auth.spf ?? "not found"}</span>
            </p>
            <p className="text-sm">
              DKIM: <span className="font-semibold text-slate-900">{auth.dkim ?? "not found"}</span>
            </p>
            <p className="text-sm">
              DMARC: <span className="font-semibold text-slate-900">{auth.dmarc ?? "not found"}</span>
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700 space-y-1">
            <p className="font-semibold text-slate-900">What this means in practice</p>
            <p className="text-sm text-slate-700">{verdict}</p>
            <p className="text-sm text-slate-500">
              Even with passes, you should still be careful with links, attachments and requests for money or credentials.
            </p>
          </div>
        </div>
      </div>
    </CyberToolCard>
  );
}
