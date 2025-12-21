import type { Adapter } from "next-auth/adapters";
import {
  createId,
  createSession as storeCreateSession,
  createVerificationToken as storeCreateVerificationToken,
  deleteSession as storeDeleteSession,
  deleteUser as storeDeleteUser,
  getSessionAndUser as storeGetSessionAndUser,
  getUserByAccount as storeGetUserByAccount,
  getUserByEmail as storeGetUserByEmail,
  getUserById as storeGetUserById,
  linkAccount as storeLinkAccount,
  unlinkAccount as storeUnlinkAccount,
  updateSession as storeUpdateSession,
  upsertUser as storeUpsertUser,
  useVerificationToken as storeUseVerificationToken,
} from "@/lib/auth/store";

// Minimal NextAuth adapter using better-sqlite3 (no Prisma).
// Keeps identity server-side and avoids passwords (magic link + OAuth only).

export function BetterSqlite3Adapter(): Adapter {
  const nowIso = () => new Date().toISOString();

  return {
    async createUser(user) {
      const id = user.id || createId();
      storeUpsertUser({
        id,
        email: user.email,
        emailVerified: user.emailVerified ? new Date(user.emailVerified).toISOString() : null,
        name: user.name || null,
        image: user.image || null,
        provider: (user as any).provider || null,
        entitlements: ["free"],
        entitlementSource: "default",
        createdAt: nowIso(),
        lastLoginAt: nowIso(),
        tier: "registered",
        consent: { termsAcceptedAt: null, privacyAcceptedAt: null, cpdDataUseAcceptedAt: null },
      });
      return { ...user, id };
    },

    async getUser(id) {
      const row = storeGetUserById(id);
      if (!row) return null;
      return { id: row.id, email: row.email, emailVerified: row.emailVerified ? new Date(row.emailVerified) : null, name: row.name, image: row.image } as any;
    },

    async getUserByEmail(email) {
      const row = storeGetUserByEmail(email);
      if (!row) return null;
      return { id: row.id, email: row.email, emailVerified: row.emailVerified ? new Date(row.emailVerified) : null, name: row.name, image: row.image } as any;
    },

    async getUserByAccount({ provider, providerAccountId }) {
      const row = storeGetUserByAccount(provider, providerAccountId);
      if (!row) return null;
      return { id: row.id, email: row.email, emailVerified: row.emailVerified ? new Date(row.emailVerified) : null, name: row.name, image: row.image } as any;
    },

    async updateUser(user) {
      const existing = storeGetUserById(user.id);
      if (!existing) return user as any;
      const updated = storeUpsertUser({
        id: user.id,
        email: (user as any).email ?? existing.email,
        emailVerified:
          (user as any).emailVerified !== undefined
            ? (user as any).emailVerified
              ? new Date((user as any).emailVerified).toISOString()
              : null
            : existing.emailVerified,
        name: (user as any).name !== undefined ? (user as any).name : existing.name,
        image: (user as any).image !== undefined ? (user as any).image : existing.image,
        provider: existing.provider,
        entitlements: Array.isArray((existing as any).entitlements) && (existing as any).entitlements.length ? (existing as any).entitlements : ["free"],
        entitlementSource: (existing as any).entitlementSource || "default",
        createdAt: existing.createdAt,
        lastLoginAt: (existing as any).lastLoginAt ?? null,
        tier: (existing as any).tier || "registered",
        consent: (existing as any).consent || { termsAcceptedAt: null, privacyAcceptedAt: null, cpdDataUseAcceptedAt: null },
      });
      return { id: updated.id, email: updated.email, emailVerified: updated.emailVerified ? new Date(updated.emailVerified) : null, name: updated.name, image: updated.image } as any;
    },

    async deleteUser(userId) {
      storeDeleteUser(userId);
    },

    async linkAccount(account) {
      const rec = storeLinkAccount({
        userId: account.userId,
        type: account.type,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        refresh_token: account.refresh_token || null,
        access_token: account.access_token || null,
        expires_at: account.expires_at || null,
        token_type: account.token_type || null,
        scope: account.scope || null,
        id_token: account.id_token || null,
        session_state: account.session_state || null,
      });
      return { ...account, id: rec.id } as any;
    },

    async unlinkAccount({ provider, providerAccountId }) {
      storeUnlinkAccount(provider, providerAccountId);
    },

    async createSession(session) {
      const rec = storeCreateSession({
        sessionToken: session.sessionToken,
        userId: session.userId,
        expires: session.expires.toISOString(),
      });
      return { sessionToken: rec.sessionToken, userId: rec.userId, expires: new Date(rec.expires) } as any;
    },

    async getSessionAndUser(sessionToken) {
      const result = storeGetSessionAndUser(sessionToken);
      if (!result) return null;
      const { session, user } = result;
      return {
        session: { sessionToken: session.sessionToken, userId: session.userId, expires: new Date(session.expires) },
        user: {
          id: user.id,
          email: user.email,
          emailVerified: user.emailVerified ? new Date(user.emailVerified) : null,
          name: user.name,
          image: user.image,
        },
      } as any;
    },

    async updateSession(session) {
      const updated = storeUpdateSession(session.sessionToken, {
        expires: session.expires ? session.expires.toISOString() : undefined,
      });
      if (!updated) return null;
      return { sessionToken: updated.sessionToken, userId: updated.userId, expires: new Date(updated.expires) } as any;
    },

    async deleteSession(sessionToken) {
      storeDeleteSession(sessionToken);
    },

    async createVerificationToken(token) {
      return storeCreateVerificationToken({
        identifier: token.identifier,
        token: token.token,
        expires: token.expires.toISOString(),
      }) as any;
    },

    async useVerificationToken({ identifier, token }) {
      const row = storeUseVerificationToken(identifier, token);
      if (!row) return null;
      return { identifier: row.identifier, token: row.token, expires: new Date(row.expires) } as any;
    },
  };
}


