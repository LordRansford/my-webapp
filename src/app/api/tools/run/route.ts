import { NextResponse } from "next/server";
import dns from "dns";
import net from "net";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { runWithMetering } from "@/lib/tools/runWithMetering";
import { requireSameOrigin } from "@/lib/security/origin";
import { rateLimit } from "@/lib/security/rateLimit";
import { withRequestLogging } from "@/lib/security/requestLog";

/**
 * Tool Execution API Route
 * 
 * Compute-mode execution for ToolShell tools.
 *
 * This endpoint is intentionally conservative:
 * - Only allowlisted tools run here
 * - Strict input validation
 * - Private/local targets blocked for network tools
 * - Credit metering uses the shared runWithMetering engine
 */

interface RunRequest {
  toolId: string;
  mode: "local" | "compute";
  inputs: Record<string, unknown>;
}

const isPrivateIp = (value: string) => {
  const ip = net.isIP(value) ? value : null;
  if (!ip) return false;
  const segments = ip.split(".").map((n) => parseInt(n, 10));
  if (segments[0] === 10) return true;
  if (segments[0] === 172 && segments[1] >= 16 && segments[1] <= 31) return true;
  if (segments[0] === 192 && segments[1] === 168) return true;
  if (segments[0] === 127) return true;
  return false;
};

const isHostLike = (value: string) => /^[a-zA-Z0-9.-]+$/.test(value) && value.includes(".");

const withTimeout = <T,>(promise: Promise<T>, ms: number) =>
  Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("Timed out")), ms)),
  ]);

export async function POST(req: Request) {
  return withRequestLogging(req, { route: "POST /api/tools/run" }, async () => {
    const originBlock = requireSameOrigin(req);
    if (originBlock) return originBlock;

    const limited = rateLimit(req, { keyPrefix: "tools-run", limit: 60, windowMs: 60_000 });
    if (limited) return limited;

    try {
    const body: RunRequest = await req.json().catch(() => null);
    
    if (!body || !body.toolId || !body.mode || !body.inputs) {
      return NextResponse.json(
        { success: false, error: { code: "invalid_request", message: "Missing required fields" } },
        { status: 400 }
      );
    }

    // If mode is local, this endpoint should not be called
    if (body.mode === "local") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "local_mode_error",
            message: "Local mode should not call this endpoint. Use client-side execution.",
          },
        },
        { status: 400 }
      );
    }

    const toolId = String(body.toolId || "").trim();
    const session = await getServerSession(authOptions).catch(() => null);
    const userId = session?.user?.id || null;

    // Allowlist: only tools explicitly supported here
    if (toolId === "whois-summary") {
      const schema = z.object({ target: z.string().trim().min(1).max(200) });
      const parsed = schema.safeParse(body.inputs);
      if (!parsed.success) {
        return NextResponse.json(
          { success: false, error: { code: "validation_error", message: "Provide a valid domain.", fixSuggestion: "Use a public domain like example.com" } },
          { status: 400 }
        );
      }

      const target = parsed.data.target.toLowerCase();
      if (!isHostLike(target) || isPrivateIp(target)) {
        return NextResponse.json(
          { success: false, error: { code: "validation_error", message: "Provide a valid public hostname.", fixSuggestion: "Private and local targets are blocked." } },
          { status: 400 }
        );
      }

      const metered = await runWithMetering({
        req,
        userId,
        toolId: "whois-summary",
        inputBytes: Buffer.byteLength(target),
        requestedComplexityPreset: "light",
        execute: async () => {
          const payload = {
            target,
            fallback: true,
            registrar: "Use your registrar WHOIS portal",
            ageHint: "Check creation and expiry dates via WHOIS or RDAP",
            tip: "Compare domain age to the context. Newly registered domains can be higher risk.",
          };
          return { output: payload, outputBytes: Buffer.byteLength(JSON.stringify(payload)) };
        },
      });

      if (!metered.ok) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "run_blocked",
              message: metered.message,
              fixSuggestion: metered.estimate?.reason || "Try again later, or reduce input size.",
            },
            estimate: metered.estimate,
          },
          { status: metered.status }
        );
      }

      return NextResponse.json({ success: true, output: metered.output, receipt: metered.receipt });
    }

    if (toolId === "dns-lookup") {
      const schema = z.object({ target: z.string().trim().min(1).max(200) });
      const parsed = schema.safeParse(body.inputs);
      if (!parsed.success) {
        return NextResponse.json(
          { success: false, error: { code: "validation_error", message: "Provide a valid hostname.", fixSuggestion: "Use a public hostname like example.com" } },
          { status: 400 }
        );
      }

      const target = parsed.data.target.toLowerCase();
      if (!isHostLike(target) || isPrivateIp(target)) {
        return NextResponse.json(
          { success: false, error: { code: "validation_error", message: "Provide a valid public hostname.", fixSuggestion: "Private and local targets are blocked." } },
          { status: 400 }
        );
      }

      const metered = await runWithMetering({
        req,
        userId,
        toolId: "dns-lookup",
        inputBytes: Buffer.byteLength(target),
        requestedComplexityPreset: "light",
        execute: async () => {
          const records = await withTimeout(dns.promises.resolveAny(target), 5000).catch(() => null);
          if (!records) {
            const payload = {
              target,
              fallback: true,
              message: "Could not resolve. Verify the domain exists and try again.",
            };
            return { output: payload, outputBytes: Buffer.byteLength(JSON.stringify(payload)) };
          }

          // Cap record count for predictable output
          const safeRecords = Array.isArray(records) ? records.slice(0, 50) : records;
          const payload = { target, records: safeRecords };
          return { output: payload, outputBytes: Buffer.byteLength(JSON.stringify(payload)) };
        },
      });

      if (!metered.ok) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "run_blocked",
              message: metered.message,
              fixSuggestion: metered.estimate?.reason || "Try again later, or reduce input size.",
            },
            estimate: metered.estimate,
          },
          { status: metered.status }
        );
      }

      return NextResponse.json({ success: true, output: metered.output, receipt: metered.receipt });
    }

    // Default: preserve previous behaviour for unknown tools
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "compute_not_implemented",
          message: "Compute execution is not implemented for this tool yet.",
          fixSuggestion: "Try a different tool or use Local mode where available.",
        },
      },
      { status: 501 }
    );
    } catch (err) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "server_error",
            message: err instanceof Error ? err.message : "Internal server error",
          },
        },
        { status: 500 }
      );
    }
  });
}

