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
    const chain = [];
    let currentUrl = parsedUrl.href;
    let redirectCount = 0;
    const maxRedirects = 10;

    // Follow redirects manually to track the chain
    while (redirectCount < maxRedirects) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(currentUrl, {
        method: "GET",
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; RansfordsNotes/1.0; Educational Tool)",
        },
        signal: controller.signal,
        redirect: "manual", // Don't follow redirects automatically
      });

      clearTimeout(timeoutId);

      const currentParsed = new URL(currentUrl);
      chain.push({
        url: currentUrl,
        scheme: currentParsed.protocol.replace(":", ""),
        status: response.status,
      });

      // Check if we should follow redirect
      if (response.status >= 300 && response.status < 400) {
        const location = response.headers.get("location");
        if (location) {
          try {
            const nextUrl = new URL(location, currentUrl);
            currentUrl = nextUrl.href;
            redirectCount++;
            continue;
          } catch {
            break; // Invalid redirect URL
          }
        } else {
          break; // No location header
        }
      } else {
        break; // Not a redirect
      }
    }

    // Analyze the chain
    const httpSteps = chain.filter((hop) => hop.scheme === "http");
    const httpsSteps = chain.filter((hop) => hop.scheme === "https");
    const finalScheme = chain.length > 0 ? chain[chain.length - 1].scheme : "unknown";

    let summary = "";
    if (httpSteps.length > 0 && finalScheme === "https") {
      summary = "Redirect chain includes HTTP steps before reaching HTTPS. This creates a security risk.";
    } else if (httpSteps.length > 0) {
      summary = "Warning: Redirect chain includes HTTP steps and does not end on HTTPS.";
    } else if (finalScheme === "https") {
      summary = "Clean redirect chain. All steps use HTTPS.";
    } else {
      summary = "Redirect chain analysis complete.";
    }

    return res.status(200).json({
      chain,
      summary,
    });
  } catch (error) {
    if (error.name === "AbortError") {
      return res.status(408).json({ error: "Request timeout. The site may be slow or unreachable." });
    }

    console.error("HTTPS redirect analysis error:", error);
    return res.status(500).json({
      error: "Failed to trace redirects. The site may be blocking requests or may be unreachable.",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

