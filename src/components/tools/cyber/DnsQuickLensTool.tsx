"use client";

import React, { useMemo, useState } from "react";
import { Globe2 } from "lucide-react";
import { CyberToolCard } from "./CyberToolCard";

type DnsInsight = {
  line: string;
  notes: string[];
};

function analyseDns(raw: string): DnsInsight[] {
  const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  return lines.map((line) => {
    const lower = line.toLowerCase();
    const notes: string[] = [];

    if (lower.includes("spf")) {
      if (!lower.includes("~all") && !lower.includes("-all")) {
        notes.push("SPF record without an explicit all mechanism. Consider ~all or -all to define a default.");
      } else {
        notes.push("SPF record present. Check include mechanisms and IP ranges are correct.");
      }
    }
    if (lower.includes("v=dkim")) {
      notes.push("DKIM selector detected. Ensure the selector matches what your mail service uses.");
    }
    if (lower.includes("v=dmarc")) {
      if (lower.includes("p=none")) notes.push("DMARC policy p=none. This only monitors; consider quarantine or reject when ready.");
      if (lower.includes("p=quarantine")) notes.push("DMARC policy p=quarantine. Messages that fail may go to spam.");
      if (lower.includes("p=reject")) notes.push("DMARC policy p=reject. Messages that fail should be rejected.");
      if (!lower.includes("rua=")) notes.push("DMARC record missing rua= for aggregate reports. Add a reporting address.");
    }
    if (lower.includes("mx")) {
      notes.push("MX record detected. Verify priority and host are correct for your mail service.");
    }
    if (!notes.length) {
      notes.push("No specific SPF/DKIM/DMARC/MX hints detected for this line. Make sure the syntax matches provider guidance.");
    }
    return { line, notes };
  });
}

export function DnsQuickLensTool() {
  const [rawDns, setRawDns] = useState(
    `example.com. 300 IN TXT "v=spf1 include:_spf.google.com ~all"
_dmarc.example.com. 300 IN TXT "v=DMARC1; p=none; rua=mailto:dmarc@example.com"
selector1._domainkey.example.com. 300 IN TXT "v=DKIM1; k=rsa; p=MIIBIjANBgkqh..."`
  );

  const insights = useMemo(() => analyseDns(rawDns), [rawDns]);

  return (
    <CyberToolCard
      id="dns-quick-lens-title"
      title="DNS quick lens (SPF, DKIM, DMARC)"
      icon={<Globe2 className="h-4 w-4" aria-hidden="true" />}
      description="Paste TXT, MX or SPF records and get quick hints about SPF, DKIM and DMARC posture."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
          <label htmlFor="dns-input" className="block text-xs font-semibold text-slate-700">
            Paste DNS records (TXT, MX, SPF, DKIM, DMARC)
          </label>
          <textarea
            id="dns-input"
            value={rawDns}
            onChange={(e) => setRawDns(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 min-h-[140px] resize-vertical"
            placeholder='example.com. 300 IN TXT "v=spf1 include:_spf.google.com ~all"'
          />
          <p className="text-xs text-slate-500">This does not query DNS. It only parses the text you paste.</p>
        </div>

        <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
          <p className="text-xs font-semibold text-slate-700">Hints</p>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {insights.length === 0 && <p className="text-xs text-slate-500">No records detected.</p>}
            {insights.map((insight, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700 space-y-1"
              >
                <p className="text-sm text-slate-500 break-all">{insight.line}</p>
                <ul className="space-y-1">
                  {insight.notes.map((n, i) => (
                    <li key={i} className="text-sm text-slate-800">
                      • {n}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CyberToolCard>
  );
}
