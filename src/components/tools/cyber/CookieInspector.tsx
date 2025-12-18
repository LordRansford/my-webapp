"use client";

import React, { useMemo, useState } from "react";
import { Cookie } from "lucide-react";
import { CyberToolCard } from "./CyberToolCard";

type ParsedCookie = {
  name: string;
  value: string;
  attributes: Record<string, string | boolean>;
};

function parseCookies(input: string): ParsedCookie[] {
  const lines = input
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const rawCookies: string[] = [];

  for (const line of lines) {
    if (/^set-cookie:/i.test(line)) {
      const afterColon = line.split(/:/, 2)[1] ?? "";
      if (afterColon.trim()) rawCookies.push(afterColon.trim());
    } else if (line.includes("=")) {
      rawCookies.push(line);
    }
  }

  return rawCookies.map((raw) => {
    const parts = raw.split(";");
    const [nameValue, ...rest] = parts;
    const [name, ...valueParts] = nameValue.split("=");
    const value = valueParts.join("=");
    const attributes: Record<string, string | boolean> = {};

    for (const piece of rest) {
      const trimmed = piece.trim();
      if (!trimmed) continue;
      const [attrName, ...attrValueParts] = trimmed.split("=");
      if (!attrValueParts.length) {
        attributes[attrName.toLowerCase()] = true;
      } else {
        attributes[attrName.toLowerCase()] = attrValueParts.join("=");
      }
    }

    return {
      name: name?.trim() || "",
      value: value?.trim() || "",
      attributes,
    };
  });
}

function classifyCookie(cookie: ParsedCookie): string {
  const nameLower = cookie.name.toLowerCase();

  if (nameLower.includes("session") || nameLower.includes("auth")) {
    return "Authentication or session cookie";
  }
  if (nameLower.includes("ga") || nameLower.includes("gid") || nameLower.includes("utm")) {
    return "Analytics or marketing cookie";
  }
  if (nameLower.includes("fb") || nameLower.includes("pixel") || nameLower.includes("ad")) {
    return "Advertising or tracking cookie";
  }
  return "Uncategorised cookie";
}

function assessCookieRisk(cookie: ParsedCookie): string[] {
  const risks: string[] = [];
  const attrs = cookie.attributes;
  const lowerName = cookie.name.toLowerCase();

  const isAuthLike = lowerName.includes("session") || lowerName.includes("auth") || lowerName.includes("token");

  if (isAuthLike && !attrs["httponly"]) {
    risks.push(
      "This looks like a session or authentication cookie but it is not marked HttpOnly. Scripts in the browser could potentially read it if an attacker injects code."
    );
  }

  if (isAuthLike && !attrs["secure"]) {
    risks.push("This cookie is not marked Secure. It could be sent over plain HTTP if the site ever serves content without encryption.");
  }

  if (!attrs["samesite"]) {
    risks.push("SameSite is not set. This can make cross site request forgery protections weaker if the cookie is used for sessions.");
  }

  if (attrs["expires"]) {
    risks.push(
      "This cookie has a fixed expiry time. Long lifetimes can increase privacy and security risk if the cookie is used for identification."
    );
  }

  if (!risks.length) {
    risks.push("No obvious technical flag issues detected. You should still check whether this cookie is necessary and proportionate.");
  }

  return risks;
}

export function CookieInspector() {
  const [rawInput, setRawInput] = useState(
    "Set-Cookie: sessionId=abc123; HttpOnly; Secure; SameSite=Lax\nSet-Cookie: analyticsId=xyz789; Path=/; Expires=Wed, 01 Jan 2030 00:00:00 GMT"
  );

  const cookies = useMemo(() => parseCookies(rawInput), [rawInput]);

  return (
    <CyberToolCard
      id="cookie-inspector-title"
      title="Cookie and tracker risk inspector"
      icon={<Cookie className="h-4 w-4" aria-hidden="true" />}
      description="Paste Set-Cookie headers or cookie strings and see how flags like Secure, HttpOnly and SameSite affect risk for sessions and tracking."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
          <label htmlFor="cookie-input" className="block text-xs font-semibold text-slate-700">
            Paste cookie headers or strings
          </label>
          <textarea
            id="cookie-input"
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 min-h-[120px] resize-vertical"
            placeholder="Paste Set-Cookie headers or a cookie string from your browser."
          />
          <p className="text-xs text-slate-500">
            You can copy headers from a browser developer tools network tab or paste the cookie string from
            document.cookie. All parsing happens in your browser.
          </p>
        </div>

        <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
          <p className="text-xs font-semibold text-slate-700">Analysis and risk hints</p>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {cookies.length === 0 && (
              <p className="text-xs text-slate-500">
                No cookies detected yet. Paste some Set-Cookie lines or a cookie string to see details.
              </p>
            )}
            {cookies.map((cookie) => {
              const category = classifyCookie(cookie);
              const risks = assessCookieRisk(cookie);
              return (
                <div
                  key={cookie.name || Math.random().toString(36)}
                  className="rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700 space-y-1"
                >
                  <p className="font-semibold text-slate-900">{cookie.name || "(unnamed cookie)"}</p>
                  <p className="text-[11px] text-slate-500">Category: {category}</p>
                  <p className="text-[11px] text-slate-500">
                    Flags:{" "}
                    {Object.keys(cookie.attributes).length
                      ? Object.keys(cookie.attributes)
                          .map((k) => k)
                          .join(", ")
                      : "none detected"}
                  </p>
                  <ul className="mt-1 space-y-1">
                    {risks.map((r, idx) => (
                      <li key={idx} className="text-[11px] text-slate-700">
                        • {r}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </CyberToolCard>
  );
}
