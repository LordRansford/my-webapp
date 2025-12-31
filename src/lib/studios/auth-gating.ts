/**
 * Account Gating Middleware
 * 
 * Enforces authentication requirements for server-side tools and credit purchases.
 * Provides structured error responses with actionable guidance.
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { getToolDefinition, toolRequiresAuth, isClientSideOnly } from "@/lib/tools/registry";

export interface AuthGateResult {
  allowed: boolean;
  userId?: string;
  reason?: string;
  action?: string;
  statusCode?: number;
}

/**
 * Require authentication for server-side tools
 * 
 * Returns error response if:
 * - Tool requires auth and user is not authenticated
 * - Tool is server_required and user is anonymous
 */
export async function requireAuthForServerTools(
  toolId: string
): Promise<AuthGateResult | NextResponse> {
  const tool = getToolDefinition(toolId);
  
  if (!tool) {
    return NextResponse.json(
      {
        error: "Tool not found",
        code: "TOOL_NOT_FOUND",
        action: "Check tool ID and try again",
      },
      { status: 404 }
    );
  }

  // Client-side only tools don't require auth
  if (isClientSideOnly(toolId)) {
    return { allowed: true };
  }

  // Check if tool requires auth
  if (toolRequiresAuth(toolId)) {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: "Authentication required",
          code: "AUTH_REQUIRED",
          reason: "This tool requires server-side execution, which needs an account",
          action: "Sign in to continue",
          signInUrl: "/api/auth/signin",
        },
        { status: 401 }
      );
    }

    return {
      allowed: true,
      userId: session.user.id,
    };
  }

  // Hybrid tools: auth optional but recommended for save/share
  return { allowed: true };
}

/**
 * Deny anonymous users from server-side operations
 * 
 * Use this for any server-side API endpoint that should not be accessible
 * to anonymous users, even if the tool itself is hybrid.
 */
export async function denyIfAnonymous(
  operation: string
): Promise<AuthGateResult | NextResponse> {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json(
      {
        error: "Authentication required",
        code: "AUTH_REQUIRED",
        reason: `${operation} requires an account`,
        action: "Sign in to continue",
        signInUrl: "/api/auth/signin",
      },
      { status: 401 }
    );
  }

  return {
    allowed: true,
    userId: session.user.id,
  };
}

/**
 * Deny if insufficient credits
 * 
 * Checks if user has enough credits for estimated maximum charge.
 * Returns structured error with upgrade/purchase options.
 */
export async function denyIfInsufficientCredits(
  userId: string,
  estimatedMaxCharge: number,
  currentBalance: number
): Promise<AuthGateResult | NextResponse> {
  if (currentBalance < estimatedMaxCharge) {
    const shortfall = estimatedMaxCharge - currentBalance;
    
    return NextResponse.json(
      {
        error: "Insufficient credits",
        code: "INSUFFICIENT_CREDITS",
        reason: `This operation requires ${estimatedMaxCharge} credits, but you have ${currentBalance}`,
        shortfall,
        estimatedMaxCharge,
        currentBalance,
        action: "Purchase credits or upgrade your plan",
        purchaseUrl: "/account/credits",
        upgradeUrl: "/account/upgrade",
      },
      { status: 402 } // 402 Payment Required
    );
  }

  return { allowed: true, userId };
}

/**
 * Get user ID from session (helper)
 */
export async function getUserIdFromSession(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return session?.user?.id || null;
}

/**
 * Require authentication (generic)
 * 
 * Use this for any endpoint that requires authentication.
 */
export async function requireAuth(
  reason?: string
): Promise<AuthGateResult | NextResponse> {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json(
      {
        error: "Authentication required",
        code: "AUTH_REQUIRED",
        reason: reason || "This operation requires an account",
        action: "Sign in to continue",
        signInUrl: "/api/auth/signin",
      },
      { status: 401 }
    );
  }

  return {
    allowed: true,
    userId: session.user.id,
  };
}
