import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import { BetterSqlite3Adapter } from "@/lib/auth/adapter";
import { upsertUser, getUserById } from "@/lib/auth/store";
import { getUserPlan } from "@/lib/billing/access";
import { upsertUserIdentity } from "@/services/progressService";

export const authOptions: NextAuthOptions = {
  adapter: BetterSqlite3Adapter(),
  // Phase 5: stateless JWT sessions (no server session table required).
  // Tokens remain in httpOnly cookies; client JS never reads raw tokens.
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 14 },
  // Security: set NEXTAUTH_SECRET in env for consistent token/cookie encryption.
  // Keep secrets server-side only. NextAuth cookies are httpOnly by default and CSRF protection is enabled by default.
  secret: process.env.NEXTAUTH_SECRET,
  providers: (() => {
    // Google OAuth only.
    // Keep login optional: the site remains fully usable without auth, but users can sign in to persist progress across devices.
    const id = process.env.GOOGLE_CLIENT_ID || "";
    const secret = process.env.GOOGLE_CLIENT_SECRET || "";

    if (process.env.NODE_ENV !== "production" && (!id || !secret)) {
      // In dev, missing OAuth env vars should not crash the app (logged-out browsing should still work).
      console.warn("auth:warn Missing Google OAuth env vars: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET");
      return [];
    }

    if (!id || !secret) return [];

    return [
      GoogleProvider({
        clientId: id,
        clientSecret: secret,
      }),
    ];
  })(),
  pages: {
    signIn: "/signin",
    verifyRequest: "/signin?check=1",
  },
  events: {
    async signIn({ user, account }) {
      // Identity model (passwordless by design):
      // - User = email + provider id (providerAccountId)
      // - Email is the primary identifier for humans; internal id is stable UUID
      //
      // Store minimal identity metadata. Never store magic link tokens.
      try {
        const existing = user?.id ? getUserById(user.id) : null;
        const plan = user?.id ? await getUserPlan(user.id) : "free";
        if (existing && user?.id) {
          upsertUser({
            ...existing,
            // Tier is derived from server-side plan records/entitlements.
            tier: plan === "pro" ? "professional" : plan === "supporter" ? "supporter" : "registered",
            lastLoginAt: new Date().toISOString(),
          });
        }
        // Mirror identity into the Prisma-backed progress store so progress persistence can scale.
        if (user?.id && user?.email && account?.provider && account?.providerAccountId) {
          await upsertUserIdentity({
            userId: user.id,
            email: user.email,
            provider: account.provider,
            providerAccountId: String(account.providerAccountId),
          });
        }
      } catch {
        // Avoid blocking sign-in on metadata write.
      }
    },
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  // Privacy: do not log personal data beyond email. Keep logs minimal.
  logger: {
    error(code) {
      console.error("auth:error", code);
    },
    warn(code) {
      console.warn("auth:warn", code);
    },
    debug() {
      // intentionally no-op (avoid verbose logs containing auth payloads)
    },
  },
};


