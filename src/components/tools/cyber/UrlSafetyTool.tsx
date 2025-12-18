"use client";

import React, { useMemo, useState } from "react";
import { Link2 } from "lucide-react";
import { CyberToolCard } from "./CyberToolCard";

type UrlAnalysis = {
  valid: boolean;
  reason?: string;
  hostname?: string;
  scheme?: string;
  hasIpHost: boolean;
  hasLongQuery: boolean;
  hasAtSymbol: boolean;
  hasPunycode: boolean;
};

function analyseUrl(input: string): UrlAnalysis {
  if (!input.trim()) {
    return { valid: false, reason: "No URL provided", hasIpHost: false, hasLongQuery: false, hasAtSymbol: false, hasPunycode: false };
  }

  let url: URL;
  try {
    url = new URL(input.trim());
  } catch (e) {
    try {
      url = new URL("https://" + input.trim());
    } catch {
      return {
        valid: false,
        reason: "This does not look like a valid URL even when adding https by default.",
        hasIpHost: false,
        hasLongQuery: false,
        hasAtSymbol: false,
        hasPunycode: false,
      };
    }
  }

  const hostname = url.hostname;
  const scheme = url.protocol.replace(":", "");
  const hasIpHost = !!hostname.match(/^\d{1,3}(\.\d{1,3}){3}$/);
  const hasLongQuery = url.search.length > 120;
  const hasAtSymbol = url.href.includes("@");
  const hasPunycode = hostname.startsWith("xn--");

  return {
    valid: true,
    hostname,
    scheme,
    hasIpHost,
    hasLongQuery,
    hasAtSymbol,
    hasPunycode,
  };
}

export function UrlSafetyTool() {
  const [rawUrl, setRawUrl] = useState("https://example.com/login?redirect=https://example.com/profile");

  const analysis = useMemo(() => analyseUrl(rawUrl), [rawUrl]);

  const riskNotes: string[] = [];

  if (!analysis.valid && analysis.reason) {
    riskNotes.push(analysis.reason);
  } else {
    if (analysis.scheme && analysis.scheme !== "https") {
      riskNotes.push("This URL does not use https by default. Be cautious about entering credentials or sensitive data.");
    }
    if (analysis.hasIpHost) {
      riskNotes.push("The host looks like a raw IP address. Many legitimate sites use domain names rather than bare IPs.");
    }
    if (analysis.hasPunycode) {
      riskNotes.push("The host appears to use punycode. This can be used for lookalike domains. Check the site carefully.");
    }
    if (analysis.hasLongQuery) {
      riskNotes.push("The query string is very long. Attackers sometimes hide additional redirects or tracking parameters here.");
    }
    if (analysis.hasAtSymbol) {
      riskNotes.push("The URL contains an @ symbol. Everything before @ can be ignored by the browser and used to mislead users.");
    }
    if (!riskNotes.length) {
      riskNotes.push("No obvious syntactic red flags detected. You should still check the context, content and your own expectations.");
    }
  }

  return (
    <CyberToolCard
      id="url-safety-title"
      title="URL safety workbench"
      icon={<Link2 className="h-4 w-4" aria-hidden="true" />}
      description="Paste a URL and see structural hints that may indicate phishing or suspicious behaviour, such as IP hosts, punycode or strange query strings."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
          <label htmlFor="url-input" className="block text-xs font-semibold text-slate-700">
            Paste or type a URL
          </label>
          <input
            id="url-input"
            type="text"
            value={rawUrl}
            onChange={(e) => setRawUrl(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            placeholder="For example: https://account.example.com/login?..."
          />
          <p className="text-xs text-slate-500">This tool does not contact the URL. It only inspects the structure in your browser.</p>
        </div>

        <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
          <p className="text-xs font-semibold text-slate-700">Analysis</p>
          {analysis.valid && (
            <div className="rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700 space-y-1">
              <p>
                Scheme: <span className="font-semibold text-slate-900">{analysis.scheme}</span>
              </p>
              <p>
                Host: <span className="font-semibold text-slate-900">{analysis.hostname}</span>
              </p>
            </div>
          )}
          <div className="rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700 space-y-1">
            <p className="font-semibold text-slate-900">Risk hints and questions</p>
            <ul className="mt-1 space-y-1">
              {riskNotes.map((note, idx) => (
                <li key={idx} className="text-[11px] text-slate-700">
                  • {note}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </CyberToolCard>
  );
}
