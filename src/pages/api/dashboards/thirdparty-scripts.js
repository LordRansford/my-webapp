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

  let parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch {
    return res.status(400).json({ error: "Invalid URL format" });
  }

  // Only allow HTTP/HTTPS
  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    return res.status(400).json({ error: "Only HTTP and HTTPS URLs are allowed" });
  }

  try {
    // Fetch the page HTML
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // Increased timeout

    let response;
    try {
      response = await fetch(parsedUrl.href, {
        method: "GET",
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
          "Accept-Encoding": "gzip, deflate, br",
        },
        signal: controller.signal,
        redirect: "follow",
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError.name === "AbortError") {
        throw new Error("Request timeout");
      }
      throw fetchError;
    }

    clearTimeout(timeoutId);

    if (!response.ok) {
      const statusText = response.statusText || "Unknown error";
      throw new Error(`HTTP ${response.status}: ${statusText}`);
    }

    const html = await response.text();
    
    if (!html || html.length === 0) {
      throw new Error("Received empty response from server");
    }
    const pageUrl = new URL(response.url);
    const pageOrigin = `${pageUrl.protocol}//${pageUrl.host}`;

    // Parse script tags using regex (simple approach for educational tool)
    const scriptTagRegex = /<script[^>]*>[\s\S]*?<\/script>/gi;
    const scriptSrcRegex = /<script[^>]+src=["']([^"']+)["'][^>]*>/gi;
    const integrityRegex = /integrity=["']([^"']+)["']/i;

    const scripts = [];
    let match;

    // Find all script tags with src attributes
    while ((match = scriptSrcRegex.exec(html)) !== null) {
      const src = match[1];
      let scriptUrl;
      try {
        scriptUrl = new URL(src, pageOrigin);
      } catch {
        continue; // Skip invalid URLs
      }

      const scriptOrigin = `${scriptUrl.protocol}//${scriptUrl.host}`;
      const isThirdParty = scriptOrigin !== pageOrigin;

      // Check for integrity attribute
      const scriptTag = match[0];
      const hasIntegrity = integrityRegex.test(scriptTag);

      scripts.push({
        src: scriptUrl.href,
        thirdParty: isThirdParty,
        hasIntegrity,
      });
    }

    // Generate summary
    const thirdPartyCount = scripts.filter((s) => s.thirdParty).length;
    const sriCount = scripts.filter((s) => s.hasIntegrity).length;
    let summary = `Page loads ${scripts.length} script${scripts.length !== 1 ? "s" : ""}`;
    if (thirdPartyCount > 0) {
      summary += `, ${thirdPartyCount} from third party domain${thirdPartyCount !== 1 ? "s" : ""}`;
    }
    if (sriCount === 0) {
      summary += ". None use Subresource Integrity.";
    } else {
      summary += `. ${sriCount} use Subresource Integrity.`;
    }

    return res.status(200).json({
      summary,
      scripts,
    });
  } catch (error) {
    if (error.name === "AbortError" || error.message === "Request timeout") {
      return res.status(408).json({ error: "Request timeout. The site may be slow or unreachable." });
    }

    console.error("Third party scripts analysis error:", error);
    
    // Provide more specific error messages
    let errorMessage = "Failed to analyze page scripts.";
    if (error.message.includes("HTTP")) {
      errorMessage = `The site returned an error: ${error.message}. The site may require authentication or may be blocking automated requests.`;
    } else if (error.message.includes("timeout")) {
      errorMessage = "Request timed out. The site may be slow or unreachable.";
    } else if (error.message.includes("fetch")) {
      errorMessage = "Could not connect to the site. Please check the URL and try again.";
    } else {
      errorMessage = error.message || errorMessage;
    }

    return res.status(500).json({
      error: errorMessage,
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

