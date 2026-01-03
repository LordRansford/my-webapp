/**
 * Run an AI Studio project (local-first).
 *
 * This provides a real, deterministic execution path for flagship templates
 * without requiring external model keys. It also produces a receipt object
 * so users can understand what happened.
 */

import { getExampleById } from "@/lib/ai-studio/examples";
import type { AIStudioProject, AIStudioRunReceipt } from "./store";

function nowIso() {
  return new Date().toISOString();
}

function newRunId() {
  return `r_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

function byteSize(value: unknown) {
  try {
    return new Blob([typeof value === "string" ? value : JSON.stringify(value)]).size;
  } catch {
    return 0;
  }
}

function clampStr(s: string, max: number) {
  return s.length <= max ? s : s.slice(0, max);
}

export async function runAiStudioProjectLocal(params: {
  project: AIStudioProject;
  input?: unknown;
}): Promise<{ output: unknown; receipt: AIStudioRunReceipt }> {
  const start = typeof performance !== "undefined" ? performance.now() : Date.now();
  const runId = newRunId();

  const example = getExampleById(params.project.exampleId);
  const defaultInput = example?.preview?.input ?? null;
  const input = params.input ?? defaultInput;

  let output: unknown;

  // Flagship: Story Generator (child-friendly, deterministic).
  if (params.project.exampleId === "story-generator") {
    const promptRaw = typeof input === "string" ? input : JSON.stringify(input);
    const prompt = clampStr(promptRaw || "A kind robot helps a lost astronaut", 240);
    output = {
      prompt,
      story:
        `Once upon a time, a brave robot named R2-D5 discovered a quiet planet filled with shimmering crystals.\n\n` +
        `It followed a simple rule: be curious, be careful, and be kind. With a small map and a bright light, ` +
        `it explored caves, logged the terrain, and helped a lost traveller find the safest path home.\n\n` +
        `In the end, R2-D5 returned with new knowledge and a promise: every adventure is better when you keep people safe.`,
      notes: [
        "This is a safe local demo run (deterministic).",
        "Replace this with real model inference once your compute model endpoint is ready.",
      ],
      ranAt: nowIso(),
    };
  } else if (params.project.exampleId === "homework-helper") {
    const questionRaw = typeof input === "string" ? input : JSON.stringify(input);
    const question = clampStr(questionRaw || "How do I solve 2x + 5 = 15?", 300);

    // Very small, deterministic “teaching” solver for simple linear equations.
    // This is intentionally limited: it is a safe demo, not a full math engine.
    const matched = question.replace(/\s+/g, " ").match(/(\d+)\s*x\s*\+\s*(\d+)\s*=\s*(\d+)/i);
    let outputObj: any;
    if (matched) {
      const a = Number(matched[1]);
      const b = Number(matched[2]);
      const c = Number(matched[3]);
      const step1 = `Subtract ${b} from both sides → ${a}x = ${c - b}`;
      const step2 = `Divide both sides by ${a} → x = ${(c - b) / a}`;
      outputObj = {
        question,
        steps: [step1, step2],
        answer: `x = ${(c - b) / a}`,
        safety: {
          mode: "safe-demo",
          note: "Deterministic demo: handles only a simple ax + b = c form.",
        },
        ranAt: nowIso(),
      };
    } else {
      outputObj = {
        question,
        steps: [
          "Rewrite the problem in a simpler form (remove extra words).",
          "Identify what is being asked.",
          "Show one step at a time, and check your result at the end.",
        ],
        answer: "This demo can only solve simple equations like 2x + 5 = 15.",
        safety: {
          mode: "safe-demo",
          note: "Deterministic demo: not a general solver.",
        },
        ranAt: nowIso(),
      };
    }
    output = outputObj;
  } else if (params.project.exampleId === "customer-support-bot") {
    const questionRaw = typeof input === "string" ? input : JSON.stringify(input);
    const question = clampStr(questionRaw || "How do I return an item?", 300);
    const q = question.toLowerCase();

    let reply =
      "I can help with orders, returns, delivery, and account questions. Tell me what you need, and include your order number if you have one.";
    if (q.includes("return")) {
      reply =
        "To return an item: 1) Sign in, 2) Open Orders, 3) Select the item, 4) Choose Return, 5) Print the label, 6) Drop it off. If the item is damaged, contact support first.";
    } else if (q.includes("refund")) {
      reply =
        "Refunds usually process after the return is received. Check your Orders page for the status. If it has been more than 7 days since delivery, contact support with your order number.";
    } else if (q.includes("delivery") || q.includes("shipping")) {
      reply =
        "For delivery updates, check the tracking link in your Orders page. If tracking has not updated for 48 hours, contact support and include your order number.";
    } else if (q.includes("password") || q.includes("sign in") || q.includes("login")) {
      reply =
        "If you cannot sign in, use the password reset link on the sign-in page. If you do not receive the email, check spam and confirm the address is correct.";
    }

    output = {
      question,
      reply,
      safety: {
        mode: "safe-demo",
        note: "Deterministic demo: no external model calls.",
      },
      ranAt: nowIso(),
    };
  } else {
    // Generic fallback: return the example preview output if present.
    output =
      example?.preview?.output ?? {
        message: "This template does not have a runnable demo yet.",
        next: "Pick a different example or add a runnable demo for this project type.",
      };
  }

  const end = typeof performance !== "undefined" ? performance.now() : Date.now();
  const durationMs = Math.max(0, Math.round(end - start));

  const inputBytes = byteSize(input);
  const outputBytes = byteSize(output);

  const receipt: AIStudioRunReceipt = {
    runId,
    mode: "local",
    durationMs,
    inputBytes,
    outputBytes,
    freeTierAppliedMs: durationMs,
    paidMs: 0,
    creditsCharged: 0,
    remainingCredits: null,
    guidanceTips: [
      "Start with a small prompt, then add detail.",
      "Write what success looks like before you run.",
      "Save outputs you like, then iterate in small steps.",
    ],
  };

  return { output, receipt };
}

