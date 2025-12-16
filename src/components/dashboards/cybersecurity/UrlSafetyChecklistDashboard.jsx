"use client";

import React, { useMemo, useState } from "react";
import { Link, AlertTriangle, CheckCircle } from "lucide-react";

function checkUrl(urlString) {
  const checks = {
    valid: false,
    hasHttps: false,
    hasPunycode: false,
    longHost: false,
    longPath: false,
    suspiciousChars: false,
    usesIp: false,
  };

  try {
    const url = new URL(urlString);
    checks.valid = true;
    checks.hasHttps = url.protocol === "https:";
    checks.hasPunycode = url.hostname.includes("xn--");
    checks.longHost = url.hostname.length > 50;
    checks.longPath = url.pathname.length > 100;
    checks.suspiciousChars = /[^\w.-]/.test(url.hostname);
    checks.usesIp = /^\d+\.\d+\.\d+\.\d+$/.test(url.hostname);
  } catch {
    checks.valid = false;
  }

  return checks;
}

export default function UrlSafetyChecklistDashboard() {
  const [url, setUrl] = useState("https://example.com/path");

  const checks = useMemo(() => checkUrl(url), [url]);

  const riskLevel = useMemo(() => {
    if (!checks.valid) return { level: "invalid", label: "Invalid URL", color: "red" };
    const issues = [
      !checks.hasHttps,
      checks.hasPunycode,
      checks.longHost,
      checks.longPath,
      checks.usesIp,
    ].filter(Boolean).length;
    if (issues >= 3) return { level: "high", label: "High risk", color: "red" };
    if (issues >= 1) return { level: "medium", label: "Medium risk", color: "orange" };
    return { level: "low", label: "Low risk", color: "green" };
  }, [checks]);

  return (
    <div className="flex flex-col gap-6 rounded-2xl bg-slate-950/80 p-4 text-slate-50 shadow-sm ring-1 ring-slate-800 md:flex-row md:p-5">
      {/* Left: input */}
      <div className="flex flex-1 flex-col gap-4">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-slate-50">
            URL safety checklist
          </h3>
          <p className="mt-1 text-xs text-slate-300">
            Paste a URL to get a local safety checklist. This tool does not fetch the URL or call any
            external service. It is purely a static analysis.
          </p>
        </div>

        <div className="rounded-xl bg-slate-900/80 p-3 ring-1 ring-slate-800">
          <label className="mb-2 block text-xs font-medium text-slate-200">URL</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-2 py-1.5 text-xs text-slate-50 placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
            placeholder="https://example.com"
          />
        </div>

        {!checks.valid && (
          <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-xs text-red-300">
            Please enter a valid URL starting with http:// or https://
          </div>
        )}
      </div>

      {/* Right: checklist */}
      <div className="flex w-full max-w-xs flex-col gap-4 md:max-w-sm">
        <div className="rounded-2xl bg-slate-900/80 p-4 ring-1 ring-slate-800">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link size={18} className="text-sky-400" />
              <h4 className="text-xs font-semibold text-slate-100">Safety checks</h4>
            </div>
            <span className={`rounded-full px-2 py-1 text-[0.65rem] font-medium ${
              riskLevel.color === "red" ? "bg-red-500/20 text-red-300" :
              riskLevel.color === "orange" ? "bg-orange-500/20 text-orange-300" :
              "bg-emerald-500/20 text-emerald-300"
            }`}>
              {riskLevel.label}
            </span>
          </div>

          {checks.valid ? (
            <div className="space-y-2">
              <div className={`flex items-center justify-between rounded-lg p-2 ${
                checks.hasHttps ? "bg-emerald-500/10" : "bg-red-500/10"
              }`}>
                <span className="text-xs text-slate-300">Uses HTTPS</span>
                {checks.hasHttps ? (
                  <CheckCircle size={14} className="text-emerald-400" />
                ) : (
                  <AlertTriangle size={14} className="text-red-400" />
                )}
              </div>
              <div className={`flex items-center justify-between rounded-lg p-2 ${
                !checks.hasPunycode ? "bg-emerald-500/10" : "bg-orange-500/10"
              }`}>
                <span className="text-xs text-slate-300">No punycode</span>
                {!checks.hasPunycode ? (
                  <CheckCircle size={14} className="text-emerald-400" />
                ) : (
                  <AlertTriangle size={14} className="text-orange-400" />
                )}
              </div>
              <div className={`flex items-center justify-between rounded-lg p-2 ${
                !checks.usesIp ? "bg-emerald-500/10" : "bg-orange-500/10"
              }`}>
                <span className="text-xs text-slate-300">Uses domain name</span>
                {!checks.usesIp ? (
                  <CheckCircle size={14} className="text-emerald-400" />
                ) : (
                  <AlertTriangle size={14} className="text-orange-400" />
                )}
              </div>
              <div className={`flex items-center justify-between rounded-lg p-2 ${
                !checks.longHost ? "bg-emerald-500/10" : "bg-orange-500/10"
              }`}>
                <span className="text-xs text-slate-300">Reasonable host length</span>
                {!checks.longHost ? (
                  <CheckCircle size={14} className="text-emerald-400" />
                ) : (
                  <AlertTriangle size={14} className="text-orange-400" />
                )}
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-400">Enter a valid URL to see checks</div>
          )}
        </div>

        <div className="rounded-2xl bg-slate-900/80 p-3 text-xs text-slate-200 ring-1 ring-slate-800">
          <p className="font-semibold text-sky-200">What to watch for</p>
          <ul className="mt-1 space-y-1 text-[0.7rem] text-slate-300">
            <li>• HTTPS protects data in transit</li>
            <li>• Punycode can hide lookalike domains</li>
            <li>• IP addresses instead of domains are unusual</li>
            <li>• Very long hosts or paths may be suspicious</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

