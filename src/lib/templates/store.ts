import { getDb } from "@/lib/db/sqlite";

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

export function savePermissionToken(token: PermissionToken) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO permission_tokens
    (tokenId, userId, anonymousUserId, templateId, scope, issuedAt, expiresAt, issuedBy, notes)
    VALUES (@tokenId, @userId, @anonymousUserId, @templateId, @scope, @issuedAt, @expiresAt, @issuedBy, @notes)
  `);
  stmt.run({
    ...token,
    userId: token.userId || null,
    anonymousUserId: token.anonymousUserId || null,
    templateId: token.templateId || null,
    expiresAt: token.expiresAt || null,
    notes: token.notes || null,
  });
}

export function getActivePermissionTokens(params: { userId?: string | null; anonymousUserId?: string | null; templateId?: string | null }) {
  const { userId, anonymousUserId, templateId } = params;
  const db = getDb();
  const nowIso = new Date().toISOString();
  const stmt = db.prepare(`
    SELECT * FROM permission_tokens
    WHERE (userId = @userId OR anonymousUserId = @anonymousUserId)
      AND (templateId IS NULL OR templateId = @templateId)
      AND (expiresAt IS NULL OR expiresAt > @nowIso)
  `);
  return stmt
    .all({
      userId: userId || null,
      anonymousUserId: anonymousUserId || null,
      templateId: templateId || null,
      nowIso,
    })
    .map((row) => row as PermissionToken);
}

export function listPermissionTokens(limit = 200) {
  const db = getDb();
  const stmt = db.prepare(`SELECT * FROM permission_tokens ORDER BY issuedAt DESC LIMIT ?`);
  return stmt.all(limit) as PermissionToken[];
}

export function deletePermissionToken(tokenId: string) {
  const db = getDb();
  const stmt = db.prepare(`DELETE FROM permission_tokens WHERE tokenId = ?`);
  stmt.run(tokenId);
}

export function saveDownload(record: DownloadRecord) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO template_downloads
    (downloadId, templateId, fileVariantId, userId, anonymousUserId, requestedUse, supportMethod, donationId, permissionTokenId, issuedAt, signaturePolicyApplied)
    VALUES (@downloadId, @templateId, @fileVariantId, @userId, @anonymousUserId, @requestedUse, @supportMethod, @donationId, @permissionTokenId, @issuedAt, @signaturePolicyApplied)
  `);
  stmt.run({
    ...record,
    fileVariantId: record.fileVariantId || null,
    userId: record.userId || null,
    anonymousUserId: record.anonymousUserId || null,
    donationId: record.donationId || null,
    permissionTokenId: record.permissionTokenId || null,
  });
}

export function listDownloads(filters: { templateId?: string; requestedUse?: string } = {}, limit = 200) {
  const db = getDb();
  const conditions: string[] = [];
  const params: Record<string, unknown> = { limit };
  if (filters.templateId) {
    conditions.push("templateId = @templateId");
    params.templateId = filters.templateId;
  }
  if (filters.requestedUse) {
    conditions.push("requestedUse = @requestedUse");
    params.requestedUse = filters.requestedUse;
  }
  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const stmt = db.prepare(`SELECT * FROM template_downloads ${where} ORDER BY issuedAt DESC LIMIT @limit`);
  return stmt.all(params) as DownloadRecord[];
}

export function saveDonation(record: DonationRecord) {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO donations
    (donationId, userId, anonymousUserId, amount, currency, status, donatedAt)
    VALUES (@donationId, @userId, @anonymousUserId, @amount, @currency, @status, @donatedAt)
  `);
  stmt.run({
    ...record,
    userId: record.userId || null,
    anonymousUserId: record.anonymousUserId || null,
  });
}

export function getLatestCompletedDonation(params: { userId?: string | null; anonymousUserId?: string | null }) {
  const db = getDb();
  const stmt = db.prepare(`
    SELECT * FROM donations
    WHERE status = 'completed'
      AND (userId = @userId OR anonymousUserId = @anonymousUserId)
    ORDER BY donatedAt DESC
    LIMIT 1
  `);
  const row = stmt.get({ userId: params.userId || null, anonymousUserId: params.anonymousUserId || null });
  return row ? (row as DonationRecord) : null;
}
