import { readJsonFile, writeJsonFile } from "@/lib/storage/jsonFile";

const TEMPLATE_STORE_PATH = process.env.TEMPLATE_STORE_PATH || "data/templates-store.json";

export type PermissionScope = "commercial_remove_signature";

export type PermissionToken = {
  tokenId: string;
  userId?: string | null;
  anonymousUserId?: string | null;
  templateId?: string | null;
  scope: PermissionScope;
  issuedAt: string;
  expiresAt?: string | null;
  issuedBy: string;
  notes?: string | null;
};

export type DownloadRecord = {
  downloadId: string;
  templateId: string;
  fileVariantId?: string | null;
  userId?: string | null;
  anonymousUserId?: string | null;
  requestedUse: string;
  supportMethod: string;
  donationId?: string | null;
  permissionTokenId?: string | null;
  issuedAt: string;
  signaturePolicyApplied: "kept" | "removed";
};

export type DonationRecord = {
  donationId: string;
  userId?: string | null;
  anonymousUserId?: string | null;
  amount: number;
  currency: string;
  status: string;
  donatedAt: string;
};

type TemplateStore = {
  permissionTokens: PermissionToken[];
  downloads: DownloadRecord[];
  donations: DonationRecord[];
};

const empty: TemplateStore = { permissionTokens: [], downloads: [], donations: [] };

function load() {
  return readJsonFile<TemplateStore>(TEMPLATE_STORE_PATH, empty);
}

function save(store: TemplateStore) {
  writeJsonFile(TEMPLATE_STORE_PATH, store);
}

export function savePermissionToken(token: PermissionToken) {
  const s = load();
  const normalized = {
    ...token,
    userId: token.userId || null,
    anonymousUserId: token.anonymousUserId || null,
    templateId: token.templateId || null,
    expiresAt: token.expiresAt || null,
    notes: token.notes || null,
  };
  s.permissionTokens = s.permissionTokens.filter((t) => t.tokenId !== token.tokenId);
  s.permissionTokens.push(normalized);
  save(s);
}

export function getActivePermissionTokens(params: { userId?: string | null; anonymousUserId?: string | null; templateId?: string | null }) {
  const { userId, anonymousUserId, templateId } = params;
  const nowIso = new Date().toISOString();
  const s = load();
  return s.permissionTokens
    .filter((t) => (t.userId && t.userId === (userId || null)) || (t.anonymousUserId && t.anonymousUserId === (anonymousUserId || null)))
    .filter((t) => !t.templateId || t.templateId === (templateId || null))
    .filter((t) => !t.expiresAt || t.expiresAt > nowIso);
}

export function listPermissionTokens(limit = 200) {
  const s = load();
  return [...s.permissionTokens].sort((a, b) => (b.issuedAt || "").localeCompare(a.issuedAt || "")).slice(0, limit);
}

export function deletePermissionToken(tokenId: string) {
  const s = load();
  s.permissionTokens = s.permissionTokens.filter((t) => t.tokenId !== tokenId);
  save(s);
}

export function saveDownload(record: DownloadRecord) {
  const s = load();
  s.downloads.push({
    ...record,
    fileVariantId: record.fileVariantId || null,
    userId: record.userId || null,
    anonymousUserId: record.anonymousUserId || null,
    donationId: record.donationId || null,
    permissionTokenId: record.permissionTokenId || null,
  });
  save(s);
}

export function listDownloads(filters: { templateId?: string; requestedUse?: string } = {}, limit = 200) {
  const s = load();
  return [...s.downloads]
    .filter((d) => (filters.templateId ? d.templateId === filters.templateId : true))
    .filter((d) => (filters.requestedUse ? d.requestedUse === filters.requestedUse : true))
    .sort((a, b) => (b.issuedAt || "").localeCompare(a.issuedAt || ""))
    .slice(0, limit);
}

export function saveDonation(record: DonationRecord) {
  const s = load();
  const normalized = { ...record, userId: record.userId || null, anonymousUserId: record.anonymousUserId || null };
  s.donations = s.donations.filter((d) => d.donationId !== record.donationId);
  s.donations.push(normalized);
  save(s);
}

export function getLatestCompletedDonation(params: { userId?: string | null; anonymousUserId?: string | null }) {
  const s = load();
  return (
    [...s.donations]
      .filter((d) => d.status === "completed")
      .filter((d) => (d.userId && d.userId === (params.userId || null)) || (d.anonymousUserId && d.anonymousUserId === (params.anonymousUserId || null)))
      .sort((a, b) => (b.donatedAt || "").localeCompare(a.donatedAt || ""))[0] || null
  );
}
