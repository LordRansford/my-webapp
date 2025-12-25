import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

/**
 * Tool Execution API Route
 * 
 * Safe, non-breaking stub for compute mode execution.
 * If compute is not enabled, returns friendly error.
 * Local mode should never call this endpoint.
 */

interface RunRequest {
  toolId: string;
  mode: "local" | "compute";
  inputs: Record<string, unknown>;
}

export async function POST(req: Request) {
  try {
    const body: RunRequest = await req.json().catch(() => null);
    
    if (!body || !body.toolId || !body.mode || !body.inputs) {
      return NextResponse.json(
        { success: false, error: { code: "invalid_request", message: "Missing required fields" } },
        { status: 400 }
      );
    }

    // Load tool contract
    const contractsPath = path.join(process.cwd(), "data", "tool-contracts.json");
    const contractsData = JSON.parse(fs.readFileSync(contractsPath, "utf8"));
    const contract = contractsData.tools.find((t: { id: string }) => t.id === body.toolId);

    if (!contract) {
      return NextResponse.json(
        { success: false, error: { code: "tool_not_found", message: `Tool "${body.toolId}" not found` } },
        { status: 404 }
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

    // Check if compute mode is enabled
    const computeEnabled = process.env.COMPUTE_ENABLED === "true";

    if (!computeEnabled) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "compute_unavailable",
            message: "Compute mode is temporarily unavailable. Use Local mode.",
            fixSuggestion: "Switch to Local mode in the tool interface.",
          },
        },
        { status: 503 }
      );
    }

    // Validate inputs against contract
    const inputKb = JSON.stringify(body.inputs).length / 1024;
    if (inputKb > contract.limits.inputKb) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "input_too_large",
            message: `Input exceeds ${contract.limits.inputKb}KB limit`,
          },
        },
        { status: 400 }
      );
    }

    // TODO: Implement actual compute execution
    // For now, return a placeholder response
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "compute_not_implemented",
          message: "Compute execution is not yet implemented for this tool.",
          fixSuggestion: "Use Local mode for now.",
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
}

