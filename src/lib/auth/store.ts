import { randomUUID } from "crypto";
import { readJsonFile, writeJsonFile } from "@/lib/storage/jsonFile";

const AUTH_STORE_PATH = process.env.AUTH_STORE_PATH || "data/auth.json";

export type StoredUser = {
  id: string;
  email: string;
  emailVerified: string | null;
  name: string | null;
  image: string | null;
  provider: string | null;
  entitlements: string[];
  entitlementSource: string;
  createdAt: string;
  lastLoginAt?: string | null;
  tier?: "visitor" | "registered" | "supporter" | "professional";
  consent?: {
    termsAcceptedAt?: string | null;
    privacyAcceptedAt?: string | null;
    cpdDataUseAcceptedAt?: string | null;
  };
};

export function addUserEntitlement(params: { userId: string; entitlement: string; source: string }) {
  const s = load();
  const idx = s.users.findIndex((u) => u.id === params.userId);
  if (idx === -1) return null;
  const user = s.users[idx];
  const entitlements = Array.isArray(user.entitlements) ? user.entitlements : ["free"];
  const next = Array.from(new Set([...entitlements.filter((e) => e !== "free"), params.entitlement]));
  s.users[idx] = {
    ...user,
    entitlements: next.length ? next : ["free"],
    entitlementSource: params.source,
  };
  save(s);
  return s.users[idx];
}

type StoredAccount = {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string | null;
  access_token?: string | null;
  expires_at?: number | null;
  token_type?: string | null;
  scope?: string | null;
  id_token?: string | null;
  session_state?: string | null;
};

type StoredSession = {
  id: string;
  sessionToken: string;
  userId: string;
  expires: string;
};

type StoredVerificationToken = {
  identifier: string;
  token: string;
  expires: string;
};

type AuthStore = {
  users: StoredUser[];
  accounts: StoredAccount[];
  sessions: StoredSession[];
  verificationTokens: StoredVerificationToken[];
  cpdState: Record<string, { stateJson: string; updatedAt: string }>;
};

const empty: AuthStore = {
  users: [],
  accounts: [],
  sessions: [],
  verificationTokens: [],
  cpdState: {},
};

function load(): AuthStore {
  return readJsonFile<AuthStore>(AUTH_STORE_PATH, empty);
}

function save(store: AuthStore) {
  writeJsonFile(AUTH_STORE_PATH, store);
}

export function createId() {
  return randomUUID();
}

export function getUserById(id: string) {
  const s = load();
  return s.users.find((u) => u.id === id) || null;
}

export function getUserByEmail(email: string) {
  const s = load();
  return s.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export function upsertUser(user: Omit<StoredUser, "createdAt"> & { createdAt?: string }) {
  const s = load();
  const existingIdx = s.users.findIndex((u) => u.id === user.id);
  const existing = existingIdx >= 0 ? s.users[existingIdx] : null;
  const record: StoredUser = {
    ...user,
    entitlements: Array.isArray(user.entitlements) && user.entitlements.length ? user.entitlements : ["free"],
    entitlementSource: user.entitlementSource || "default",
    createdAt: user.createdAt || new Date().toISOString(),
    lastLoginAt: user.lastLoginAt !== undefined ? user.lastLoginAt : existing?.lastLoginAt ?? null,
    tier: user.tier || existing?.tier || "registered",
    consent: {
      termsAcceptedAt:
        user.consent?.termsAcceptedAt !== undefined ? user.consent?.termsAcceptedAt : existing?.consent?.termsAcceptedAt ?? null,
      privacyAcceptedAt:
        user.consent?.privacyAcceptedAt !== undefined ? user.consent?.privacyAcceptedAt : existing?.consent?.privacyAcceptedAt ?? null,
      cpdDataUseAcceptedAt:
        user.consent?.cpdDataUseAcceptedAt !== undefined ? user.consent?.cpdDataUseAcceptedAt : existing?.consent?.cpdDataUseAcceptedAt ?? null,
    },
  };
  if (existingIdx >= 0) s.users[existingIdx] = record;
  else s.users.push(record);
  save(s);
  return record;
}

export function updateUserConsent(params: {
  userId: string;
  termsAccepted: boolean;
  privacyAccepted: boolean;
  cpdDataUseAccepted: boolean;
}) {
  const s = load();
  const idx = s.users.findIndex((u) => u.id === params.userId);
  if (idx < 0) return null;
  const now = new Date().toISOString();
  const existing = s.users[idx];
  const consent = existing.consent || {};
  s.users[idx] = {
    ...existing,
    consent: {
      termsAcceptedAt: params.termsAccepted ? consent.termsAcceptedAt || now : null,
      privacyAcceptedAt: params.privacyAccepted ? consent.privacyAcceptedAt || now : null,
      cpdDataUseAcceptedAt: params.cpdDataUseAccepted ? consent.cpdDataUseAcceptedAt || now : null,
    },
  };
  save(s);
  return s.users[idx];
}

export function deleteUser(id: string) {
  const s = load();
  s.users = s.users.filter((u) => u.id !== id);
  s.accounts = s.accounts.filter((a) => a.userId !== id);
  s.sessions = s.sessions.filter((sess) => sess.userId !== id);
  delete s.cpdState[id];
  save(s);
}

export function linkAccount(account: Omit<StoredAccount, "id">) {
  const s = load();
  const record: StoredAccount = { id: createId(), ...account };
  // Ensure uniqueness by provider/providerAccountId
  s.accounts = s.accounts.filter(
    (a) => !(a.provider === record.provider && a.providerAccountId === record.providerAccountId)
  );
  s.accounts.push(record);
  save(s);
  return record;
}

export function unlinkAccount(provider: string, providerAccountId: string) {
  const s = load();
  s.accounts = s.accounts.filter((a) => !(a.provider === provider && a.providerAccountId === providerAccountId));
  save(s);
}

export function getUserByAccount(provider: string, providerAccountId: string) {
  const s = load();
  const acct = s.accounts.find((a) => a.provider === provider && a.providerAccountId === providerAccountId);
  if (!acct) return null;
  return s.users.find((u) => u.id === acct.userId) || null;
}

export function createSession(session: Omit<StoredSession, "id">) {
  const s = load();
  const record: StoredSession = { id: createId(), ...session };
  s.sessions.push(record);
  save(s);
  return record;
}

export function getSessionAndUser(sessionToken: string) {
  const s = load();
  const sess = s.sessions.find((x) => x.sessionToken === sessionToken);
  if (!sess) return null;
  const user = s.users.find((u) => u.id === sess.userId);
  if (!user) return null;
  return { session: sess, user };
}

export function updateSession(sessionToken: string, patch: Partial<Pick<StoredSession, "expires">>) {
  const s = load();
  const idx = s.sessions.findIndex((x) => x.sessionToken === sessionToken);
  if (idx < 0) return null;
  s.sessions[idx] = { ...s.sessions[idx], ...patch };
  save(s);
  return s.sessions[idx];
}

export function deleteSession(sessionToken: string) {
  const s = load();
  s.sessions = s.sessions.filter((x) => x.sessionToken !== sessionToken);
  save(s);
}

export function createVerificationToken(token: StoredVerificationToken) {
  const s = load();
  s.verificationTokens.push(token);
  save(s);
  return token;
}

export function useVerificationToken(identifier: string, token: string) {
  const s = load();
  const idx = s.verificationTokens.findIndex((t) => t.identifier === identifier && t.token === token);
  if (idx < 0) return null;
  const record = s.verificationTokens[idx];
  s.verificationTokens.splice(idx, 1);
  save(s);
  return record;
}

export function getCpdState(userId: string) {
  const s = load();
  return s.cpdState[userId] || null;
}

export function setCpdState(userId: string, stateJson: string) {
  const s = load();
  s.cpdState[userId] = { stateJson, updatedAt: new Date().toISOString() };
  save(s);
  return s.cpdState[userId];
}


