"use client";

import React, { useState } from "react";
import { Lock, Unlock, Key } from "lucide-react";

async function deriveKey(passphrase, salt) {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(passphrase),
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"]
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encoder.encode(salt),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

async function encryptMessage(message, key) {
  const encoder = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoder.encode(message)
  );
  return {
    ciphertext: Array.from(new Uint8Array(encrypted))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(""),
    iv: Array.from(iv)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(""),
  };
}

async function decryptMessage(ciphertext, iv, key) {
  const cipherArray = new Uint8Array(
    ciphertext.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
  );
  const ivArray = new Uint8Array(iv.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: ivArray },
    key,
    cipherArray
  );
  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}

export default function SymmetricCryptoLabDashboard() {
  const [message, setMessage] = useState("Hello, world!");
  const [passphrase, setPassphrase] = useState("mySecretKey");
  const [ciphertext, setCiphertext] = useState("");
  const [iv, setIv] = useState("");
  const [decrypted, setDecrypted] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEncrypt = async () => {
    if (!message || !passphrase) {
      setError("Please enter both message and passphrase");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const salt = "educational-salt";
      const key = await deriveKey(passphrase, salt);
      const result = await encryptMessage(message, key);
      setCiphertext(result.ciphertext);
      setIv(result.iv);
      setDecrypted("");
    } catch (err) {
      setError("Encryption failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDecrypt = async () => {
    if (!ciphertext || !iv || !passphrase) {
      setError("Please encrypt a message first");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const salt = "educational-salt";
      const key = await deriveKey(passphrase, salt);
      const result = await decryptMessage(ciphertext, iv, key);
      setDecrypted(result);
    } catch (err) {
      setError("Decryption failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 rounded-2xl bg-slate-950/80 p-4 text-slate-50 shadow-sm ring-1 ring-slate-800 md:flex-row md:p-5">
      {/* Left: inputs */}
      <div className="flex flex-1 flex-col gap-4">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-slate-50">
            Symmetric encryption lab
          </h3>
          <p className="mt-1 text-xs text-slate-300">
            Encrypt and decrypt messages using AES-GCM with a shared key. All operations happen in
            your browser using the Web Crypto API.
          </p>
        </div>

        <div className="rounded-xl bg-slate-900/80 p-3 ring-1 ring-slate-800">
          <label className="mb-2 block text-xs font-medium text-slate-200">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-2 py-1.5 text-xs text-slate-50 placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
            placeholder="Enter message to encrypt..."
          />
        </div>

        <div className="rounded-xl bg-slate-900/80 p-3 ring-1 ring-slate-800">
          <div className="mb-2 flex items-center gap-2">
            <Key size={16} className="text-sky-400" />
            <label className="text-xs font-medium text-slate-200">Passphrase (shared key)</label>
          </div>
          <input
            type="text"
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-2 py-1.5 text-xs text-slate-50 placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
            placeholder="Enter passphrase..."
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleEncrypt}
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-sky-700 disabled:opacity-50"
          >
            <Lock size={14} />
            Encrypt
          </button>
          <button
            onClick={handleDecrypt}
            disabled={loading || !ciphertext}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
          >
            <Unlock size={14} />
            Decrypt
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
            <div className="mb-3 flex items-center gap-2">
              <Lock size={18} className="text-sky-400" />
              <h4 className="text-xs font-semibold text-slate-100">Ciphertext</h4>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-950/80 p-2 font-mono text-[0.65rem] text-sky-300 break-all">
              {ciphertext}
            </div>
            <div className="mt-2 text-[0.7rem] text-slate-400">
              IV: <span className="font-mono text-slate-300">{iv.substring(0, 24)}...</span>
            </div>
          </div>
        )}

        {decrypted && (
          <div className="rounded-2xl bg-slate-900/80 p-4 ring-1 ring-slate-800">
            <div className="mb-3 flex items-center gap-2">
              <Unlock size={18} className="text-emerald-400" />
              <h4 className="text-xs font-semibold text-slate-100">Decrypted message</h4>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-950/80 p-2 text-xs text-emerald-300">
              {decrypted}
            </div>
            <p className="mt-2 text-[0.7rem] text-slate-400">
              The same key successfully decrypted the message, confirming symmetric encryption works.
            </p>
          </div>
        )}

        <div className="rounded-2xl bg-slate-900/80 p-3 text-xs text-slate-200 ring-1 ring-slate-800">
          <p className="font-semibold text-sky-200">How it works</p>
          <p className="mt-1 text-[0.7rem] text-slate-300">
            AES-GCM (Advanced Encryption Standard with Galois/Counter Mode) provides both
            confidentiality and authenticity. The passphrase is converted to a key using PBKDF2, and
            a random IV (initialization vector) ensures the same message encrypts differently each time.
          </p>
        </div>
      </div>
    </div>
  );
}

