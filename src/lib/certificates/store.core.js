import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const STORE_PATH = process.env.CERTIFICATES_STORE_PATH || "data/certificates.json";
const empty = { certificates: [] };

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readJsonFile(filePath, fallback) {
  try {
    const abs = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
    if (!fs.existsSync(abs)) return fallback;
    return JSON.parse(fs.readFileSync(abs, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJsonFile(filePath, value) {
  const abs = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
  ensureDir(abs);
  const tmp = `${abs}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(value, null, 2), "utf8");
  fs.renameSync(tmp, abs);
}

export function issueCertificate(params) {
  const { userId, courseId, levelId, courseTitle, hoursEarned, completionDate, learnerName } = params;
  const s = readJsonFile(STORE_PATH, empty);
  const key = `${userId}:${courseId}:${levelId}`;
  const existing = (s.certificates || []).find((c) => `${c.userId}:${c.courseId}:${c.levelId}` === key);
  if (existing) return existing;

  const certificateId = crypto.randomUUID();
  const cert = {
    certificateId,
    userId,
    courseId,
    levelId,
    courseTitle,
    hoursEarned,
    completionDate,
    issuedAt: new Date().toISOString(),
    version: 1,
    learnerName: learnerName || "",
    revokedAt: null,
  };
  s.certificates.push(cert);
  writeJsonFile(STORE_PATH, s);
  return cert;
}

export function getCertificateById(certificateId) {
  const s = readJsonFile(STORE_PATH, empty);
  return (s.certificates || []).find((c) => c.certificateId === certificateId) || null;
}

export function revokeCertificate(certificateId, reason = "") {
  const s = readJsonFile(STORE_PATH, empty);
  const idx = (s.certificates || []).findIndex((c) => c.certificateId === certificateId);
  if (idx < 0) return null;
  if (s.certificates[idx].revokedAt) return s.certificates[idx];
  s.certificates[idx] = {
    ...s.certificates[idx],
    revokedAt: new Date().toISOString(),
    revokedReason: reason || undefined,
  };
  writeJsonFile(STORE_PATH, s);
  return s.certificates[idx];
}


