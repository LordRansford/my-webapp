import cyber from "../../../../data/dashboards/cybersecurity.json";
import { assertAllowedRequest } from "@/lib/dashboard/allowlist";

export default function handler(req, res) {
  try {
    assertAllowedRequest(req);
  } catch (err) {
    return res.status(403).json({ error: "Dashboard API origin not allowed" });
  }

  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400");
  return res.status(200).json(cyber);
}
