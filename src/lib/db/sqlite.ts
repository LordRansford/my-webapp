import BetterSqlite3 from "better-sqlite3";
import fs from "fs";
import path from "path";

const DEFAULT_DB_PATH = path.join(process.cwd(), "data", "templates.db");

function ensureDir(filePath: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

let db: BetterSqlite3.Database | null = null;

function ensureTables(conn: BetterSqlite3.Database) {
  conn.pragma("journal_mode = WAL");
  conn.pragma("foreign_keys = ON");

  conn.exec(`
    CREATE TABLE IF NOT EXISTS permission_tokens (
      tokenId TEXT PRIMARY KEY,
      userId TEXT,
      anonymousUserId TEXT,
      templateId TEXT,
      scope TEXT NOT NULL,
      issuedAt TEXT NOT NULL,
      expiresAt TEXT,
      issuedBy TEXT NOT NULL,
      notes TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_tokens_user ON permission_tokens(userId, anonymousUserId);
    CREATE INDEX IF NOT EXISTS idx_tokens_template ON permission_tokens(templateId);

    CREATE TABLE IF NOT EXISTS template_downloads (
      downloadId TEXT PRIMARY KEY,
      templateId TEXT NOT NULL,
      fileVariantId TEXT,
      userId TEXT,
      anonymousUserId TEXT,
      requestedUse TEXT NOT NULL,
      supportMethod TEXT NOT NULL,
      donationId TEXT,
      permissionTokenId TEXT,
      issuedAt TEXT NOT NULL,
      signaturePolicyApplied TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_downloads_template ON template_downloads(templateId);
    CREATE INDEX IF NOT EXISTS idx_downloads_user ON template_downloads(userId, anonymousUserId);

    CREATE TABLE IF NOT EXISTS donations (
      donationId TEXT PRIMARY KEY,
      userId TEXT,
      anonymousUserId TEXT,
      amount INTEGER,
      currency TEXT,
      status TEXT,
      donatedAt TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_donations_user ON donations(userId, anonymousUserId);
  `);
}

export function getDb() {
  if (db) return db;
  const dbPath = process.env.TEMPLATE_DB_PATH || DEFAULT_DB_PATH;
  ensureDir(dbPath);
  db = new BetterSqlite3(dbPath);
  ensureTables(db);
  return db;
}

export function resetDbConnection() {
  if (db) {
    db.close();
    db = null;
  }
}
