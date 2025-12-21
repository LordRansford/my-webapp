import net from "net";
import dns from "dns";

function isPrivateIp(ip: string) {
  if (net.isIP(ip) === 0) return true;
  if (ip === "127.0.0.1" || ip === "::1") return true;
  if (ip.startsWith("10.")) return true;
  if (ip.startsWith("192.168.")) return true;
  const parts = ip.split(".").map((n) => Number(n));
  if (parts.length === 4 && parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
  if (parts.length === 4 && parts[0] === 169 && parts[1] === 254) return true;
  return false;
}

export async function validateOutboundUrl(input: string) {
  let url: URL;
  try {
    url = new URL(input);
  } catch {
    throw new Error("Invalid URL");
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Only HTTP and HTTPS URLs are allowed");
  }

  const host = url.hostname;
  if (!host) throw new Error("Invalid host");
  if (host === "localhost") throw new Error("Localhost is not allowed");

  // Resolve DNS and block private ranges.
  const addrs = await dns.promises.lookup(host, { all: true }).catch(() => []);
  if (!addrs.length) throw new Error("Unable to resolve host");
  for (const a of addrs) {
    if (isPrivateIp(a.address)) throw new Error("Private network targets are not allowed");
  }

  return url;
}


