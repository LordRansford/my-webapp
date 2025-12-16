"use client";

import React, { useState } from "react";
import { Key, Lock, Unlock, FileSignature, CheckCircle } from "lucide-react";

let keyPair = null;
let exportedPublicKey = null;

async function generateKeyPair() {
  keyPair = await crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );
  exportedPublicKey = await crypto.subtle.exportKey("spki", keyPair.publicKey);
  return true;
}

async function encryptWithPublicKey(message) {
  if (!keyPair) throw new Error("Generate key pair first");
  const encoder = new TextEncoder();
  const encrypted = await crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    keyPair.publicKey,
    encoder.encode(message)
  );
  return Array.from(new Uint8Array(encrypted))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function decryptWithPrivateKey(ciphertext) {
  if (!keyPair) throw new Error("Generate key pair first");
  const cipherArray = new Uint8Array(
    ciphertext.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
  );
  const decrypted = await crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    keyPair.privateKey,
    cipherArray
  );
  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}

async function signMessage(message) {
  if (!keyPair) throw new Error("Generate key pair first");
  const encoder = new TextEncoder();
  const signature = await crypto.subtle.sign(
    { name: "RSA-PSS", saltLength: 32 },
    keyPair.privateKey,
    encoder.encode(message)
  );
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function verifySignature(message, signature) {
  if (!keyPair) throw new Error("Generate key pair first");
  const encoder = new TextEncoder();
  const sigArray = new Uint8Array(
    signature.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
  );
  return crypto.subtle.verify(
    { name: "RSA-PSS", saltLength: 32 },
    keyPair.publicKey,
    sigArray,
    encoder.encode(message)
  );
}

export default function PublicPrivateKeyLabDashboard() {
  const [message, setMessage] = useState("Hello, world!");
  const [ciphertext, setCiphertext] = useState("");
  const [decrypted, setDecrypted] = useState("");
  const [signature, setSignature] = useState("");
  const [verified, setVerified] = useState(null);
  const [hasKeyPair, setHasKeyPair] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      await generateKeyPair();
      setHasKeyPair(true);
      setCiphertext("");
      setDecrypted("");
      setSignature("");
      setVerified(null);
    } catch (err) {
      setError("Key generation failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEncrypt = async () => {
    if (!hasKeyPair) {
      setError("Generate a key pair first");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await encryptWithPublicKey(message);
      setCiphertext(result);
      setDecrypted("");
    } catch (err) {
      setError("Encryption failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDecrypt = async () => {
    if (!ciphertext) {
      setError("Encrypt a message first");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await decryptWithPrivateKey(ciphertext);
      setDecrypted(result);
    } catch (err) {
      setError("Decryption failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSign = async () => {
    if (!hasKeyPair) {
      setError("Generate a key pair first");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await signMessage(message);
      setSignature(result);
      setVerified(null);
    } catch (err) {
      setError("Signing failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!signature) {
      setError("Sign a message first");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await verifySignature(message, signature);
      setVerified(result);
    } catch (err) {
      setError("Verification failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 rounded-2xl bg-slate-950/80 p-4 text-slate-50 shadow-sm ring-1 ring-slate-800 md:flex-row md:p-5">
      {/* Left: controls */}
      <div className="flex flex-1 flex-col gap-4">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-slate-50">
            Public and private key lab
          </h3>
          <p className="mt-1 text-xs text-slate-300">
            Generate an RSA key pair and try encryption, decryption, signing and verification. All
            operations use the Web Crypto API in your browser.
          </p>
        </div>

        <div className="rounded-xl bg-slate-900/80 p-3 ring-1 ring-slate-800">
          <div className="mb-2 flex items-center gap-2">
            <Key size={16} className="text-sky-400" />
            <label className="text-xs font-medium text-slate-200">Key pair</label>
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full rounded-lg bg-sky-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-sky-700 disabled:opacity-50"
          >
            {hasKeyPair ? "Regenerate key pair" : "Generate key pair"}
          </button>
          {hasKeyPair && (
            <p className="mt-2 text-[0.7rem] text-emerald-300">Key pair generated successfully</p>
          )}
        </div>

        <div className="rounded-xl bg-slate-900/80 p-3 ring-1 ring-slate-800">
          <label className="mb-2 block text-xs font-medium text-slate-200">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-2 py-1.5 text-xs text-slate-50 placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
            placeholder="Enter message..."
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleEncrypt}
            disabled={loading || !hasKeyPair}
            className="flex items-center justify-center gap-2 rounded-lg bg-sky-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-sky-700 disabled:opacity-50"
          >
            <Lock size={14} />
            Encrypt
          </button>
          <button
            onClick={handleDecrypt}
            disabled={loading || !ciphertext}
            className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
          >
            <Unlock size={14} />
            Decrypt
          </button>
          <button
            onClick={handleSign}
            disabled={loading || !hasKeyPair}
            className="flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-purple-700 disabled:opacity-50"
          >
            <FileSignature size={14} />
            Sign
          </button>
          <button
            onClick={handleVerify}
            disabled={loading || !signature}
            className="flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-orange-700 disabled:opacity-50"
          >
            <CheckCircle size={14} />
            Verify
          </button>
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-2 text-xs text-red-300">
            {error}
          </div>
        )}
      </div>

      {/* Right: results */}
      <div className="flex w-full max-w-xs flex-col gap-4 md:max-w-sm">
        {ciphertext && (
          <div className="rounded-2xl bg-slate-900/80 p-4 ring-1 ring-slate-800">
            <div className="mb-2 flex items-center gap-2">
              <Lock size={18} className="text-sky-400" />
              <h4 className="text-xs font-semibold text-slate-100">Encrypted (ciphertext)</h4>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-950/80 p-2 font-mono text-[0.65rem] text-sky-300 break-all">
              {ciphertext.substring(0, 64)}...
            </div>
          </div>
        )}

        {decrypted && (
          <div className="rounded-2xl bg-slate-900/80 p-4 ring-1 ring-slate-800">
            <div className="mb-2 flex items-center gap-2">
              <Unlock size={18} className="text-emerald-400" />
              <h4 className="text-xs font-semibold text-slate-100">Decrypted message</h4>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-950/80 p-2 text-xs text-emerald-300">
              {decrypted}
            </div>
          </div>
        )}

        {signature && (
          <div className="rounded-2xl bg-slate-900/80 p-4 ring-1 ring-slate-800">
            <div className="mb-2 flex items-center gap-2">
              <FileSignature size={18} className="text-purple-400" />
              <h4 className="text-xs font-semibold text-slate-100">Signature</h4>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-950/80 p-2 font-mono text-[0.65rem] text-purple-300 break-all">
              {signature.substring(0, 64)}...
            </div>
            {verified !== null && (
              <div className={`mt-2 text-xs ${verified ? "text-emerald-300" : "text-red-300"}`}>
                {verified ? "✓ Signature verified" : "✗ Signature invalid"}
              </div>
            )}
          </div>
        )}

        <div className="rounded-2xl bg-slate-900/80 p-3 text-xs text-slate-200 ring-1 ring-slate-800">
          <p className="font-semibold text-sky-200">Key concepts</p>
          <p className="mt-1 text-[0.7rem] text-slate-300">
            Public keys encrypt and verify. Private keys decrypt and sign. The public key can be
            shared, but the private key must be kept secret. This asymmetry enables secure
            communication without pre sharing secrets.
          </p>
        </div>
      </div>
    </div>
  );
}

