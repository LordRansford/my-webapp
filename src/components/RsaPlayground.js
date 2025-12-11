import { useMemo, useState } from "react";
import { Copy, LockKeyhole, RefreshCw } from "lucide-react";

const MODULUS_OPTIONS = [1024, 2048, 4096];

const bufferToPem = (label, buffer) => {
  const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
  const lines = base64.match(/.{1,64}/g)?.join("\n") || base64;
  return `-----BEGIN ${label} KEY-----\n${lines}\n-----END ${label} KEY-----`;
};

export default function RsaPlayground() {
  const [modulus, setModulus] = useState(2048);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [keys, setKeys] = useState({ publicKey: "", privateKey: "" });
  const [isBusy, setIsBusy] = useState(false);

  const supported = useMemo(() => Boolean(globalThis.crypto?.subtle), []);

  const generateKeys = async () => {
    if (!supported) {
      setError("Web Crypto API is unavailable in this browser.");
      return;
    }

    setIsBusy(true);
    setStatus("Generating fresh keys with RSA-OAEP...");
    setError("");

    try {
      const keyPair = await globalThis.crypto.subtle.generateKey(
        {
          name: "RSA-OAEP",
          modulusLength: modulus,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-256",
        },
        true,
        ["encrypt", "decrypt"],
      );

      const [publicKey, privateKey] = await Promise.all([
        globalThis.crypto.subtle.exportKey("spki", keyPair.publicKey),
        globalThis.crypto.subtle.exportKey("pkcs8", keyPair.privateKey),
      ]);

      setKeys({
        publicKey: bufferToPem("PUBLIC", publicKey),
        privateKey: bufferToPem("PRIVATE", privateKey),
      });
      setStatus("Keys ready — copy and store them securely.");
    } catch (err) {
      setError(`Unable to generate keys: ${err.message}`);
    } finally {
      setIsBusy(false);
    }
  };

  const copy = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      setStatus("Copied to clipboard");
    } catch (err) {
      setError(`Copy failed: ${err.message}`);
    }
  };

  return (
    <div className="panel">
      <div className="panel__header">
        <div className="chip">
          <LockKeyhole size={16} aria-hidden="true" />
          RSA-OAEP · SHA-256
        </div>
        <div className="control-row">
          <label className="control">
            Strength
            <select
              value={modulus}
              onChange={(event) => setModulus(Number(event.target.value))}
            >
              {MODULUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option} bits
                </option>
              ))}
            </select>
          </label>
          <button className="button primary" onClick={generateKeys} disabled={isBusy}>
            <RefreshCw size={16} aria-hidden="true" />
            {isBusy ? "Working..." : "Generate"}
          </button>
        </div>
      </div>

      {!supported && (
        <p className="muted">
          Your browser does not expose the SubtleCrypto API. Use a modern Chromium, Firefox, or Safari
          build to generate keys locally.
        </p>
      )}

      {status && <p className="status status--ok">{status}</p>}
      {error && <p className="status status--warn">{error}</p>}

      <div className="key-grid">
        <div className="key-card">
          <div className="key-card__header">
            <p className="eyebrow">Public key</p>
            <button className="pill" onClick={() => copy(keys.publicKey)} disabled={!keys.publicKey}>
              <Copy size={14} aria-hidden="true" />
              Copy
            </button>
          </div>
          <pre className="key-card__body" aria-live="polite">
            {keys.publicKey || "Generate to view the public key."}
          </pre>
        </div>

        <div className="key-card">
          <div className="key-card__header">
            <p className="eyebrow">Private key</p>
            <button className="pill" onClick={() => copy(keys.privateKey)} disabled={!keys.privateKey}>
              <Copy size={14} aria-hidden="true" />
              Copy
            </button>
          </div>
          <pre className="key-card__body" aria-live="polite">
            {keys.privateKey || "Private material stays in your browser."}
          </pre>
        </div>
      </div>
    </div>
  );
}
