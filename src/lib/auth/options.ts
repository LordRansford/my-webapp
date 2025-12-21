import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import type { NextAuthOptions } from "next-auth";
import { BetterSqlite3Adapter } from "@/lib/auth/adapter";
import { upsertUser, getUserById } from "@/lib/auth/store";
import { getUserPlan } from "@/lib/billing/access";

export const authOptions: NextAuthOptions = {
  adapter: BetterSqlite3Adapter(),
  session: { strategy: "database" },
  // Security: set NEXTAUTH_SECRET in env for consistent token/cookie encryption.
  // Keep secrets server-side only. NextAuth cookies are httpOnly by default and CSRF protection is enabled by default.
  secret: process.env.NEXTAUTH_SECRET,
  providers: (() => {
    // Passwordless magic link (no password storage/reset flows).
    const providers: any[] = [
      EmailProvider({
        server: process.env.EMAIL_SERVER,
        from: process.env.EMAIL_FROM,
      }),
    ];

    // Optional OAuth (disabled by default for Stage 21).
    // Enable only when explicitly turned on and all required env vars are present.
    const oauthEnabled = process.env.AUTH_OAUTH_ENABLED === "true";
    if (oauthEnabled) {
      if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
        providers.push(
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          })
        );
      }
      if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
        providers.push(
          GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          })
        );
      }
    }

    return providers;
  })(),
  pages: {
    signIn: "/signin",
    verifyRequest: "/signin?check=1",
  },
  events: {
    async signIn({ user }) {
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


