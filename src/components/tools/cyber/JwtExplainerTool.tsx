"use client";

import React, { useMemo, useState } from "react";
import { KeyRound } from "lucide-react";
import { CyberToolCard } from "./CyberToolCard";

type DecodedPart = Record<string, unknown> | null;

function safeDecode(segment: string): DecodedPart {
  try {
    const padded = segment.padEnd(segment.length + (4 - (segment.length % 4)) % 4, "=");
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

export function JwtExplainerTool() {
  const [token, setToken] = useState(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiYXVkIjoiYXBwIiwiZXhwIjoxNzAwMDAwMDAwLCJyb2xlIjoiYWRtaW4ifQ.signature"
  );

  const parts = token.split(".");
  const header = parts[0] ? safeDecode(parts[0]) : null;
  const payload = parts[1] ? safeDecode(parts[1]) : null;

  const hints = useMemo(() => {
    const notes: string[] = [];
    if (!header || !payload) {
      notes.push("This does not look like a valid JWT (header or payload could not be decoded).");
      return notes;
    }
    if (typeof header.alg === "string") {
      notes.push(`Algorithm: ${header.alg}. Ensure this matches what your server expects.`);
    } else {
      notes.push("No alg field found in header.");
    }
    if (!payload.exp) {
      notes.push("No exp (expiry) claim found. Tokens without expiry can be risky.");
    }
    if (!payload.aud) {
      notes.push("No aud (audience) claim found. Consider setting an audience to limit token scope.");
    }
    if (payload.role) {
      notes.push(`Role claim present: ${payload.role}. Make sure role-based access is enforced server side.`);
    }
    notes.push("Remember: this tool does not verify the signature. Treat contents as untrusted until your backend verifies.");
    return notes;
  }, [header, payload]);

  return (
    <CyberToolCard
      id="jwt-explainer-title"
      title="JWT explainer"
      icon={<KeyRound className="h-4 w-4" aria-hidden="true" />}
      description="Paste a JSON Web Token to decode header and payload safely in your browser. This does not verify signatures."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
          <label htmlFor="jwt-input" className="block text-xs font-semibold text-slate-700">
            Paste JWT
          </label>
          <textarea
            id="jwt-input"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 min-h-[120px] resize-vertical"
            placeholder="eyJhbGciOi... your token"
          />
          <p className="text-xs text-slate-500">No signature checks are done. Do not paste secrets.</p>
        </div>

        <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700 space-y-2">
            <p className="font-semibold text-slate-900">Decoded header</p>
            <pre className="text-sm whitespace-pre-wrap break-all text-slate-700">
              {header ? JSON.stringify(header, null, 2) : "Could not decode header"}
            </pre>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700 space-y-2">
            <p className="font-semibold text-slate-900">Decoded payload</p>
            <pre className="text-sm whitespace-pre-wrap break-all text-slate-700">
              {payload ? JSON.stringify(payload, null, 2) : "Could not decode payload"}
            </pre>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700 space-y-1">
            <p className="font-semibold text-slate-900">Quick checks</p>
            <ul className="space-y-1">
              {hints.map((h, idx) => (
                <li key={idx} className="text-sm text-slate-800">
                  • {h}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </CyberToolCard>
  );
}
