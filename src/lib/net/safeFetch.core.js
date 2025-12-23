import dns from "node:dns/promises";

export class SafeFetchBlockedError extends Error {
  code = "SAFE_FETCH_BLOCKED";
  constructor(message) {
    super(message);
  }
}

export class SafeFetchTimeoutError extends Error {
  code = "SAFE_FETCH_TIMEOUT";
  constructor(message) {
    super(message);
  }
}

const METADATA_IPS = new Set(["169.254.169.254"]);

function isPrivateIpv4(ip) {
  const m = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/.exec(ip);
  if (!m) return false;
  const a = Number(m[1]);
  const b = Number(m[2]);
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 0) return true;
  if (a === 169 && b === 254) return true;
  if (a === 192 && b === 168) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;
  return false;
}

function isLocalhostHost(host) {
  const h = host.toLowerCase();
  if (h === "localhost") return true;
  if (h === "127.0.0.1") return true;
  if (h === "::1") return true;
  if (h.endsWith(".localhost")) return true;
  return false;
}

async function assertHostAllowed(url, allowLocalhostInDev) {
  const isProd = process.env.NODE_ENV === "production";
  if (isLocalhostHost(url.hostname) && !(allowLocalhostInDev && !isProd)) {
    throw new SafeFetchBlockedError("Blocked host");
  }
  if (METADATA_IPS.has(url.hostname)) throw new SafeFetchBlockedError("Blocked host");
  if (isPrivateIpv4(url.hostname)) throw new SafeFetchBlockedError("Blocked IP range");

  try {
    const lookups = await dns.lookup(url.hostname, { all: true, verbatim: true });
    for (const rec of lookups) {
      if (typeof rec?.address === "string") {
        if (METADATA_IPS.has(rec.address)) throw new SafeFetchBlockedError("Blocked IP range");
        if (isPrivateIpv4(rec.address)) throw new SafeFetchBlockedError("Blocked IP range");
      }
    }
  } catch {
    throw new SafeFetchBlockedError("Unable to resolve host");
  }
}

async function readResponseLimited(res, maxBytes) {
  const reader = res.body?.getReader?.();
  if (!reader) {
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.byteLength > maxBytes) throw new SafeFetchBlockedError("Response too large");
    return buf;
  }

  const chunks = [];
  let total = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      total += value.byteLength;
      if (total > maxBytes) throw new SafeFetchBlockedError("Response too large");
      chunks.push(value);
    }
  }
  return Buffer.concat(chunks.map((c) => Buffer.from(c)));
}

export async function safeFetch(inputUrl, init) {
  const url = new URL(inputUrl);
  const isProd = process.env.NODE_ENV === "production";

  if (url.protocol !== "https:" && !(init.allowHttpInDev && !isProd && url.protocol === "http:")) {
    throw new SafeFetchBlockedError("Blocked protocol");
  }

  await assertHostAllowed(url, Boolean(init.allowLocalhostInDev));

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), Math.max(1, init.overallTimeoutMs));

  try {
    const res = await fetch(url.toString(), { ...init, redirect: "manual", signal: controller.signal });
    const buf = await readResponseLimited(res, init.maxResponseBytes);
    return { res, body: buf };
  } catch (err) {
    if (err?.name === "AbortError") throw new SafeFetchTimeoutError("Request timed out");
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}


