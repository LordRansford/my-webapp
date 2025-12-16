import ai from "../../../../data/dashboards/ai.json";
import { assertAllowedRequest } from "@/lib/dashboard/allowlist";

export default function handler(req, res) {
  try {
    assertAllowedRequest(req);
  } catch (e) {
    res.status(403).json({ error: "Not allowed" });
    return;
  }

  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400");
  res.status(200).json(ai);
}
