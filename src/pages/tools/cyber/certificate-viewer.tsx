"use client";

import React, { useState } from "react";
import Link from "next/link";
import ToolShell from "@/components/tools/ToolShell";
import { getToolContract } from "@/lib/tools/loadContract";
import { createToolError } from "@/components/tools/ErrorPanel";
import type { ToolContract, ExecutionMode } from "@/components/tools/ToolShell";

const contract = getToolContract("cert-viewer");

const examples = [
  {
    title: "Example Self-Signed Cert",
    inputs: {
      certificate: `-----BEGIN CERTIFICATE-----
MIICXDCCAUYCCQC6YNqVpJH8GjANBgkqhkiG9w0BAQsFADBkMQswCQYDVQQGEwJV
UzELMAkGA1UECAwCQ0ExEjAQBgNVBAcMCVNhbiBGcmFuYzEPMA0GA1UECgwGRXhh
bXBsZTERMA8GA1UECwwIRXhhbXBsZTEQMA4GA1UEAwwHZXhhbXBsZTAeFw0yNDAx
MDEwMDAwMDBaFw0yNTAxMDEwMDAwMDBaMGQxCzAJBgNVBAYTAlVTMQswCQYDVQQI
DAJDQTESMBAGA1UEBwwJU2FuIEZyYW5jMQ8wDQYDVQQKDAZFeGFtcGxlMREwDwYD
VQQLDAhFeGFtcGxlMRAwDgYDVQQDDAdleGFtcGxlMIGfMA0GCSqGSIb3DQEBAQUA
A4GNADCBiQKBgQC3vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6
Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ
6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6QIDAQABMA0GCSqGSIb3DQEBCwUA
A4GBABQN8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8
vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q
8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6
Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ
6Q==
-----END CERTIFICATE-----`,
    },
  },
  {
    title: "Try Your Own Certificate",
    inputs: {
      certificate: `-----BEGIN CERTIFICATE-----
MIICXDCCAUYCCQC6YNqVpJH8GjANBgkqhkiG9w0BAQsFADBkMQswCQYDVQQGEwJV
UzELMAkGA1UECAwCQ0ExEjAQBgNVBAcMCVNhbiBGcmFuYzEPMA0GA1UECgwGRXhh
bXBsZTERMA8GA1UECwwIRXhhbXBsZTEQMA4GA1UEAwwHZXhhbXBsZTAeFw0yNDAx
MDEwMDAwMDBaFw0yNTAxMDEwMDAwMDBaMGQxCzAJBgNVBAYTAlVTMQswCQYDVQQI
DAJDQTESMBAGA1UEBwwJU2FuIEZyYW5jMQ8wDQYDVQQKDAZFeGFtcGxlMREwDwYD
VQQLDAhFeGFtcGxlMRAwDgYDVQQDDAdleGFtcGxlMIGfMA0GCSqGSIb3DQEBAQUA
A4GNADCBiQKBgQC3vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6
Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ
6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6Q8vJ6QIDAQABMA0GCSqGSIb3DQEBCwUAA4GB
-----END CERTIFICATE-----`,
    },
  },
  {
    title: "Minimal Test Cert",
    inputs: {
      certificate: `-----BEGIN CERTIFICATE-----
MIICXDCCAUYCCQC6YNqVpJH8GjANBgkqhkiG9w0BAQsFADBkMQswCQYDVQQGEwJV
UzELMAkGA1UECAwCQ0ExEjAQBgNVBAcMCVNhbiBGcmFuYzEPMA0GA1UECgwGRXhh
bXBsZTERMA8GA1UECwwIRXhhbXBsZTEQMA4GA1UEAwwHZXhhbXBsZTAeFw0yNDAx
-----END CERTIFICATE-----`,
    },
  },
];

function parsePEMCertificate(pem: string) {
  // Basic PEM parsing (educational - not production-grade)
  const lines = pem.split("\n");
  const base64 = lines
    .filter((line) => !line.includes("BEGIN") && !line.includes("END") && line.trim().length > 0)
    .join("");

  try {
    // Decode base64 to get certificate info (simplified)
    const decoded = atob(base64);
    return {
      format: "PEM",
      size: pem.length,
      valid: true,
      // In a real implementation, you'd parse the ASN.1 structure
      // For now, return basic info
      note: "Certificate parsed. Full parsing requires ASN.1 decoder.",
    };
  } catch (err) {
    throw new Error("Invalid PEM format");
  }
}

export default function CertificateViewerPage() {
  const [certificate, setCertificate] = useState("");

  if (!contract) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <p className="text-red-600">Tool contract not found.</p>
      </div>
    );
  }

  const handleRun = async (mode: ExecutionMode, inputs: Record<string, unknown>) => {
    const cert = inputs.certificate as string;
    if (!cert || cert.trim().length === 0) {
      return {
        success: false,
        error: createToolError("validation_error", "cert-viewer", { field: "certificate" }),
      };
    }

    try {
      const parsed = parsePEMCertificate(cert);
      const result = {
        ...parsed,
        rawLength: cert.length,
        hasBeginMarker: cert.includes("BEGIN CERTIFICATE"),
        hasEndMarker: cert.includes("END CERTIFICATE"),
        // Extract basic info from PEM
        subject: cert.match(/CN=([^,]+)/)?.[1] || "Not found",
        issuer: cert.match(/O=([^,]+)/)?.[1] || "Not found",
      };
      return { success: true, output: JSON.stringify(result, null, 2) };
    } catch (err) {
      return {
        success: false,
        error: createToolError("parse_error", "cert-viewer", { message: err instanceof Error ? err.message : String(err) }),
      };
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      <nav className="mb-4">
        <Link href="/tools" className="text-sm font-semibold text-blue-700 hover:underline">
          ← Back to Tools
        </Link>
      </nav>

      <ToolShell contract={contract} onRun={handleRun} examples={examples} initialInputs={{ certificate }}>
        <div className="space-y-4">
          <div>
            <label htmlFor="certificate" className="block text-sm font-semibold text-slate-900">
              Certificate (PEM format)
            </label>
            <textarea
              id="certificate"
              value={certificate}
              onChange={(e) => setCertificate(e.target.value)}
              rows={15}
              className="mt-2 w-full rounded-lg border border-slate-300 p-3 font-mono text-xs focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500"
              placeholder="-----BEGIN CERTIFICATE-----&#10;...&#10;-----END CERTIFICATE-----"
            />
            <p className="mt-1 text-xs text-slate-600">Paste PEM or DER certificate. Max 10KB</p>
          </div>
        </div>
      </ToolShell>
    </div>
  );
}

