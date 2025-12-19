"use client";

import { useEffect, useMemo, useState } from "react";
import TemplateLayout from "@/components/templates/TemplateLayout";
import TemplateExportPanel from "@/components/templates/TemplateExportPanel";
import { useTemplateState } from "@/hooks/useTemplateState";

const attribution =
  "Created by Ransford for Ransfords Notes. Internal use allowed. Commercial use requires visible attribution. Exports are gated per policy.";

const formatTimestamp = (iso) => {
  if (!iso) return "Not saved yet";
  try {
    return new Date(iso).toLocaleString();
  } catch (error) {
    return iso;
  }
};

const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    /* ignore */
  }
};

const toHex = (buffer) =>
  Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

export function HashingPlayground() {
  const storageKey = "template-cyber-crypto-hashing";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    input: "Integrity sample",
    algorithm: "SHA-256",
    output: "",
  });

  useEffect(() => {
    const run = async () => {
      const enc = new TextEncoder();
      const data = enc.encode(state.input);
      const hash = await crypto.subtle.digest(state.algorithm, data);
      updateState((prev) => ({ ...prev, output: toHex(hash) }));
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.algorithm, state.input]);

  const buildSections = () => [
    { heading: "Input", body: state.input },
    { heading: "Algorithm", body: state.algorithm },
    { heading: "Hash", body: state.output },
  ];

  return (
    <TemplateLayout
      title="Hashing Playground"
      description="Generate hashes with WebCrypto for quick integrity checks."
      audience="Developers and analysts."
      useCases={["Show how hashing works for integrity.", "Verify sample data matches expected hash.", "Teach why hashing is one-way."]}
      instructions={["Enter sample text.", "Choose an algorithm.", "Copy the hash for validation or demos."]}
      outputTitle="Hash output"
      outputSummary={state.output}
      outputInterpretation="Hashing is one-way. Do not use for password storage without salt and key stretching."
      outputNextSteps={["Use SHA-256 or better for integrity.", "Do not roll your own crypto.", "Use salts and KDFs for passwords."]}
      attributionText={attribution}
      version="1.0.0"
    >
      <TemplateExportPanel
        templateId="cyber-crypto-hashing"
        title="Hashing Playground"
        category="Cybersecurity"
        version="1.0.0"
        attributionText={attribution}
        prepareSections={buildSections}
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-medium text-slate-700">Autosaves locally. Last updated: {formatTimestamp(lastUpdated)}</p>
        <button
          type="button"
          onClick={resetState}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:border-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          Reset
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-semibold text-slate-900">
          Input text
          <textarea
            value={state.input}
            onChange={(e) => updateState((prev) => ({ ...prev, input: e.target.value }))}
            rows={4}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <label className="text-sm font-semibold text-slate-900">
          Algorithm
          <select
            value={state.algorithm}
            onChange={(e) => updateState((prev) => ({ ...prev, algorithm: e.target.value }))}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            <option value="SHA-256">SHA-256</option>
            <option value="SHA-384">SHA-384</option>
            <option value="SHA-512">SHA-512</option>
          </select>
        </label>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">Hash</p>
        <p className="mt-2 break-all rounded-lg bg-slate-50 p-3 text-xs text-slate-800">{state.output}</p>
        <button
          type="button"
          onClick={() => copyText(state.output)}
          className="mt-2 inline-flex items-center rounded-full bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          Copy hash
        </button>
      </div>
    </TemplateLayout>
  );
}

async function hmacSign(message, secret) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return toHex(sig);
}

export function HmacDemo() {
  const storageKey = "template-cyber-crypto-hmac";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    message: "Sample message",
    secret: "shared-secret",
    signature: "",
  });

  useEffect(() => {
    hmacSign(state.message, state.secret).then((sig) => updateState((prev) => ({ ...prev, signature: sig })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.message, state.secret]);

  const buildSections = () => [
    { heading: "Message", body: state.message },
    { heading: "Signature", body: state.signature },
  ];

  return (
    <TemplateLayout
      title="HMAC Signing Demo"
      description="Sign messages with HMAC using WebCrypto to illustrate authenticity."
      audience="Developers and security coaches."
      useCases={["Show why shared secrets must be protected.", "Validate webhook signatures.", "Teach authenticity basics."]}
      instructions={["Enter a message and shared secret.", "Review the signature output.", "Explain how receivers verify signatures."]}
      outputTitle="HMAC signature"
      outputSummary={state.signature}
      outputInterpretation="HMAC proves message integrity and authenticity when both parties share a secret. Rotate secrets regularly."
      outputNextSteps={["Store secrets securely.", "Rotate secrets on role changes.", "Prefer asymmetric signatures where possible."]}
      attributionText={attribution}
      version="1.0.0"
    >
      <TemplateExportPanel
        templateId="cyber-crypto-hmac"
        title="HMAC Signing Demo"
        category="Cybersecurity"
        version="1.0.0"
        attributionText={attribution}
        prepareSections={buildSections}
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-medium text-slate-700">Autosaves locally. Last updated: {formatTimestamp(lastUpdated)}</p>
        <button
          type="button"
          onClick={resetState}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:border-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          Reset
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-semibold text-slate-900">
          Message
          <textarea
            value={state.message}
            onChange={(e) => updateState((prev) => ({ ...prev, message: e.target.value }))}
            rows={3}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <label className="text-sm font-semibold text-slate-900">
          Shared secret (sample)
          <input
            type="text"
            value={state.secret}
            onChange={(e) => updateState((prev) => ({ ...prev, secret: e.target.value }))}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">Signature</p>
        <p className="mt-2 break-all rounded-lg bg-slate-50 p-3 text-xs text-slate-800">{state.signature}</p>
      </div>
    </TemplateLayout>
  );
}

const deriveKey = async (password, salt = "salt") => {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: enc.encode(salt), iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
};

const encrypt = async (message, password) => {
  const enc = new TextEncoder();
  const key = await deriveKey(password);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipher = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(message));
  const cipherText = btoa(String.fromCharCode(...new Uint8Array(cipher)));
  return { iv: toHex(iv), cipher: cipherText };
};

const decrypt = async (cipher, ivHex, password) => {
  const enc = new TextEncoder();
  const iv = new Uint8Array(ivHex.match(/.{1,2}/g).map((b) => parseInt(b, 16)));
  const key = await deriveKey(password);
  const data = Uint8Array.from(atob(cipher), (c) => c.charCodeAt(0));
  const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data);
  return new TextDecoder().decode(plain);
};

export function AesDemo() {
  const storageKey = "template-cyber-crypto-aes";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    message: "Sensitive sample",
    password: "passphrase",
    cipher: "",
    iv: "",
    decrypted: "",
  });

  const handleEncrypt = async () => {
    const { cipher, iv } = await encrypt(state.message, state.password);
    updateState((prev) => ({ ...prev, cipher, iv, decrypted: "" }));
  };

  const handleDecrypt = async () => {
    try {
      const plain = await decrypt(state.cipher, state.iv, state.password);
      updateState((prev) => ({ ...prev, decrypted: plain }));
    } catch {
      updateState((prev) => ({ ...prev, decrypted: "Decryption failed" }));
    }
  };

  const buildSections = () => [
    { heading: "Message", body: state.message },
    { heading: "Cipher", body: state.cipher },
    { heading: "IV", body: state.iv },
  ];

  return (
    <TemplateLayout
      title="Symmetric Encryption Demo"
      description="Encrypt and decrypt sample text with AES GCM using WebCrypto."
      audience="Developers and security coaches."
      useCases={["Show how AES-GCM works.", "Explain why IVs must be unique.", "Demonstrate password based keys."]}
      instructions={[
        "Enter a sample message and passphrase.",
        "Encrypt to see cipher text and IV.",
        "Decrypt to verify output. Use for education only.",
      ]}
      outputTitle="Encryption output"
      outputSummary={`Cipher length: ${state.cipher.length} characters`}
      outputInterpretation="AES-GCM provides confidentiality and integrity when keys and IVs are handled correctly."
      outputNextSteps={["Use unique IVs per encryption.", "Store keys securely.", "Prefer managed KMS for production."]}
      attributionText={attribution}
      version="1.0.0"
    >
      <TemplateExportPanel
        templateId="cyber-crypto-aes"
        title="Symmetric Encryption Demo"
        category="Cybersecurity"
        version="1.0.0"
        attributionText={attribution}
        prepareSections={buildSections}
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-medium text-slate-700">Autosaves locally. Last updated: {formatTimestamp(lastUpdated)}</p>
        <button
          type="button"
          onClick={resetState}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:border-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          Reset
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-semibold text-slate-900">
          Message
          <textarea
            value={state.message}
            onChange={(e) => updateState((prev) => ({ ...prev, message: e.target.value }))}
            rows={3}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
        <label className="text-sm font-semibold text-slate-900">
          Passphrase (sample)
          <input
            type="text"
            value={state.password}
            onChange={(e) => updateState((prev) => ({ ...prev, password: e.target.value }))}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleEncrypt}
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          Encrypt
        </button>
        <button
          type="button"
          onClick={handleDecrypt}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:border-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          Decrypt
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Cipher</p>
          <p className="mt-2 break-all rounded-lg bg-slate-50 p-3 text-xs text-slate-800">{state.cipher}</p>
          <p className="mt-2 text-xs text-slate-700">IV: {state.iv}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Decrypted output</p>
          <p className="mt-2 break-words rounded-lg bg-slate-50 p-3 text-sm text-slate-800">{state.decrypted || "Not decrypted yet"}</p>
        </div>
      </div>
    </TemplateLayout>
  );
}

export function KeyPrimer() {
  const storageKey = "template-cyber-crypto-key-primer";
  const { state, updateState, resetState, lastUpdated } = useTemplateState(storageKey, {
    pem: "",
    findings: [],
  });

  useEffect(() => {
    const findings = [];
    if (state.pem.includes("PRIVATE KEY")) findings.push("Contains a private key. Protect and do not share.");
    if (state.pem.includes("PUBLIC KEY")) findings.push("Contains a public key. Safe to distribute for verification.");
    if (state.pem.includes("BEGIN CERTIFICATE")) findings.push("Looks like a certificate. Check expiry and issuer.");
    if (!findings.length && state.pem) findings.push("Unrecognised format. Ensure PEM headers and footers are present.");
    updateState((prev) => ({ ...prev, findings }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.pem]);

  const buildSections = () => [
    { heading: "Input", body: state.pem.slice(0, 200) },
    { heading: "Findings", body: state.findings.join(" ") },
  ];

  return (
    <TemplateLayout
      title="Key and Certificate Primer"
      description="Validate PEM headers and capture basic handling guidance."
      audience="Engineers handling keys and certs."
      useCases={["Check if content is a key or certificate.", "Remind teams about safe handling.", "Document notes for reviews."]}
      instructions={[
        "Paste a sample PEM (do not paste real production secrets here).",
        "Review the quick findings.",
        "Share handling guidance with the team.",
      ]}
      outputTitle="Primer result"
      outputSummary={state.findings.join(" ")}
      outputInterpretation="Always treat private keys as sensitive. Use HSM or KMS where possible."
      outputNextSteps={[
        "Store private keys securely.",
        "Rotate certificates before expiry.",
        "Remove keys from repos and logs.",
      ]}
      attributionText={attribution}
      version="1.0.0"
    >
      <TemplateExportPanel
        templateId="cyber-crypto-key-primer"
        title="Key and Certificate Primer"
        category="Cybersecurity"
        version="1.0.0"
        attributionText={attribution}
        prepareSections={buildSections}
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-sm font-medium text-slate-700">Autosaves locally. Last updated: {formatTimestamp(lastUpdated)}</p>
        <button
          type="button"
          onClick={resetState}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:border-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        >
          Reset
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <label className="text-sm font-semibold text-slate-900">
          PEM content (sample only)
          <textarea
            value={state.pem}
            onChange={(e) => updateState((prev) => ({ ...prev, pem: e.target.value }))}
            rows={6}
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            placeholder="-----BEGIN CERTIFICATE-----"
          />
        </label>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-900">Findings</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
          {state.findings.map((f, idx) => (
            <li key={idx}>{f}</li>
          ))}
        </ul>
      </div>
    </TemplateLayout>
  );
}

export const cryptoTools = {
  "cyber-crypto-hashing": HashingPlayground,
  "cyber-crypto-hmac": HmacDemo,
  "cyber-crypto-aes": AesDemo,
  "cyber-crypto-key-primer": KeyPrimer,
};
