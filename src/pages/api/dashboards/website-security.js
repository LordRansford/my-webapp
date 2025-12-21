import { assertAllowedRequest } from "@/lib/dashboard/allowlist";
import { validateOutboundUrl } from "@/lib/security/ssrf";

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

  let parsedUrl;
  try {
    parsedUrl = await validateOutboundUrl(url);
  } catch (err) {
    return res.status(400).json({ error: err.message || "Invalid URL" });
  }

  try {
    // Fetch the URL with a timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(parsedUrl.href, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; RansfordsNotes/1.0; Educational Tool)",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      signal: controller.signal,
      redirect: "manual",
    });

    clearTimeout(timeoutId);

    // Extract security headers
    const headers = {
      csp: response.headers.get("content-security-policy") || null,
      xFrameOptions: response.headers.get("x-frame-options") || null,
      referrerPolicy: response.headers.get("referrer-policy") || null,
      hsts: response.headers.get("strict-transport-security") || null,
    };

    // Determine scheme
    const scheme = parsedUrl.protocol.replace(":", "");

    // Extract redirect chain (if any)
    const redirects = [];
    let currentUrl = parsedUrl.href;
    let redirectCount = 0;
    const maxRedirects = 5;

    // Note: fetch follows redirects automatically, so we can't easily track them
    // For now, we'll just note if the final URL differs
    const finalUrl = response.url;
    if (finalUrl !== currentUrl) {
      redirects.push(currentUrl, finalUrl);
    }

    // Certificate info (limited - we can't get full cert details from fetch)
    const certificate = {
      issuer: null, // Not available via fetch API
      validFrom: null,
      validTo: null,
    };

    // TLS version (not directly available via fetch, but we can infer from HTTPS)
    const tlsVersion = scheme === "https" ? "TLS (version not available via fetch)" : null;

    // Generate summary
    const securityHeadersCount = Object.values(headers).filter((h) => h !== null).length;
    let summary = "";
    if (securityHeadersCount === 0) {
      summary = "No security headers detected. Consider adding Content Security Policy, HSTS, and X-Frame-Options.";
    } else if (securityHeadersCount < 3) {
      summary = `Only ${securityHeadersCount} security header(s) detected. Consider adding more security headers for better protection.`;
    } else {
      summary = "Good security header coverage detected.";
    }

    if (scheme === "http") {
      summary += " Warning: Site uses HTTP instead of HTTPS. All traffic is unencrypted.";
    }

    return res.status(200).json({
      scheme,
      tlsVersion,
      redirects: redirects.length > 0 ? redirects : [],
      certificate,
      headers,
      summary,
    });
  } catch (error) {
    if (error.name === "AbortError") {
      return res.status(408).json({ error: "Request timeout. The site may be slow or unreachable." });
    }

    if (error.code === "ENOTFOUND" || error.code === "ECONNREFUSED") {
      return res.status(404).json({ error: "Site not found or unreachable." });
    }

    console.error("Website security analysis error:", error);
    return res.status(500).json({ 
      error: "Failed to analyze website. The site may be blocking requests or may be unreachable.",
      details: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
}

