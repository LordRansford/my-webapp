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
import type { ComplexityPreset } from "@/lib/billing/estimateRunCost";
import type { GeneratedFile } from "@/lib/compute/generatedFiles";

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
  requestedComplexityPreset?: ComplexityPreset;
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

    const requestedPreset: ComplexityPreset =
      body.requestedComplexityPreset === "heavy"
        ? "heavy"
        : body.requestedComplexityPreset === "standard"
          ? "standard"
          : "light";

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
              records: [],
            };
            return { output: payload, outputBytes: Buffer.byteLength(JSON.stringify(payload)) };
          }

          // Cap record count for predictable output
          const safeRecords = Array.isArray(records) ? records.slice(0, 50) : records;
          const payload = {
            target,
            fallback: false,
            message: "OK",
            records: safeRecords,
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

    if (toolId === "ai-story-generator") {
      const schema = z.object({ prompt: z.string().trim().min(1).max(240) });
      const parsed = schema.safeParse(body.inputs);
      if (!parsed.success) {
        return NextResponse.json(
          { success: false, error: { code: "validation_error", message: "Provide a prompt (1–240 characters).", fixSuggestion: "Try a short sentence like: A kind robot helps a lost astronaut" } },
          { status: 400 }
        );
      }

      const prompt = parsed.data.prompt;

      const metered = await runWithMetering({
        req,
        userId,
        toolId: "ai-story-generator",
        inputBytes: Buffer.byteLength(prompt),
        requestedComplexityPreset: requestedPreset,
        execute: async () => {
          const delayBase = requestedPreset === "heavy" ? 700 : requestedPreset === "standard" ? 420 : 180;
          await new Promise((r) => setTimeout(r, Math.min(1400, delayBase + prompt.length * 3)));

          const ranAt = new Date().toISOString();
          const shortStory =
            `Once upon a time, a brave robot named R2-D5 discovered a quiet planet filled with shimmering crystals.\n\n` +
            `It followed one simple rule: be curious, be careful, and be kind. R2-D5 helped a lost traveller and returned home safely.`;

          const longStory =
            `Once upon a time, a brave robot named R2-D5 discovered a quiet planet filled with shimmering crystals.\n\n` +
            `It followed a simple rule: be curious, be careful, and be kind. With a small map and a bright light, ` +
            `it explored caves, logged the terrain, and helped a lost traveller find the safest path home.\n\n` +
            `R2-D5 also made a tiny “safety plan”: 1) stay with your team, 2) check your equipment, 3) ask for help early, 4) rest when tired.\n\n` +
            `In the end, R2-D5 returned with new knowledge and a promise: every adventure is better when you keep people safe.`;

          const story = requestedPreset === "light" ? shortStory : longStory;

          const outline =
            requestedPreset === "heavy"
              ? ["Setup: introduce the world and the hero", "Challenge: something goes slightly wrong", "Help: kindness + careful steps", "Resolution: safe return + lesson"]
              : ["Setup", "Help", "Resolution"];

          const citations = [
            { id: "SAFE-DEMO", title: "Safe demo policy", route: "/trust", excerpt: "Deterministic output, no external model calls, no personal data required." },
          ];

          const trace = {
            mode: "deterministic-template",
            steps: [
              "Validate prompt length and content shape.",
              `Select template length for preset=${requestedPreset}.`,
              "Render story from a fixed safe template.",
              "Attach export-ready artefacts.",
            ],
          };

          const storyMd =
            `# Story\n\n` +
            `## Prompt\n${prompt}\n\n` +
            `## Output\n\n${story}\n\n` +
            `## Safety\n- Mode: safe-demo\n- No external model calls\n\n` +
            `## Trace\n${trace.steps.map((s: string, i: number) => `${i + 1}. ${s}`).join("\n")}\n`;

          const files: GeneratedFile[] = [
            { filename: "story.md", mime: "text/markdown", kind: "deliverable", description: "Copy/paste into a document or CMS.", content: storyMd },
            {
              filename: "story.json",
              mime: "application/json",
              kind: "deliverable",
              description: "Structured output (use for integrations).",
              content: JSON.stringify({ ranAt, prompt, quality: requestedPreset, outline, story, citations, trace }, null, 2),
            },
            {
              filename: "README.md",
              mime: "text/markdown",
              kind: "config",
              description: "How to reuse this output.",
              content:
                `# AI Story Generator artefacts\n\n` +
                `- Edit \`story.md\` for formatting.\n` +
                `- Use \`story.json\` to integrate into apps.\n` +
                `- Keep the safety section if you share publicly.\n`,
            },
          ];

          const payload = {
            prompt,
            quality: requestedPreset,
            story,
            outline,
            citations,
            trace,
            safety: {
              mode: "safe-demo",
              note: "No external model calls. Deterministic output for reliability.",
            },
            ranAt,
            generatedFiles: files,
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
              fixSuggestion: metered.estimate?.reason || "Try a shorter prompt, or sign in to run beyond the free tier.",
            },
            estimate: metered.estimate,
          },
          { status: metered.status }
        );
      }

      const out = metered.output as any;
      const { generatedFiles, ...output } = out && typeof out === "object" ? out : { output: out };
      return NextResponse.json({
        success: true,
        output,
        files: Array.isArray(generatedFiles) ? generatedFiles : [],
        receipt: metered.receipt,
      });
    }

    if (toolId === "ai-homework-helper") {
      const schema = z.object({ question: z.string().trim().min(1).max(300) });
      const parsed = schema.safeParse(body.inputs);
      if (!parsed.success) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "validation_error",
              message: "Provide a question (1–300 characters).",
              fixSuggestion: "Try: How do I solve 2x + 5 = 15?",
            },
          },
          { status: 400 }
        );
      }

      const question = parsed.data.question;

      const metered = await runWithMetering({
        req,
        userId,
        toolId: "ai-homework-helper",
        inputBytes: Buffer.byteLength(question),
        requestedComplexityPreset: requestedPreset,
        execute: async () => {
          const delayBase = requestedPreset === "heavy" ? 700 : requestedPreset === "standard" ? 420 : 180;
          await new Promise((r) => setTimeout(r, Math.min(1400, delayBase + question.length * 2)));
          const matched = question.replace(/\s+/g, " ").match(/(\d+)\s*x\s*\+\s*(\d+)\s*=\s*(\d+)/i);
          const ranAt = new Date().toISOString();
          const payload: any = { question, ranAt };
          const citations = [
            { id: "ALG-1", title: "Solving a linear equation ax + b = c", excerpt: "Subtract b from both sides, then divide by a." },
            { id: "SAFE-DEMO", title: "Safe demo policy", route: "/trust", excerpt: "Deterministic output, narrow scope, no external model calls." },
          ];
          const trace: any = {
            scope: "linear-equations-only",
            parsed: Boolean(matched),
            steps: ["Parse question for ax + b = c", "Solve using algebraic transformations", "Add a check step where possible"],
          };

          if (matched) {
            const a = Number(matched[1]);
            const b = Number(matched[2]);
            const c = Number(matched[3]);
            const x = (c - b) / a;
            payload.parsed = { a, b, c };
            payload.steps = [`Subtract ${b} from both sides → ${a}x = ${c - b}`, `Divide both sides by ${a} → x = ${x}`];
            if (requestedPreset === "heavy") {
              payload.steps.push(`Check: plug x back in → ${a}·${x} + ${b} = ${a * x + b} ✓`);
            }
            payload.answer = `x = ${x}`;
            payload.check = requestedPreset === "heavy" ? `${a}·${x} + ${b} = ${a * x + b}` : undefined;
          } else {
            payload.steps = [
              "Rewrite the problem in a simpler form (remove extra words).",
              "Identify what is being asked.",
              "Show one step at a time, and check your result at the end.",
            ];
            payload.answer = "This demo can only solve simple equations like 2x + 5 = 15.";
          }
          payload.quality = requestedPreset;
          payload.citations = citations;
          payload.trace = trace;
          payload.safety = { mode: "safe-demo", note: "No external model calls. Deterministic output for reliability." };

          const solutionMd =
            `# Homework helper\n\n` +
            `## Question\n${question}\n\n` +
            `## Steps\n${(payload.steps || []).map((s: string, i: number) => `${i + 1}. ${s}`).join("\n")}\n\n` +
            `## Answer\n${payload.answer}\n\n` +
            `## Scope\nThis demo solves only simple linear equations like \`2x + 5 = 15\`.\n`;

          const teacherNotes =
            `# Teacher notes\n\n` +
            `- Scope is intentionally narrow for reliability.\n` +
            `- Common mistakes: sign errors when subtracting, dividing the wrong side.\n` +
            `- Ask the learner to check by substitution.\n`;

          const files: GeneratedFile[] = [
            { filename: "solution.md", mime: "text/markdown", kind: "deliverable", description: "Student-friendly steps + answer.", content: solutionMd },
            { filename: "solution.json", mime: "application/json", kind: "deliverable", description: "Structured solution object.", content: JSON.stringify(payload, null, 2) },
            { filename: "teacher-notes.md", mime: "text/markdown", kind: "audit", description: "Teaching tips and scope notes.", content: teacherNotes },
          ];
          payload.generatedFiles = files;

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
              fixSuggestion: metered.estimate?.reason || "Try a shorter question, or sign in to run beyond the free tier.",
            },
            estimate: metered.estimate,
          },
          { status: metered.status }
        );
      }

      const out = metered.output as any;
      const { generatedFiles, ...output } = out && typeof out === "object" ? out : { output: out };
      return NextResponse.json({
        success: true,
        output,
        files: Array.isArray(generatedFiles) ? generatedFiles : [],
        receipt: metered.receipt,
      });
    }

    if (toolId === "ai-support-bot") {
      const schema = z.object({ question: z.string().trim().min(1).max(300) });
      const parsed = schema.safeParse(body.inputs);
      if (!parsed.success) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: "validation_error",
              message: "Provide a question (1–300 characters).",
              fixSuggestion: "Try: How do I return an item?",
            },
          },
          { status: 400 }
        );
      }

      const question = parsed.data.question;

      const metered = await runWithMetering({
        req,
        userId,
        toolId: "ai-support-bot",
        inputBytes: Buffer.byteLength(question),
        requestedComplexityPreset: requestedPreset,
        execute: async () => {
          const delayBase = requestedPreset === "heavy" ? 700 : requestedPreset === "standard" ? 420 : 180;
          await new Promise((r) => setTimeout(r, Math.min(1400, delayBase + question.length * 2)));
          const q = question.toLowerCase();
          const ranAt = new Date().toISOString();
          const citations = [
            { id: "SUP-PLAYBOOK-1", title: "Basic support playbook", excerpt: "Confirm intent, give steps, offer escalation, ask for missing info." },
            { id: "SAFE-DEMO", title: "Safe demo policy", route: "/trust", excerpt: "Deterministic output, no account takeover actions, no sensitive data required." },
          ];

          let intent: "return" | "refund" | "delivery" | "login" | "general" = "general";
          let reply =
            "I can help with orders, returns, delivery, and account questions. Tell me what you need, and include your order number if you have one.";
          if (q.includes("return")) {
            intent = "return";
            reply =
              "To return an item: 1) Sign in, 2) Open Orders, 3) Select the item, 4) Choose Return, 5) Print the label, 6) Drop it off. If the item is damaged, contact support first.";
          } else if (q.includes("refund")) {
            intent = "refund";
            reply =
              "Refunds usually process after the return is received. Check your Orders page for the status. If it has been more than 7 days since delivery, contact support with your order number.";
          } else if (q.includes("delivery") || q.includes("shipping")) {
            intent = "delivery";
            reply =
              "For delivery updates, check the tracking link in your Orders page. If tracking has not updated for 48 hours, contact support and include your order number.";
          } else if (q.includes("password") || q.includes("sign in") || q.includes("login")) {
            intent = "login";
            reply =
              "If you cannot sign in, use the password reset link on the sign-in page. If you do not receive the email, check spam and confirm the address is correct.";
          }

          const trace = {
            intent,
            steps: [
              "Classify intent from keywords (return/refund/delivery/login).",
              "Select a safe, non-sensitive response template.",
              "Provide escalation guidance and next questions.",
            ],
          };

          const nextQuestions =
            intent === "delivery"
              ? ["What is the tracking status shown?", "When was the last tracking update?", "Which country/region is delivery to?"]
              : intent === "return" || intent === "refund"
                ? ["Do you have an order number?", "Is the item unopened, opened, or damaged?", "When did you receive it?"]
                : intent === "login"
                  ? ["Which email address are you using?", "Are you seeing an error message?", "Have you tried a password reset already?"]
                  : ["What outcome do you want (return/refund/delivery/login)?", "Do you have an order number (if relevant)?"];

          const payload =
            requestedPreset === "heavy"
              ? {
                  question,
                  quality: requestedPreset,
                  intent,
                  summary: reply,
                  steps: [
                    "Confirm the intent (return/refund/delivery/login).",
                    "Provide the exact steps and where to find them in the account area.",
                    "Offer escalation if the timeline is abnormal or the user is stuck.",
                  ],
                  escalation: "If this does not solve it, contact support and include your order number.",
                  nextQuestions,
                  citations,
                  trace,
                  safety: { mode: "safe-demo", note: "No external model calls. Deterministic output for reliability." },
                  ranAt,
                }
              : {
                  question,
                  quality: requestedPreset,
                  intent,
                  reply,
                  nextQuestions,
                  citations,
                  trace,
                  safety: { mode: "safe-demo", note: "No external model calls. Deterministic output for reliability." },
                  ranAt,
                };

          const replyMd =
            `# Support reply\n\n` +
            `## Intent\n${intent}\n\n` +
            `## Customer message\n${question}\n\n` +
            `## Reply\n${requestedPreset === "heavy" ? (payload as any).summary : (payload as any).reply}\n\n` +
            `## Next questions to ask\n${nextQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")}\n\n` +
            `## Safety\n- Do not ask for passwords or full card details.\n- Use escalation if the situation is unusual.\n`;

          const playbookMd =
            `# Mini support playbook\n\n` +
            `1. Confirm intent.\n2. Give exact steps.\n3. Ask for missing info.\n4. Offer escalation.\n\n` +
            `This demo is deterministic and does not access real accounts.\n`;

          const files: GeneratedFile[] = [
            { filename: "reply.md", mime: "text/markdown", kind: "deliverable", description: "Customer-ready response draft.", content: replyMd },
            { filename: "response.json", mime: "application/json", kind: "deliverable", description: "Structured support response.", content: JSON.stringify(payload, null, 2) },
            { filename: "support-playbook.md", mime: "text/markdown", kind: "config", description: "Reusable playbook for teams.", content: playbookMd },
          ];
          (payload as any).generatedFiles = files;

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
              fixSuggestion: metered.estimate?.reason || "Try a shorter question, or sign in to run beyond the free tier.",
            },
            estimate: metered.estimate,
          },
          { status: metered.status }
        );
      }

      const out = metered.output as any;
      const { generatedFiles, ...output } = out && typeof out === "object" ? out : { output: out };
      return NextResponse.json({
        success: true,
        output,
        files: Array.isArray(generatedFiles) ? generatedFiles : [],
        receipt: metered.receipt,
      });
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

