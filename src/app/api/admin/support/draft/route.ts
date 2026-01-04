import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { rateLimit } from "@/lib/security/rateLimit";
import { requireSameOrigin } from "@/lib/security/origin";

type Body = {
  message?: string;
  referenceCode?: string;
  courseId?: string;
  levelId?: string;
  pageUrl?: string;
};

function clean(input: unknown, maxLen: number) {
  const raw = typeof input === "string" ? input : "";
  return raw.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, maxLen);
}

function classify(message: string) {
  const m = message.toLowerCase();
  if (m.includes("payment") || m.includes("stripe") || m.includes("checkout")) return "billing";
  if (m.includes("sign in") || m.includes("signin") || m.includes("google")) return "auth";
  if (m.includes("assessment") || m.includes("certificate") || m.includes("cpd")) return "cpd";
  if (m.includes("tool") || m.includes("lab") || m.includes("error")) return "tools";
  return "general";
}

function buildDraft(params: { message: string; referenceCode: string; courseId: string; levelId: string; pageUrl: string }) {
  const category = classify(params.message);
  const intro = "Thanks for your message. I can help.";
  const ref = params.referenceCode ? `Reference ${params.referenceCode}.` : "";
  const context = [params.courseId, params.levelId, params.pageUrl].filter(Boolean).join(" ");
  const steps =
    category === "cpd"
      ? [
          "Please try Professor Ransford first so you get an instant explanation and the right link.",
          "If you still need help, reply with the exact question you are stuck on and the page link.",
          "If this is during an assessment, submit first. Then we can review your feedback and revision plan.",
        ]
      : category === "auth"
      ? [
          "Please try signing out and back in.",
          "If it still fails, open the status page and confirm Google sign in is configured.",
          "Reply with the exact error message and the time it happened.",
        ]
      : category === "billing"
      ? [
          "Please confirm the payment status in your Stripe receipt email.",
          "If the site did not unlock, reply with the reference and the email used to sign in.",
          "I will check and fix it.",
        ]
      : category === "tools"
      ? [
          "Please tell me which tool you used and what you entered.",
          "If it needs secure compute, confirm you are signed in and have credits.",
          "I will reply with a specific fix and a safer workflow.",
        ]
      : [
          "Please share the page link and what you expected.",
          "If you can, include a screenshot.",
          "I will reply with next steps.",
        ];

  const body = [intro, ref, context ? `Context ${context}.` : "", "", ...steps].filter(Boolean).join("\n");
  return { category, draftReply: body };
}

export async function POST(req: Request) {
  const adminBlock = requireAdmin(req);
  if (adminBlock) return adminBlock;

  const originBlock = requireSameOrigin(req);
  if (originBlock) return originBlock;

  const limited = rateLimit(req, { keyPrefix: "admin-support-draft", limit: 30, windowMs: 60_000 });
  if (limited) return limited;

  const body = (await req.json().catch(() => null)) as Body | null;
  const message = clean(body?.message, 2400);
  const referenceCode = clean(body?.referenceCode, 80);
  const courseId = clean(body?.courseId, 60);
  const levelId = clean(body?.levelId, 60);
  const pageUrl = clean(body?.pageUrl, 200);

  if (!message) return NextResponse.json({ message: "Invalid message" }, { status: 400 });

  const out = buildDraft({ message, referenceCode, courseId, levelId, pageUrl });
  return NextResponse.json(out, { status: 200 });
}

