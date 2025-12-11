export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const backendUrl = process.env.BACKEND_SCORES_URL;

  if (!backendUrl) {
    return res.status(501).json({ error: "Score backend not configured" });
  }

  try {
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Pass through auth if provided (e.g., Bearer token or cookie-based)
        Authorization: req.headers.authorization || "",
        cookie: req.headers.cookie || "",
      },
      body: JSON.stringify(req.body || {}),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return res.status(response.status).json(data || { error: "Score backend error" });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(502).json({ error: "Unable to reach score backend" });
  }
}
