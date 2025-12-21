import { readJsonFile, writeJsonFile } from "@/lib/storage/jsonFile";

export type UserPlanRecord = {
  userId: string;
  plan: "free" | "supporter" | "pro";
  source: "default" | "donation" | "manual" | "future";
  updatedAt: string;
};

export type ToolRunRecord = {
  id: string;
  userId?: string | null;
  anonymousUserId?: string | null;
  toolId: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
};

export type TemplateDownloadRecord = {
  id: string;
  userId?: string | null;
  anonymousUserId?: string | null;
  templateId: string;
  licenseChoice: "internal_use" | "commercial_use";
  signaturePolicyApplied: "kept" | "removed";
  timestamp: string;
  metadata?: Record<string, unknown>;
};

type BillingStore = {
  userPlans: UserPlanRecord[];
  toolRuns: ToolRunRecord[];
  templateDownloads: TemplateDownloadRecord[];
  donations: Array<{
    id: string;
    stripeEventId: string;
    stripeSessionId?: string | null;
    stripePaymentIntentId?: string | null;
    amount: number;
    currency: string;
    status: "paid" | "failed";
    userId?: string | null;
    createdAt: string;
  }>;
};

const STORE_PATH = process.env.BILLING_STORE_PATH || "data/billing-store.json";
const empty: BillingStore = { userPlans: [], toolRuns: [], templateDownloads: [], donations: [] };

function load() {
  return readJsonFile<BillingStore>(STORE_PATH, empty);
}

function save(store: BillingStore) {
  writeJsonFile(STORE_PATH, store);
}

export function upsertUserPlan(record: UserPlanRecord) {
  const s = load();
  s.userPlans = s.userPlans.filter((p) => p.userId !== record.userId);
  s.userPlans.push(record);
  save(s);
  return record;
}

export function getUserPlanRecord(userId: string) {
  const s = load();
  return s.userPlans.find((p) => p.userId === userId) || null;
}

export function addToolRun(record: ToolRunRecord) {
  const s = load();
  s.toolRuns.push({
    ...record,
    userId: record.userId || null,
    anonymousUserId: record.anonymousUserId || null,
  });
  save(s);
  return record;
}

export function listToolRuns(filters: { userId?: string | null; anonymousUserId?: string | null } = {}, limit = 50) {
  const s = load();
  return [...s.toolRuns]
    .filter((r) => (filters.userId ? r.userId === filters.userId : true))
    .filter((r) => (filters.anonymousUserId ? r.anonymousUserId === filters.anonymousUserId : true))
    .sort((a, b) => (b.timestamp || "").localeCompare(a.timestamp || ""))
    .slice(0, limit);
}

export function countToolRunsSince(filters: { userId?: string | null; anonymousUserId?: string | null }, sinceIso: string) {
  const s = load();
  return s.toolRuns.filter((r) => (filters.userId ? r.userId === filters.userId : true))
    .filter((r) => (filters.anonymousUserId ? r.anonymousUserId === filters.anonymousUserId : true))
    .filter((r) => (r.timestamp || "") >= sinceIso).length;
}

export function addTemplateDownload(record: TemplateDownloadRecord) {
  const s = load();
  s.templateDownloads.push({
    ...record,
    userId: record.userId || null,
    anonymousUserId: record.anonymousUserId || null,
  });
  save(s);
  return record;
}

export function listTemplateDownloads(filters: { userId?: string | null; anonymousUserId?: string | null } = {}, limit = 50) {
  const s = load();
  return [...s.templateDownloads]
    .filter((r) => (filters.userId ? r.userId === filters.userId : true))
    .filter((r) => (filters.anonymousUserId ? r.anonymousUserId === filters.anonymousUserId : true))
    .sort((a, b) => (b.timestamp || "").localeCompare(a.timestamp || ""))
    .slice(0, limit);
}

export function addDonation(record: BillingStore["donations"][number]) {
  const s = load();
  const exists = s.donations.some((d) => d.stripeEventId === record.stripeEventId);
  if (!exists) {
    s.donations.push({
      ...record,
      userId: record.userId || null,
      stripeSessionId: record.stripeSessionId || null,
      stripePaymentIntentId: record.stripePaymentIntentId || null,
    });
    save(s);
  }
  return record;
}

export function deleteUserBillingData(userId: string) {
  const s = load();
  s.userPlans = s.userPlans.filter((p) => p.userId !== userId);
  s.toolRuns = s.toolRuns.filter((r) => r.userId !== userId);
  s.templateDownloads = s.templateDownloads.filter((r) => r.userId !== userId);
  s.donations = s.donations.filter((d) => d.userId !== userId);
  save(s);
}


