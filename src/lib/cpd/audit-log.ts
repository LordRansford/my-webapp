import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

export type AuditEventType = "course_version_change" | "template_update" | "assessment_rule_change" | "certificate_logic_change";

export type AuditLogEntry = {
  id: string;
  eventType: AuditEventType;
  entityId: string;
  entityType: "course" | "template" | "assessment" | "certificate";
  previousVersion?: string;
  newVersion: string;
  changedBy: "system" | "admin";
  timestamp: string;
  notes?: string;
};

const auditLogPath = path.join(process.cwd(), "data", "cpd-audit-log.json");

const ensureFile = async () => {
  await fs.mkdir(path.dirname(auditLogPath), { recursive: true });
  try {
    await fs.access(auditLogPath);
  } catch {
    await fs.writeFile(auditLogPath, "[]", "utf-8");
  }
};

const readLog = async (): Promise<AuditLogEntry[]> => {
  await ensureFile();
  try {
    const raw = await fs.readFile(auditLogPath, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeLog = async (entries: AuditLogEntry[]) => {
  await ensureFile();
  await fs.writeFile(auditLogPath, JSON.stringify(entries, null, 2));
};

export async function recordAuditEvent(event: Omit<AuditLogEntry, "id" | "timestamp">): Promise<AuditLogEntry> {
  const entries = await readLog();
  const entry: AuditLogEntry = {
    ...event,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  };
  entries.push(entry);
  await writeLog(entries.slice(-500));
  return entry;
}

export async function getAuditLog(entityId?: string, eventType?: AuditEventType): Promise<AuditLogEntry[]> {
  const entries = await readLog();
  let filtered = entries;
  if (entityId) filtered = filtered.filter((e) => e.entityId === entityId);
  if (eventType) filtered = filtered.filter((e) => e.eventType === eventType);
  return filtered.sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
}
