"use client";

import React, { useMemo, useState } from "react";
import { Shield } from "lucide-react";
import { CyberToolCard } from "./CyberToolCard";

type HeaderInfo = {
  name: string;
  value: string;
};

function parseHeaders(raw: string): HeaderInfo[] {
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, ...rest] = line.split(":");
      return {
        name: name?.trim() || "",
        value: rest.join(":").trim(),
      };
    })
    .filter((h) => h.name !== "");
}

function describeHeader(header: HeaderInfo): string {
  const name = header.name.toLowerCase();
  const value = header.value;

  if (name === "content-security-policy") {
    if (!value) {
      return "Content Security Policy is present but empty. This offers no protection.";
    }
    if (value.includes("unsafe-inline") || value.includes("unsafe-eval")) {
      return "CSP allows unsafe-inline or unsafe-eval. This makes script injection easier. Consider replacing them with explicit script hashes or nonces.";
    }
    if (value.includes("*")) {
      return "CSP uses wildcard sources. This can undermine isolation. Try to list specific domains instead.";
    }
    return "CSP is present. Review the allowed sources to ensure they are as tight as your application can tolerate.";
  }

  if (name === "strict-transport-security" || name === "strict-transport-security-policy") {
    if (!value.toLowerCase().includes("max-age")) {
      return "HSTS is present but max-age is missing or unclear. Set an explicit max-age to enforce HTTPS over time.";
    }
    return "HSTS is present. This helps force browsers to use HTTPS after the first visit.";
  }

  if (name === "x-frame-options") {
    if (value.toLowerCase().includes("deny") || value.toLowerCase().includes("sameorigin")) {
      return "X-Frame-Options is set, which helps protect against clickjacking.";
    }
    return "X-Frame-Options is present but not set to DENY or SAMEORIGIN. Review if your site should be framed at all.";
  }

  if (name === "x-content-type-options") {
    if (value.toLowerCase().includes("nosniff")) {
      return "X-Content-Type-Options is set to nosniff. This reduces certain content type confusion attacks.";
    }
    return "X-Content-Type-Options is present but not set to nosniff. Consider using nosniff for most sites.";
  }

  if (name === "referrer-policy") {
    return "Referrer-Policy controls how much URL information your site sends to other sites. Stricter policies can reduce leakage of sensitive paths.";
  }

  return "This header may provide security or privacy benefits. Check your security baseline to see if the value matches your standard.";
}

export function SecurityHeaderTool() {
  const [rawHeaders, setRawHeaders] = useState(
    "Content-Security-Policy: default-src 'self'; script-src 'self'\nStrict-Transport-Security: max-age=31536000; includeSubDomains\nX-Frame-Options: SAMEORIGIN\nX-Content-Type-Options: nosniff"
  );

  const parsed = useMemo(() => parseHeaders(rawHeaders), [rawHeaders]);

  const interesting = parsed.filter((h) =>
    ["content-security-policy", "strict-transport-security", "x-frame-options", "x-content-type-options", "referrer-policy"].includes(
      h.name.toLowerCase()
    )
  );

  const others = parsed.filter(
    (h) => !interesting.some((i) => i.name.toLowerCase() === h.name.toLowerCase())
  );

  return (
    <CyberToolCard
      id="security-header-title"
      title="Security header and CSP explainer"
      icon={<Shield className="h-4 w-4" aria-hidden="true" />}
      description="Paste HTTP response headers and see how Content Security Policy, HSTS and other headers contribute to your defence layers."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
          <label htmlFor="header-input" className="block text-xs font-semibold text-slate-700">
            Paste HTTP response headers
          </label>
          <textarea
            id="header-input"
            value={rawHeaders}
            onChange={(e) => setRawHeaders(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 min-h-[120px] resize-vertical"
            placeholder="Paste raw response headers from your browser developer tools."
          />
          <p className="text-xs text-slate-500">
            You can copy headers from the network tab of your browser developer tools. This tool does not contact your
            site, it just parses the text you paste.
          </p>
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
          <p className="text-xs font-semibold text-slate-700">Security related headers</p>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {interesting.length === 0 && (
              <p className="text-xs text-slate-500">
                No recognised security headers detected yet. Add CSP, HSTS, X-Frame-Options, X-Content-Type-Options or
                Referrer-Policy and recheck.
              </p>
            )}
            {interesting.map((h) => (
              <div key={h.name} className="rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700 space-y-1">
                <p className="font-semibold text-slate-900">{h.name}</p>
                <p className="text-[11px] text-slate-500 break-all">{h.value}</p>
                <p className="text-[11px] text-slate-700">{describeHeader(h)}</p>
              </div>
            ))}
          </div>
          {others.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-3 text-[11px] text-slate-600 space-y-1">
              <p className="font-semibold text-slate-900">Other headers detected</p>
              <p>These may also play a role in security or privacy, but they are not analysed in detail here.</p>
            </div>
          )}
        </div>
      </div>
    </CyberToolCard>
  );
}
