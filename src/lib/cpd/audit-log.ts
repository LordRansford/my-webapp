import crypto from "crypto";
import { readCpdAuditLog, writeCpdAuditLog } from "@/lib/storage/cpdAuditLog";

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

const readLog = async (): Promise<AuditLogEntry[]> => readCpdAuditLog();
const writeLog = async (entries: AuditLogEntry[]) => writeCpdAuditLog(entries);

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
