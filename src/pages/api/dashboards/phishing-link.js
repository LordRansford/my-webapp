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

  const { url } = req.body;

  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    let parsedUrl;
    try {
      parsedUrl = new URL(url.trim());
    } catch {
      // Try adding https:// if no protocol
      try {
        parsedUrl = new URL(`https://${url.trim()}`);
      } catch {
        return res.status(400).json({ error: "Invalid URL format" });
      }
    }

    const host = parsedUrl.hostname;
    const path = parsedUrl.pathname;
    const search = parsedUrl.search;

    // Normalize punycode (convert to Unicode for display)
    let normalisedHost = host;
    try {
      // Check if host contains punycode
      if (host.includes("xn--")) {
        normalisedHost = new URL(`https://${host}`).hostname;
      }
    } catch {
      // Keep original if normalization fails
    }

    // Check if IP address is used
    const usesIp = /^\d+\.\d+\.\d+\.\d+$/.test(host) || /^[0-9a-f:]+$/i.test(host);

    // Extract TLD
    const parts = host.split(".");
    const tld = parts.length > 1 ? parts[parts.length - 1] : "";

    // Detect suspicious keywords in path
    const suspiciousKeywords = ["login", "signin", "sign-in", "verify", "confirm", "update", "secure", "account", "password", "reset"];
    const pathLower = (path + search).toLowerCase();
    const foundKeywords = suspiciousKeywords.filter((keyword) => pathLower.includes(keyword));

    // Analyze domain structure for lookalike patterns
    const flags = [];
    const hostLower = host.toLowerCase();

    // Check for brand-like words on left side of longer domain
    const commonBrands = ["google", "microsoft", "apple", "amazon", "facebook", "paypal", "bank", "secure", "verify"];
    commonBrands.forEach((brand) => {
      if (hostLower.includes(brand) && host.length > brand.length + 10) {
        flags.push(`Brand-like word "${brand}" appears on the left of a longer domain.`);
      }
    });

    // Check for login keywords on unusual hosts
    if (foundKeywords.length > 0 && !hostLower.includes("login") && !hostLower.includes("signin")) {
      flags.push("Login related keyword appears on an unusual host.");
    }

    // Check for IP address usage
    if (usesIp) {
      flags.push("URL uses an IP address instead of a domain name.");
    }

    // Check for suspicious TLDs (common in phishing)
    const suspiciousTlds = ["tk", "ml", "ga", "cf", "gq"];
    if (suspiciousTlds.includes(tld.toLowerCase())) {
      flags.push("Domain uses a TLD commonly associated with free or suspicious domains.");
    }

    // Generate summary
    let summary = "";
    if (flags.length === 0) {
      summary = "No obvious phishing patterns detected from the URL text alone. Always verify through official channels.";
    } else if (flags.length <= 2) {
      summary = "This URL contains some suspicious patterns. Treat with caution and verify the sender through official channels.";
    } else {
      summary = "This URL contains multiple suspicious patterns. Do not enter credentials or personal information.";
    }

    return res.status(200).json({
      host,
      normalisedHost,
      usesIp,
      tld,
      path: path + search,
      keywords: foundKeywords,
      flags,
      summary,
    });
  } catch (error) {
    console.error("Phishing link analysis error:", error);
    return res.status(500).json({
      error: "Failed to analyze URL. Please check the format and try again.",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

