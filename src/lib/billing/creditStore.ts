/**
 * Credit Balance Store
 * 
 * Manages user credit balances, purchases, and consumption.
 * Uses Prisma if available, falls back to file-based storage.
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";
import { logCreditEvent } from "@/lib/audit/creditAudit";

const CREDITS_FILE = path.join(process.cwd(), "data", "credits.json");

// Note: This module integrates with the existing Prisma credit store
// (src/lib/credits/store.ts) when available, falling back to file-based storage

interface CreditTransaction {
  id: string;
  userId: string;
  type: "purchase" | "consumption" | "refund" | "monthly_allocation";
  amount: number; // Positive for purchase/allocation, negative for consumption
  toolId?: string;
  runId?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

interface UserCredits {
  userId: string;
  balance: number;
  monthlyAllocation: number;
  dailyCap: number;
  transactions: CreditTransaction[];
  lastUpdated: string;
}

interface CreditsStore {
  users: Record<string, UserCredits>;
}

function loadStore(): CreditsStore {
  try {
    if (fs.existsSync(CREDITS_FILE)) {
      const content = fs.readFileSync(CREDITS_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (error) {
    console.error("Failed to load credits store:", error);
  }
  return { users: {} };
}

function saveStore(store: CreditsStore): void {
  try {
    // Ensure directory exists
    const dir = path.dirname(CREDITS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CREDITS_FILE, JSON.stringify(store, null, 2));
  } catch (error) {
    console.error("Failed to save credits store:", error);
    throw error;
  }
}

/**
 * Get user's credit balance
 */
export async function getCreditBalance(userId: string): Promise<number> {
  // Try existing Prisma store first
  try {
    const { getOrCreateCredits } = await import("@/lib/credits/store");
    const credits = await getOrCreateCredits(userId);
    return credits.balance ?? 0;
  } catch (error) {
    // Prisma not available, fallback to file-based
    const store = loadStore();
    const user = store.users[userId];
    return user?.balance ?? 0;
  }
}

/**
 * Get user's credit account (full details)
 */
export function getUserCredits(userId: string): UserCredits | null {
  const store = loadStore();
  return store.users[userId] || null;
}

/**
 * Initialize user credits (first time)
 */
function initializeUserCredits(userId: string, monthlyAllocation: number, dailyCap: number): UserCredits {
  return {
    userId,
    balance: monthlyAllocation, // Start with monthly allocation
    monthlyAllocation,
    dailyCap,
    transactions: [
      {
        id: crypto.randomUUID(),
        userId,
        type: "monthly_allocation",
        amount: monthlyAllocation,
        timestamp: new Date().toISOString(),
      },
    ],
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Add credits (purchase or monthly allocation)
 */
export function addCredits(
  userId: string,
  amount: number,
  type: "purchase" | "monthly_allocation" = "purchase",
  metadata?: Record<string, unknown>
): { success: boolean; newBalance: number; transactionId: string } {
  const store = loadStore();
  let user = store.users[userId];

  if (!user) {
    // Initialize with default values (will be updated by plan)
    user = initializeUserCredits(userId, 0, 0);
    store.users[userId] = user;
  }

  const transaction: CreditTransaction = {
    id: crypto.randomUUID(),
    userId,
    type,
    amount,
    timestamp: new Date().toISOString(),
    metadata,
  };

  user.balance += amount;
  user.transactions.push(transaction);
  user.lastUpdated = new Date().toISOString();

  // Keep only last 1000 transactions per user
  if (user.transactions.length > 1000) {
    user.transactions = user.transactions.slice(-1000);
  }

  saveStore(store);

  // Audit log
  logCreditEvent({
    type: type === "purchase" ? "credit_granted" : "credit_granted",
    userId,
    credits: amount,
    balance: user.balance,
    metadata: { type, ...metadata },
  });

  return {
    success: true,
    newBalance: user.balance,
    transactionId: transaction.id,
  };
}

/**
 * Consume credits (tool execution)
 */
export async function consumeCredits(
  userId: string,
  amount: number,
  toolId: string,
  runId?: string,
  metadata?: Record<string, unknown>
): Promise<{ success: boolean; newBalance: number; transactionId: string }> {
  // Try existing Prisma store first
  try {
    const { getOrCreateCredits, createCreditUsageEvent } = await import("@/lib/credits/store");
    const { prisma } = await import("@/lib/db/prisma");
    
    const credits = await getOrCreateCredits(userId);
    
    if (credits.balance < amount) {
      throw new Error("Insufficient credits");
    }

    const newBalance = credits.balance - amount;
    await prisma.credits.update({
      where: { userId },
      data: { balance: newBalance },
    });

    await createCreditUsageEvent({
      userId,
      toolId,
      consumed: amount,
      units: 1,
      freeUnits: 0,
      paidUnits: amount,
      runId: runId || null,
      actualCredits: amount,
      estimatedCredits: metadata && typeof metadata === "object" && "estimated" in metadata ? (metadata.estimated as number) : undefined,
      durationMs: metadata && typeof metadata === "object" && "usage" in metadata && metadata.usage && typeof metadata.usage === "object" && "durationMs" in metadata.usage ? (metadata.usage.durationMs as number) : undefined,
    });

    return {
      success: true,
      newBalance,
      transactionId: runId || crypto.randomUUID(),
    };
  } catch (error) {
    // Prisma not available or error, fallback to file-based
    console.warn("Prisma credit consumption failed, using file-based:", error);
  }

  // Fallback to file-based
  const store = loadStore();
  let user = store.users[userId];

  if (!user) {
    throw new Error("User credits not initialized");
  }

  if (user.balance < amount) {
    throw new Error("Insufficient credits");
  }

  const transaction: CreditTransaction = {
    id: crypto.randomUUID(),
    userId,
    type: "consumption",
    amount: -amount,
    toolId,
    runId,
    timestamp: new Date().toISOString(),
    metadata,
  };

      user.balance -= amount;
      user.transactions.push(transaction);
      user.lastUpdated = new Date().toISOString();

      saveStore(store);

      // Audit log
      logCreditEvent({
        type: "credit_charged",
        userId,
        toolId,
        runId,
        credits: amount,
        balance: user.balance,
        metadata,
      });

      return {
        success: true,
        newBalance: user.balance,
        transactionId: transaction.id,
      };
}

/**
 * Refund credits (platform error)
 */
export function refundCredits(
  userId: string,
  amount: number,
  originalTransactionId: string,
  reason: string,
  metadata?: Record<string, unknown>
): { success: boolean; newBalance: number; transactionId: string } {
  const store = loadStore();
  const user = store.users[userId];

  if (!user) {
    throw new Error("User credits not initialized");
  }

  const transaction: CreditTransaction = {
    id: crypto.randomUUID(),
    userId,
    type: "refund",
    amount,
    timestamp: new Date().toISOString(),
    metadata: {
      ...metadata,
      originalTransactionId,
      reason,
    },
  };

  user.balance += amount;
  user.transactions.push(transaction);
  user.lastUpdated = new Date().toISOString();

  saveStore(store);

  return {
    success: true,
    newBalance: user.balance,
    transactionId: transaction.id,
  };
}

/**
 * Get daily credits consumed today
 */
export async function getDailyCreditsConsumed(userId: string): Promise<number> {
  // Try existing Prisma store first
  try {
    const { prisma } = await import("@/lib/db/prisma");
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const events = await prisma.creditUsageEvent.findMany({
      where: {
        userId,
        occurredAt: { gte: today },
      },
      select: { consumed: true },
    });

    return events.reduce((sum, e) => sum + (e.consumed || 0), 0);
  } catch (error) {
    // Prisma not available, fallback to file-based
    console.warn("Prisma daily credits query failed, using file-based:", error);
  }

  // Fallback to file-based
  const store = loadStore();
  const user = store.users[userId];
  if (!user) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayISO = today.toISOString();

  return user.transactions
    .filter((t) => {
      const txDate = new Date(t.timestamp);
      return txDate >= today && t.type === "consumption" && t.amount < 0;
    })
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
}

/**
 * Get monthly credits consumed this month
 */
export async function getMonthlyCreditsConsumed(userId: string): Promise<number> {
  // Try existing Prisma store first
  try {
    const { prisma } = await import("@/lib/db/prisma");
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const events = await prisma.creditUsageEvent.findMany({
      where: {
        userId,
        occurredAt: { gte: monthStart },
      },
      select: { consumed: true },
    });

    return events.reduce((sum, e) => sum + (e.consumed || 0), 0);
  } catch (error) {
    // Prisma not available, fallback to file-based
    console.warn("Prisma monthly credits query failed, using file-based:", error);
  }

  // Fallback to file-based
  const store = loadStore();
  const user = store.users[userId];
  if (!user) return 0;

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  return user.transactions
    .filter((t) => {
      const txDate = new Date(t.timestamp);
      return txDate >= monthStart && t.type === "consumption" && t.amount < 0;
    })
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
}

/**
 * Update user's plan limits (monthly allocation, daily cap)
 */
export function updateUserPlanLimits(
  userId: string,
  monthlyAllocation: number,
  dailyCap: number
): void {
  const store = loadStore();
  let user = store.users[userId];

  if (!user) {
    user = initializeUserCredits(userId, monthlyAllocation, dailyCap);
    store.users[userId] = user;
  } else {
    // If monthly allocation increased, add the difference to balance
    const allocationDiff = monthlyAllocation - user.monthlyAllocation;
    if (allocationDiff > 0) {
      addCredits(userId, allocationDiff, "monthly_allocation", {
        reason: "Plan upgrade",
      });
    }

    user.monthlyAllocation = monthlyAllocation;
    user.dailyCap = dailyCap;
    user.lastUpdated = new Date().toISOString();
  }

  saveStore(store);
}

/**
 * Get credit transaction history
 */
export function getTransactionHistory(
  userId: string,
  limit: number = 100
): CreditTransaction[] {
  const store = loadStore();
  const user = store.users[userId];
  if (!user) return [];

  return user.transactions
    .slice(-limit)
    .reverse(); // Most recent first
}
