import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import type { NextAuthOptions } from "next-auth";
import { BetterSqlite3Adapter } from "@/lib/auth/adapter";
import { upsertUser, getUserById } from "@/lib/auth/store";
import { getUserPlan } from "@/lib/billing/access";
import { upsertUserIdentity } from "@/services/progressService";
import { prisma } from "@/lib/db/prisma";
import { isAdminRole } from "@/lib/admin/rbac";
import { logWarn } from "@/lib/telemetry/log";

export const authOptions: NextAuthOptions = {
  adapter: BetterSqlite3Adapter(),
  // Phase 5: stateless JWT sessions (no server session table required).
  // Tokens remain in httpOnly cookies; client JS never reads raw tokens.
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 14 },
  // Security: set NEXTAUTH_SECRET in env for consistent token/cookie encryption.
  // Keep secrets server-side only. NextAuth cookies are httpOnly by default and CSRF protection is enabled by default.
  secret: process.env.NEXTAUTH_SECRET,
  providers: (() => {
    const providers: any[] = [];

    // Keep login optional: the site remains usable without auth, but users can sign in to persist progress across devices.
    const googleId = process.env.GOOGLE_CLIENT_ID || "";
    const googleSecret = process.env.GOOGLE_CLIENT_SECRET || "";
    if (googleId && googleSecret) {
      providers.push(
        GoogleProvider({
          clientId: googleId,
          clientSecret: googleSecret,
        })
      );
    } else if (process.env.NODE_ENV !== "production" && (googleId || googleSecret)) {
      logWarn("auth.provider_misconfigured", { provider: "google" });
    }

    // Email magic link (passwordless). Only enable when fully configured.
    const emailServer = process.env.EMAIL_SERVER || "";
    const emailFrom = process.env.EMAIL_FROM || "";
    if (emailServer && emailFrom) {
      providers.push(
        EmailProvider({
          server: emailServer,
          from: emailFrom,
          // Magic link expiry <= 15 minutes.
          maxAge: 15 * 60,
        })
      );
    } else if (process.env.NODE_ENV !== "production" && (emailServer || emailFrom)) {
      logWarn("auth.provider_misconfigured", { provider: "email" });
    }

    return providers;
  })(),
  pages: {
    signIn: "/signin",
    verifyRequest: "/signin?check=1",
    error: "/signin?error=auth",
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
    async jwt({ token, user }) {
      // Embed admin role in JWT so middleware can enforce /admin without DB access.
      // Fail closed: unknown values are ignored.
      try {
        const userId = (user as any)?.id || (token as any)?.sub;
        if (userId) {
          const rec = await (prisma as any).userIdentity.findUnique({ where: { id: String(userId) }, select: { adminRole: true } });
          const role = rec?.adminRole;
          (token as any).adminRole = isAdminRole(role) ? role : null;
        }
      } catch {
        (token as any).adminRole = null;
      }
      return token;
    },
    async session({ session, token, user }) {
      if (session.user) {
        session.user.id = (user as any)?.id || String((token as any)?.sub || "");
        // Surface admin role to server components; do not rely on this on the client for security.
        (session.user as any).adminRole = (token as any)?.adminRole || null;
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


