import { assertAllowedRequest } from "@/lib/dashboard/allowlist";
import dns from "dns";
import { promisify } from "util";

const resolve4 = promisify(dns.resolve4);
const resolve6 = promisify(dns.resolve6);
const resolveMx = promisify(dns.resolveMx);
const resolveTxt = promisify(dns.resolveTxt);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    assertAllowedRequest(req);
  } catch (err) {
    return res.status(403).json({ error: "Dashboard API origin not allowed" });
  }

  const { domain } = req.body;

  if (!domain || typeof domain !== "string") {
    return res.status(400).json({ error: "Domain is required" });
  }

  // Basic domain validation
  const trimmed = domain.trim().toLowerCase();
  if (!trimmed || !trimmed.includes(".") || trimmed.length > 253) {
    return res.status(400).json({ error: "Invalid domain format" });
  }

  // Remove protocol if present
  const cleanDomain = trimmed.replace(/^https?:\/\//, "").replace(/\/.*$/, "");

  try {
    // Resolve DNS records
    const [aRecords, aaaaRecords, mxRecords, txtRecords] = await Promise.allSettled([
      resolve4(cleanDomain).catch(() => []),
      resolve6(cleanDomain).catch(() => []),
      resolveMx(cleanDomain).catch(() => []),
      resolveTxt(cleanDomain).catch(() => []),
    ]);

    const a = aRecords.status === "fulfilled" ? aRecords.value : [];
    const aaaa = aaaaRecords.status === "fulfilled" ? aaaaRecords.value : [];
    const mx = mxRecords.status === "fulfilled" ? mxRecords.value.map((r) => `${r.priority} ${r.exchange}`) : [];
    const txt = txtRecords.status === "fulfilled" ? txtRecords.value.flat() : [];

    // Parse SPF record
    const spfRecord = txt.find((r) => r.startsWith("v=spf1"));
    let spf = { record: null, assessment: "Not found" };
    if (spfRecord) {
      spf.record = spfRecord.substring(0, 100); // Truncate for display
      if (spfRecord.includes("~all") || spfRecord.includes("-all")) {
        spf.assessment = "Present and configured";
      } else {
        spf.assessment = "Present but may be too permissive";
      }
    }

    // Parse DMARC record
    const dmarcRecord = txt.find((r) => r.startsWith("v=DMARC1"));
    let dmarc = { record: null, policy: "None" };
    if (dmarcRecord) {
      dmarc.record = dmarcRecord.substring(0, 100); // Truncate for display
      const policyMatch = dmarcRecord.match(/p=([^;]+)/i);
      if (policyMatch) {
        dmarc.policy = policyMatch[1].toUpperCase();
      }
    }

    // Generate summary
    let summary = "";
    if (!spf.record && !dmarc.record) {
      summary = "No SPF or DMARC records found. This domain is vulnerable to email spoofing.";
    } else if (!spf.record) {
      summary = "SPF record is missing. DMARC is present but may not be effective without SPF.";
    } else if (!dmarc.record) {
      summary = "SPF is configured, but DMARC is missing. Consider adding DMARC for better protection.";
    } else {
      summary = "Both SPF and DMARC records are present. Email security configuration looks good.";
    }

    return res.status(200).json({
      aRecords: a,
      aaaaRecords: aaaa,
      mxRecords: mx,
      spf,
      dmarc,
      summary,
    });
  } catch (error) {
    console.error("DNS lookup error:", error);
    return res.status(500).json({
      error: "Failed to retrieve DNS information. The domain may be invalid or unreachable.",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

