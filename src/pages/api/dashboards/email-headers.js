import { assertAllowedRequest } from "@/lib/dashboard/allowlist";

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

  const { headers } = req.body;

  if (!headers || typeof headers !== "string") {
    return res.status(400).json({ error: "Email headers are required" });
  }

  try {
    const headerLines = headers.split("\n").filter((line) => line.trim());
    const parsedHeaders = {};

    // Parse headers into object
    headerLines.forEach((line) => {
      const colonIndex = line.indexOf(":");
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim().toLowerCase();
        const value = line.substring(colonIndex + 1).trim();
        if (!parsedHeaders[key]) {
          parsedHeaders[key] = [];
        }
        parsedHeaders[key].push(value);
      }
    });

    // Extract Received headers for hop timeline
    const hops = (parsedHeaders.received || []).map((received, index) => {
      // Simple parsing - extract server info
      const serverMatch = received.match(/from\s+([^\s]+)/i) || received.match(/by\s+([^\s]+)/i);
      return {
        server: serverMatch ? serverMatch[1] : `Hop ${index + 1}`,
        info: received.substring(0, 100), // Truncate for display
      };
    }).reverse(); // Reverse to show chronological order

    // Extract From and Return-Path
    const fromAddress = parsedHeaders.from?.[0] || "Unknown";
    const returnPath = parsedHeaders["return-path"]?.[0] || parsedHeaders["returnpath"]?.[0] || "Unknown";

    // Parse SPF, DKIM, DMARC results from Authentication-Results header
    const authResults = parsedHeaders["authentication-results"]?.[0] || "";
    let spf = { result: "Unknown", detail: "Not found in headers" };
    let dkim = { result: "Unknown", detail: "Not found in headers" };
    let dmarc = { result: "Unknown", policy: "Not found in headers" };

    if (authResults) {
      const spfMatch = authResults.match(/spf=([^\s;]+)/i);
      if (spfMatch) {
        spf.result = spfMatch[1];
        spf.detail = spfMatch[1] === "pass" ? "Sender IP is authorised" : "SPF check failed or not configured";
      }

      const dkimMatch = authResults.match(/dkim=([^\s;]+)/i);
      if (dkimMatch) {
        dkim.result = dkimMatch[1];
        dkim.detail = dkimMatch[1] === "pass" ? "Signature valid" : "DKIM signature invalid or missing";
      }

      const dmarcMatch = authResults.match(/dmarc=([^\s;]+)/i);
      if (dmarcMatch) {
        dmarc.result = dmarcMatch[1];
        const policyMatch = authResults.match(/policy\.([^=]+)=([^\s;]+)/i);
        if (policyMatch) {
          dmarc.policy = policyMatch[2];
        }
      }
    }

    // Generate summary
    let summary = "";
    if (spf.result === "pass" && dkim.result === "pass" && dmarc.result === "pass") {
      summary = "SPF, DKIM and DMARC all pass. This email appears to be authentic.";
    } else if (spf.result === "fail" || dkim.result === "fail" || dmarc.result === "fail") {
      summary = "One or more authentication checks failed. Treat this email with caution.";
    } else {
      summary = "Authentication results are incomplete or not present in headers. Verify sender through other means.";
    }

    if (fromAddress !== "Unknown" && returnPath !== "Unknown") {
      const fromDomain = fromAddress.match(/@([^\s>]+)/)?.[1];
      const returnDomain = returnPath.match(/@([^\s>]+)/)?.[1];
      if (fromDomain && returnDomain && fromDomain !== returnDomain) {
        summary += " Warning: From address and Return-Path use different domains.";
      }
    }

    return res.status(200).json({
      hops,
      spf,
      dkim,
      dmarc,
      fromAddress,
      returnPath,
      summary,
    });
  } catch (error) {
    console.error("Email header parsing error:", error);
    return res.status(500).json({
      error: "Failed to parse email headers. Please check the format and try again.",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

