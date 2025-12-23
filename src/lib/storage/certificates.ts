import fs from "node:fs";
import path from "node:path";

type PutParams = { key: string; bytes: Uint8Array; contentType: string };
type GetUrlParams = { key: string; expiresInSeconds: number };

const BLOB_BASE = "https://blob.vercel-storage.com";

function getLocalDir() {
  return path.join(process.cwd(), "prisma", "data", "certificates");
}

function requireKey(key: string) {
  const k = String(key || "").trim();
  if (!k || k.includes("..")) throw new Error("Invalid storage key");
  return k.replace(/^\//, "");
}

export async function putCertificatePdf(params: PutParams): Promise<{ key: string }> {
  const key = requireKey(params.key);
  const token = process.env.BLOB_READ_WRITE_TOKEN || "";

  if (token) {
    // Private upload to Vercel Blob via simple HTTP API.
    const url = `${BLOB_BASE}/${encodeURIComponent(key)}`;
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": params.contentType,
        // default access is private
      },
      body: params.bytes as any,
    });
    if (!res.ok) throw new Error("CERT_STORAGE_PUT_FAILED");
    return { key };
  }

  // Local dev fallback: store on disk.
  const dir = getLocalDir();
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, key), Buffer.from(params.bytes));
  return { key };
}

export async function getCertificatePdfUrl(params: GetUrlParams): Promise<{ url: string }> {
  const key = requireKey(params.key);
  const token = process.env.BLOB_READ_WRITE_TOKEN || "";

  if (token) {
    // We do not rely on signed URLs here; instead, download is mediated by our API endpoint.
    // Return a stable internal URL (expires is handled by our auth gate, not the blob).
    return { url: `/api/certificates/download?key=${encodeURIComponent(key)}` };
  }

  return { url: `/api/certificates/download?key=${encodeURIComponent(key)}` };
}

export async function getCertificatePdfBytes(params: { key: string }): Promise<Uint8Array> {
  const key = requireKey(params.key);
  const token = process.env.BLOB_READ_WRITE_TOKEN || "";

  if (token) {
    const url = `${BLOB_BASE}/${encodeURIComponent(key)}`;
    const res = await fetch(url, { headers: { authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error("CERT_STORAGE_GET_FAILED");
    const ab = await res.arrayBuffer();
    return new Uint8Array(ab);
  }

  const p = path.join(getLocalDir(), key);
  if (!fs.existsSync(p)) throw new Error("CERT_STORAGE_NOT_FOUND");
  return new Uint8Array(fs.readFileSync(p));
}


