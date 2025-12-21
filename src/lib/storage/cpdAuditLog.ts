import { promises as fs } from "fs";
import path from "path";

import type { AuditLogEntry } from "@/lib/cpd/audit-log";

const auditLogPath = path.join(process.cwd(), "data", "cpd-audit-log.json");

async function ensureFile() {
  await fs.mkdir(path.dirname(auditLogPath), { recursive: true });
  try {
    await fs.access(auditLogPath);
  } catch {
    await fs.writeFile(auditLogPath, "[]", "utf-8");
  }
}

export async function readCpdAuditLog(): Promise<AuditLogEntry[]> {
  await ensureFile();
  try {
    const raw = await fs.readFile(auditLogPath, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as AuditLogEntry[]) : [];
  } catch {
    return [];
  }
}

export async function writeCpdAuditLog(entries: AuditLogEntry[]): Promise<void> {
  await ensureFile();
  await fs.writeFile(auditLogPath, JSON.stringify(entries, null, 2));
}


