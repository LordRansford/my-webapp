"use client";

import React, { useState } from "react";

type Analysis = {
  ok: boolean;
  issues: string[];
  parts?: {
    scheme: string;
    host: string;
    registrableDomain: string;
    tld: string;
    path: string;
    query: string;
  };
};

function analyseUrl(input: string): Analysis {
  const trimmed = input.trim();
  if (!trimmed) return { ok: true, issues: [] };

  try {
    const url = new URL(
      trimmed.match(/^https?:\/\//i) ? trimmed : "https://" + trimmed
    );
    const host = url.hostname;
    const bits = host.split(".");
    const tld = bits.length > 1 ? bits[bits.length - 1] : "";
    const registrableDomain =
      bits.length > 1 ? bits.slice(bits.length - 2).join(".") : host;

    const issues: string[] = [];

    if (url.username || url.password) {
      issues.push("The address contains a username or password section.");
    }
    if (host.includes("@")) {
      issues.push("The address uses an @ symbol inside the host name.");
    }
    if (host.startsWith("xn--")) {
      issues.push("The host uses punycode which can hide look alike letters.");
    }
    if (url.search.includes("@") || url.search.includes("%40")) {
      issues.push("The query string contains an @ symbol.");
    }
    if (url.hash) {
      issues.push("The address has a fragment part after #.");
    }

    return {
      ok: issues.length === 0,
      issues,
      parts: {
        scheme: url.protocol.replace(":", ""),
        host,
        registrableDomain,
        tld,
        path: url.pathname === "/" ? "" : url.pathname,
        query: url.search.replace(/^\?/, ""),
      },
    };
  } catch {
    return {
      ok: false,
      issues: ["The text could not be parsed as a web address."],
    };
  }
}

export function SafeLinkInspector() {
  const [input, setInput] = useState("");
  const analysis = analyseUrl(input);
  const verdictColor =
    input.trim().length === 0
      ? "bg-slate-50 text-slate-700 border-slate-200"
      : analysis.ok
      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
      : "bg-amber-50 text-amber-800 border-amber-200";

  return (
    <section
      aria-labelledby="safe-link-inspector-title"
      className="rounded-3xl bg-white shadow-sm ring-1 ring-slate-100 p-6 sm:p-8 space-y-6"
    >
      <header className="space-y-2">
        <h2
          id="safe-link-inspector-title"
          className="text-lg sm:text-xl font-semibold text-slate-900"
        >
          Safe link inspector
        </h2>
        <p className="text-sm text-slate-600 max-w-xl">
          Paste or type a web address to see how the browser interprets it. The
          goal is not to say if a site is safe. The goal is to help you read the
          address with more confidence.
        </p>
      </header>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <label
            htmlFor="safe-link-input"
            className="text-xs font-medium uppercase tracking-wide text-slate-500 sm:w-32"
          >
            Web address
          </label>
          <input
            id="safe-link-input"
            type="text"
            className="flex-1 rounded-2xl border border-slate-200 bg-slate-50/60 px-3 py-2 text-sm text-slate-800 shadow-inner focus:border-sky-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-200"
            placeholder="For example: https://signin.example.com/payments"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${verdictColor}`}
        >
          <p className="text-xs uppercase tracking-wide mb-1">
            What this tells you
          </p>
          {input.trim().length === 0 ? (
            <p>
              Start typing a link or domain. The tool will not open it or send
              it anywhere. It only shows how the browser would read it.
            </p>
          ) : analysis.ok ? (
            <p>
              The structure of this address is valid. That does not mean the
              site is trustworthy. Always confirm the registrable domain matches
              the service you expect.
            </p>
          ) : (
            <p>
              Something about this address deserves closer attention. Read the
              notes below before you decide whether to visit it.
            </p>
          )}
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">
              Address breakdown
            </h3>
            {analysis.parts ? (
              <dl className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-slate-700">
                <dt className="font-semibold">Scheme</dt>
                <dd>{analysis.parts.scheme || "Not found"}</dd>
                <dt className="font-semibold">Host name</dt>
                <dd>{analysis.parts.host || "Not found"}</dd>
                <dt className="font-semibold">Registrable domain</dt>
                <dd>{analysis.parts.registrableDomain || "Not found"}</dd>
                <dt className="font-semibold">Top level domain</dt>
                <dd>{analysis.parts.tld || "Not found"}</dd>
                <dt className="font-semibold">Path</dt>
                <dd>{analysis.parts.path || "None"}</dd>
                <dt className="font-semibold">Query</dt>
                <dd>{analysis.parts.query || "None"}</dd>
              </dl>
            ) : (
              <p className="text-xs text-slate-500">
                Once you enter a valid address, this panel will show how the
                browser splits it into parts.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-4 space-y-2">
            <h3 className="text-sm font-semibold text-slate-900">
              Things to slow down for
            </h3>
            {analysis.issues.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
                {analysis.issues.map((issue, idx) => (
                  <li key={idx}>{issue}</li>
                ))}
                <li>
                  If you did not expect this link or you feel even slightly
                  unsure, open a fresh tab and type the address of the service
                  manually instead of clicking.
                </li>
              </ul>
            ) : (
              <p className="text-xs text-slate-500">
                No structural red flags were detected. This is not a guarantee
                that the site is safe. Combine this with content and context.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
