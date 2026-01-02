import fs from "node:fs";
import path from "node:path";

const STORE_PATH =
  process.env.MENTOR_USAGE_PATH ||
  // Serverless platforms (Vercel) have a read-only filesystem; /tmp is writable.
  (process.env.VERCEL ? "/tmp/mentor-usage.json" : "data/mentor-usage.json");

type Usage = { total: number; lastReset: string };

function ensure() {
  const abs = path.isAbsolute(STORE_PATH) ? STORE_PATH : path.join(process.cwd(), STORE_PATH);
  const dir = path.dirname(abs);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(abs)) {
    fs.writeFileSync(abs, JSON.stringify({ total: 0, lastReset: new Date().toISOString() }, null, 2), "utf8");
  }
  return abs;
}

function readUsage(): Usage {
  const abs = ensure();
  try {
    return JSON.parse(fs.readFileSync(abs, "utf8"));
  } catch {
    return { total: 0, lastReset: new Date().toISOString() };
  }
}

function writeUsage(u: Usage) {
  const abs = ensure();
  fs.writeFileSync(abs, JSON.stringify(u, null, 2), "utf8");
}

export function incrementUsage() {
  const u = readUsage();
  u.total += 1;
  writeUsage(u);
}

export function getUsage() {
  return readUsage();
}

export function resetUsage() {
  writeUsage({ total: 0, lastReset: new Date().toISOString() });
}


