"use client";

import React, { useState } from "react";

type Verdict = "safe" | "caution" | "risky";

function scoreHeader(raw: string): { verdict: Verdict; reasons: string[] } {
  const text = raw.toLowerCase();
  const reasons: string[] = [];

  if (!text.includes("authentication-results")) {
    reasons.push("No Authentication-Results header was found.");
  }
  if (!text.includes("spf=")) {
    reasons.push("No SPF result was found in Authentication-Results.");
  } else if (text.includes("spf=fail") || text.includes("spf=softfail")) {
    reasons.push("SPF check failed for this message.");
  }
  if (text.includes("dkim=fail")) {
    reasons.push("DKIM signature failed validation.");
  }
  if (!text.includes("dmarc=")) {
    reasons.push("No DMARC result was found in Authentication-Results.");
  } else if (text.includes("dmarc=fail")) {
    reasons.push("DMARC evaluation failed for this message.");
  }

  const receivedCount = (text.match(/received:/g) || []).length;
  if (receivedCount < 2) {
    reasons.push("Only one Received header was found which is unusual.");
  }

  let verdict: Verdict = "safe";
  const lowerReasons = reasons.join(" ").toLowerCase();

  if (
    lowerReasons.includes("failed") ||
    lowerReasons.includes("unusual") ||
    lowerReasons.includes("no dmarc")
  ) {
    verdict = "caution";
  }
  if (
    lowerReasons.includes("spf check failed") ||
    lowerReasons.includes("dkim signature failed") ||
    lowerReasons.includes("dmarc evaluation failed")
  ) {
    verdict = "risky";
  }

  return { verdict, reasons };
}

const sampleHeader = `Return-Path: <billing@example-payments.com>
Received: from mail-ot1-f45.google.com (mail-ot1-f45.google.com. [209.85.210.45])
        by mx.example.org with ESMTPS id f19si123456qkf.123.2024.01.15.09.13.10
        for <you@example.org>
        (version=TLS1_3 cipher=TLS_AES_256_GCM_SHA384);
        Mon, 15 Jan 2024 09:13:10 +0000 (UTC)
Authentication-Results: mx.example.org;
        spf=softfail (google.com: domain of transitioning billing@example-payments.com does not designate 209.85.210.45 as permitted sender) smtp.mailfrom=billing@example-payments.com;
        dkim=fail;
        dmarc=fail;
From: "Payments team" <billing@example-payments.com>
To: you@example.org
Subject: Urgent: account suspended, update details now
Date: Mon, 15 Jan 2024 09:12:58 +0000`;

export function EmailHeaderLab() {
  const [header, setHeader] = useState("");
  const [useSample, setUseSample] = useState(false);

  const activeHeader = useSample ? sampleHeader : header;
  const { verdict, reasons } = activeHeader.trim()
    ? scoreHeader(activeHeader)
    : { verdict: "safe" as Verdict, reasons: [] };

  const verdictLabel =
    verdict === "safe"
      ? "Signals are mostly consistent. Still stay alert."
      : verdict === "caution"
      ? "Signals are mixed. Treat this message with caution."
      : "Multiple signals look risky. Treat this message as suspicious.";

  const verdictColor =
    verdict === "safe"
      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
      : verdict === "caution"
      ? "bg-amber-50 text-amber-800 border-amber-200"
      : "bg-rose-50 text-rose-800 border-rose-200";

  return (
    <section
      aria-labelledby="email-header-lab-title"
      className="rounded-3xl bg-white shadow-sm ring-1 ring-slate-100 p-6 sm:p-8 space-y-6"
    >
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2
            id="email-header-lab-title"
            className="text-lg sm:text-xl font-semibold text-slate-900"
          >
            Email header explainer
          </h2>
          <p className="mt-1 text-sm text-slate-600 max-w-xl">
            Paste an email header and see how SPF, DKIM and DMARC results
            affect your trust in the message. Nothing leaves your browser.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setUseSample((v) => !v)}
          className="inline-flex items-center justify-center rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
        >
          {useSample ? "Use your own header" : "Use example header"}
        </button>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <label
            htmlFor="email-header-input"
            className="text-xs font-medium uppercase tracking-wide text-slate-500"
          >
            Header text
          </label>
          <textarea
            id="email-header-input"
            className="h-56 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-sm font-mono text-slate-800 shadow-inner focus:border-sky-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-200"
            placeholder="Paste the full email header here..."
            value={useSample ? sampleHeader : header}
            onChange={(e) => {
              setUseSample(false);
              setHeader(e.target.value);
            }}
          />
          <p className="text-xs text-slate-500">
            Tip: In most email clients you can view the raw header via menu
            options like View original or Show source. Never paste sensitive
            content from private or confidential emails.
          </p>
        </div>

        <div className="space-y-4">
          <div
            className={`rounded-2xl border px-4 py-3 text-sm font-medium ${verdictColor}`}
          >
            <p className="text-xs uppercase tracking-wide mb-1">
              Overall signal
            </p>
            <p>{activeHeader.trim() ? verdictLabel : "Waiting for a header."}</p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">
              How to read this
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-700">
              <li>
                <span className="font-semibold">SPF</span> confirms the sending
                server is allowed to send mail for this domain.
              </li>
              <li>
                <span className="font-semibold">DKIM</span> is a digital
                signature that proves the message has not been changed in
                transit.
              </li>
              <li>
                <span className="font-semibold">DMARC</span> tells receivers how
                strictly to treat failures and can signal phishing.
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-4 space-y-2">
            <h3 className="text-sm font-semibold text-slate-900">
              Signals from this header
            </h3>
            {activeHeader.trim() ? (
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
                {reasons.length === 0 && (
                  <li>
                    No obvious red flags were found. This does not guarantee the
                    message is safe. Always check the content and context.
                  </li>
                )}
                {reasons.map((reason, idx) => (
                  <li key={idx}>{reason}</li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500">
                Paste a header to see a breakdown of the main signals.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
