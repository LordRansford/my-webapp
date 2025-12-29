/**
 * AI Studio Authentication Utilities
 * 
 * Reusable authentication and authorization helpers for AI Studio routes
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { rateLimit } from "@/lib/security/rateLimit";
import { requireSameOrigin } from "@/lib/security/origin";

export interface AuthResult {
  ok: boolean;
  session?: any;
  user?: { id: string; email: string; tier?: string };
  response?: NextResponse;
}

/**
 * Require authentication for AI Studio routes
 */
export async function requireAuth(request: NextRequest): Promise<AuthResult> {
  // Check origin
  const originBlock = requireSameOrigin(request);
  if (originBlock) {
    return {
      ok: false,
      response: originBlock,
    };
  }

  // Check rate limit
  const limited = rateLimit(request, {
    keyPrefix: "ai-studio",
    limit: 100,
    windowMs: 60_000, // 1 minute
  });
  if (limited) {
    return {
      ok: false,
      response: limited,
    };
  }

  // Check session
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: {
            code: "UNAUTHORIZED",
            message: "Authentication required",
          },
        },
        { status: 401 }
      ),
    };
  }

  return {
    ok: true,
    session,
    user: {
      id: session.user.id,
      email: session.user.email || "",
      tier: (session.user as any).tier || "free",
    },
  };
}

/**
 * Require specific tier for access
 */
export async function requireTier(
  request: NextRequest,
  requiredTier: "free" | "starter" | "professional" | "enterprise"
): Promise<AuthResult> {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth;

  const tierOrder = {
    free: 0,
    starter: 1,
    professional: 2,
    enterprise: 3,
  };

  const userTier = auth.user?.tier || "free";
  if (tierOrder[userTier as keyof typeof tierOrder] < tierOrder[requiredTier]) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: {
            code: "INSUFFICIENT_TIER",
            message: `This feature requires ${requiredTier} tier or higher`,
            required: requiredTier,
            current: userTier,
          },
        },
        { status: 403 }
      ),
    };
  }

  return auth;
}

/**
 * Check if user has access to a resource
 */
export function checkResourceAccess(
  userId: string,
  resourceUserId: string
): boolean {
  return userId === resourceUserId;
}

