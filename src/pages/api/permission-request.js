import { promises as fs } from "fs";
import path from "path";

const storagePath = path.join(process.cwd(), "data", "permission-requests.json");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { name, email, template, useCase, confirm } = req.body || {};
  if (!name || !email || !template || !useCase || !confirm) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  const token = `perm-${Date.now()}`;
  const record = {
    name,
    email,
    template,
    useCase,
    confirmed: Boolean(confirm),
    token,
    createdAt: new Date().toISOString(),
  };

  try {
    const raw = await fs.readFile(storagePath, "utf-8").catch(() => "[]");
    const existing = JSON.parse(raw);
    existing.push(record);
    await fs.writeFile(storagePath, JSON.stringify(existing, null, 2));
    res.status(200).json({ message: "Stored locally", token });
  } catch (error) {
    res.status(500).json({ message: "Could not store request", error: error.message, token });
  }
}
