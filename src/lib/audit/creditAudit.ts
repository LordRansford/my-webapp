/**
 * Credit System Audit Logging
 * 
 * Logs all credit-related events for compliance and monitoring.
 */

import fs from "fs";
import path from "path";

const AUDIT_LOG_DIR = path.join(process.cwd(), "data", "audit");
const CREDIT_AUDIT_LOG = path.join(AUDIT_LOG_DIR, "credits.jsonl");

// Ensure audit log directory exists
function ensureAuditLogDir() {
  if (!fs.existsSync(AUDIT_LOG_DIR)) {
    fs.mkdirSync(AUDIT_LOG_DIR, { recursive: true });
  }
}

export type CreditAuditEventType =
  | "credit_estimate_requested"
  | "credit_charged"
  | "credit_refunded"
  | "credit_granted"
  | "credit_purchase_initiated"
  | "credit_purchase_completed"
  | "credit_purchase_failed"
  | "spend_limit_exceeded"
  | "insufficient_credits"
  | "tool_execution_blocked"
  | "tool_execution_allowed"
  | "tool_execution_completed"
  | "tool_execution_failed";

export interface CreditAuditEvent {
  id: string;
  timestamp: string;
  type: CreditAuditEventType;
  userId: string | null;
  toolId?: string;
  runId?: string;
  credits?: number;
  balance?: number;
  metadata?: Record<string, unknown>;
  ip?: string | null;
  userAgent?: string | null;
}

/**
 * Log a credit audit event
 */
export function logCreditEvent(event: Omit<CreditAuditEvent, "id" | "timestamp">): void {
  try {
    ensureAuditLogDir();

    const auditEvent: CreditAuditEvent = {
      ...event,
      id: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
      timestamp: new Date().toISOString(),
    };

    // Append to JSONL file
    const line = JSON.stringify(auditEvent) + "\n";
    fs.appendFileSync(CREDIT_AUDIT_LOG, line, "utf-8");
  } catch (error) {
    // Don't throw - audit logging should never break the application
    console.error("Failed to log credit audit event:", error);
  }
}

/**
 * Read audit log entries (for admin viewing)
 */
export function readCreditAuditLog(
  filters?: {
    userId?: string;
    type?: CreditAuditEventType;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }
): CreditAuditEvent[] {
  try {
    if (!fs.existsSync(CREDIT_AUDIT_LOG)) {
      return [];
    }

    const content = fs.readFileSync(CREDIT_AUDIT_LOG, "utf-8");
    const lines = content.trim().split("\n").filter(Boolean);
    const events: CreditAuditEvent[] = lines.map((line) => JSON.parse(line));

    // Apply filters
    let filtered = events;

    if (filters?.userId) {
      filtered = filtered.filter((e) => e.userId === filters.userId);
    }

    if (filters?.type) {
      filtered = filtered.filter((e) => e.type === filters.type);
    }

    if (filters?.startDate) {
      filtered = filtered.filter((e) => new Date(e.timestamp) >= filters.startDate!);
    }

    if (filters?.endDate) {
      filtered = filtered.filter((e) => new Date(e.timestamp) <= filters.endDate!);
    }

    // Sort by timestamp (newest first)
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Apply limit
    if (filters?.limit) {
      filtered = filtered.slice(0, filters.limit);
    }

    return filtered;
  } catch (error) {
    console.error("Failed to read credit audit log:", error);
    return [];
  }
}

/**
 * Get audit statistics
 */
export function getCreditAuditStats(userId?: string): {
  totalEvents: number;
  totalCreditsCharged: number;
  totalCreditsGranted: number;
  totalCreditsRefunded: number;
  toolExecutions: number;
  blockedExecutions: number;
} {
  try {
    const events = readCreditAuditLog({ userId });

    let totalCreditsCharged = 0;
    let totalCreditsGranted = 0;
    let totalCreditsRefunded = 0;
    let toolExecutions = 0;
    let blockedExecutions = 0;

    events.forEach((event) => {
      if (event.credits) {
        if (event.type === "credit_charged") {
          totalCreditsCharged += event.credits;
        } else if (event.type === "credit_granted" || event.type === "credit_purchase_completed") {
          totalCreditsGranted += event.credits;
        } else if (event.type === "credit_refunded") {
          totalCreditsRefunded += event.credits;
        }
      }

      if (event.type === "tool_execution_completed" || event.type === "tool_execution_allowed") {
        toolExecutions++;
      }

      if (event.type === "tool_execution_blocked" || event.type === "spend_limit_exceeded" || event.type === "insufficient_credits") {
        blockedExecutions++;
      }
    });

    return {
      totalEvents: events.length,
      totalCreditsCharged,
      totalCreditsGranted,
      totalCreditsRefunded,
      toolExecutions,
      blockedExecutions,
    };
  } catch (error) {
    console.error("Failed to get credit audit stats:", error);
    return {
      totalEvents: 0,
      totalCreditsCharged: 0,
      totalCreditsGranted: 0,
      totalCreditsRefunded: 0,
      toolExecutions: 0,
      blockedExecutions: 0,
    };
  }
}
