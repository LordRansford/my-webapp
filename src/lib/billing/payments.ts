/**
 * Payment Processing
 * 
 * Handles credit purchase checkout sessions and webhook processing.
 * Integrated with Stripe for secure payment processing.
 */

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { CREDIT_PACKS, CREDIT_PRICE } from "@/lib/billing/plans";
import { getUserIdFromSession } from "@/lib/studios/auth-gating";
import { getStripeClient } from "@/lib/stripe";
import { getStripeEnv } from "@/lib/stripe/config";
import { addCredits } from "@/lib/billing/creditStore";
import { logCreditEvent } from "@/lib/audit/creditAudit";

export interface CheckoutSession {
  sessionId: string;
  url: string;
  packId: string;
  credits: number;
  price: number;
}

/**
 * Create checkout session for credit purchase
 * 
 * Requires authentication (credits can only be purchased with account).
 */
export async function createCheckoutSession(
  packId: string
): Promise<CheckoutSession | { error: string; code: string }> {
  // Require authentication
  const userId = await getUserIdFromSession();
  if (!userId) {
    return { error: "Authentication required", code: "AUTH_REQUIRED" };
  }

  // Find pack
  const pack = CREDIT_PACKS.find((p) => p.id === packId);
  if (!pack) {
    return { error: "Credit pack not found", code: "PACK_NOT_FOUND" };
  }

  // Check if Stripe is enabled
  const stripeEnv = getStripeEnv();
  if (!stripeEnv) {
    // Fallback to stub for development
    const sessionId = `checkout_${Date.now()}_${userId}`;
    const url = `/account/credits/checkout?session=${sessionId}&pack=${packId}`;
    return {
      sessionId,
      url,
      packId: pack.id,
      credits: pack.credits,
      price: pack.price,
    };
  }

  try {
    const stripe = getStripeClient();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : "http://localhost:3000";

    // Audit log: purchase initiated
    logCreditEvent({
      type: "credit_purchase_initiated",
      userId,
      credits: pack.credits,
      metadata: { packId: pack.id, price: pack.price },
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: `${pack.label} Credit Pack`,
              description: `${pack.credits.toLocaleString()} credits`,
            },
            unit_amount: Math.round(pack.price * 100), // Convert to pence
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        packId: pack.id,
        credits: pack.credits.toString(),
        type: "credit_purchase",
      },
      success_url: `${baseUrl}/account/credits/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/account/credits?canceled=true`,
      customer_email: undefined, // Will be collected during checkout
    });

    return {
      sessionId: session.id,
      url: session.url || `${baseUrl}/account/credits`,
      packId: pack.id,
      credits: pack.credits,
      price: pack.price,
    };
  } catch (error) {
    console.error("Stripe checkout session creation failed:", error);
    return {
      error: "Failed to create checkout session",
      code: "CHECKOUT_FAILED",
    };
  }
}

/**
 * Handle payment webhook for credit purchases
 * 
 * Processes payment completion and credits the user's account.
 * This should be called from the Stripe webhook handler.
 */
export async function handleCreditPurchaseWebhook(
  session: { id: string; metadata?: Record<string, string>; amount_total?: number }
): Promise<{ success: boolean; error?: string; creditsGranted?: number }> {
  const userId = session.metadata?.userId;
  const packId = session.metadata?.packId;
  const creditsStr = session.metadata?.credits;

  if (!userId || !packId || !creditsStr) {
    return {
      success: false,
      error: "Missing required metadata in checkout session",
    };
  }

  const credits = parseInt(creditsStr, 10);
  if (isNaN(credits) || credits <= 0) {
    return {
      success: false,
      error: "Invalid credits amount in metadata",
    };
  }

  try {
    // Grant credits to user
    const result = await addCredits(
      userId,
      credits,
      "purchase",
      {
        packId,
        stripeSessionId: session.id,
        amountPaid: session.amount_total ? session.amount_total / 100 : undefined, // Convert from pence
      }
    );

    if (result.success) {
      // Audit log: purchase completed
      logCreditEvent({
        type: "credit_purchase_completed",
        userId,
        credits,
        balance: result.newBalance,
        metadata: { packId, stripeSessionId: session.id },
      });

      return {
        success: true,
        creditsGranted: credits,
      };
    } else {
      // Audit log: purchase failed
      logCreditEvent({
        type: "credit_purchase_failed",
        userId,
        metadata: { packId, stripeSessionId: session.id, error: "Failed to grant credits" },
      });

      return {
        success: false,
        error: "Failed to grant credits",
      };
    }
  } catch (error) {
    console.error("Credit purchase webhook processing failed:", error);
    
    // Audit log: purchase failed
    logCreditEvent({
      type: "credit_purchase_failed",
      userId,
      metadata: { packId, stripeSessionId: session.id, error: error instanceof Error ? error.message : "Unknown error" },
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get available credit packs
 */
export function getCreditPacks() {
  return CREDIT_PACKS.map((pack) => ({
    id: pack.id,
    label: pack.label,
    price: pack.price,
    credits: pack.credits,
    pricePerCredit: pack.pricePerCredit,
    savings: pack.id !== "starter" 
      ? `${Math.round((1 - pack.pricePerCredit / CREDIT_PRICE) * 100)}% savings`
      : undefined,
  }));
}
