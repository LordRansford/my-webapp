import { prisma } from "@/lib/db/prisma";
import { AppError } from "@/server/errors";

const HEARD_OPTIONS = ["Family", "Friend", "Work colleague", "Other"] as const;
const SCREENSHOT_MAX_LEN = 900_000; // conservative cap for data URL length

function autoCategory(input: { message: string; url: string; pageTitle: string }) {
  const m = `${input.message || ""} ${input.pageTitle || ""} ${input.url || ""}`.toLowerCase();
  if (m.includes("payment") || m.includes("stripe") || m.includes("checkout") || m.includes("card")) return "billing";
  if (m.includes("sign in") || m.includes("signin") || m.includes("login") || m.includes("google")) return "auth";
  if (m.includes("cpd") || m.includes("certificate") || m.includes("assessment")) return "cpd";
  if (m.includes("tool") || m.includes("/tools") || m.includes("lab")) return "tools";
  if (m.includes("mobile") || m.includes("iphone") || m.includes("android") || m.includes("responsive")) return "mobile";
  if (m.includes("bug") || m.includes("broken") || m.includes("error") || m.includes("crash")) return "bug";
  if (m.includes("search") || m.includes("read aloud") || m.includes("speech")) return "accessibility";
  return "general";
}

export type FeedbackPayload = {
  name?: string;
  heardFrom: (typeof HEARD_OPTIONS)[number];
  message: string;
  rateClarity?: number;
  rateUsefulness?: number;
  url?: string;
  sessionId: string;
};

export async function submitFeedback(raw: any) {
  const name = typeof raw?.name === "string" ? raw.name.trim().slice(0, 120) : "";
  const pageTitle = typeof raw?.pageTitle === "string" ? raw.pageTitle.trim().slice(0, 140) : "";
  const category = typeof raw?.category === "string" ? raw.category.trim().slice(0, 40) : "";
  const followUp = typeof raw?.followUp === "string" ? raw.followUp.trim().slice(0, 600) : "";
  const clientSummary = typeof raw?.clientSummary === "string" ? raw.clientSummary.trim().slice(0, 500) : "";
  const heardFrom =
    typeof raw?.heardFrom === "string"
      ? raw.heardFrom
      : typeof raw?.source === "string"
      ? raw.source
      : "";
  const message = typeof raw?.message === "string" ? raw.message.trim() : "";
  const url =
    typeof raw?.url === "string"
      ? raw.url.trim().slice(0, 400)
      : typeof raw?.pageUrl === "string"
      ? raw.pageUrl.trim().slice(0, 400)
      : "";
  const sessionId = typeof raw?.sessionId === "string" ? raw.sessionId.slice(0, 64) : "";

  const screenshot = raw?.screenshot && typeof raw.screenshot === "object" ? raw.screenshot : null;
  const screenshotName = typeof screenshot?.name === "string" ? screenshot.name.trim().slice(0, 120) : "";
  const screenshotType = typeof screenshot?.type === "string" ? screenshot.type.trim().slice(0, 80) : "";
  const screenshotDataUrl = typeof screenshot?.dataUrl === "string" ? screenshot.dataUrl.trim() : "";

  if (!HEARD_OPTIONS.includes(heardFrom as any)) {
    throw new AppError({ code: "VALIDATION_ERROR", status: 400, message: "Invalid heardFrom", exposeMessage: "Invalid source." });
  }
  if (!sessionId) {
    throw new AppError({ code: "VALIDATION_ERROR", status: 400, message: "Missing sessionId", exposeMessage: "Session missing." });
  }
  if (!message || message.length < 4 || message.length > 1500) {
    throw new AppError({
      code: "VALIDATION_ERROR",
      status: 400,
      message: "Invalid message length",
      exposeMessage: "Feedback must be between 4 and 1500 characters.",
    });
  }

  if (screenshotDataUrl) {
    if (!screenshotType.startsWith("image/")) {
      throw new AppError({ code: "VALIDATION_ERROR", status: 400, message: "Invalid screenshot type", exposeMessage: "Screenshot must be an image." });
    }
    if (!screenshotDataUrl.startsWith("data:image/")) {
      throw new AppError({ code: "VALIDATION_ERROR", status: 400, message: "Invalid screenshot data", exposeMessage: "Screenshot data invalid." });
    }
    if (screenshotDataUrl.length > SCREENSHOT_MAX_LEN) {
      throw new AppError({ code: "VALIDATION_ERROR", status: 413, message: "Screenshot too large", exposeMessage: "Screenshot is too large." });
    }
  }

  const already = await prisma.feedbackSubmission.findFirst({ where: { sessionId } });
  if (already) {
    throw new AppError({
      code: "VALIDATION_ERROR",
      status: 409,
      message: "Duplicate session feedback",
      exposeMessage: "Feedback already submitted in this session.",
    });
  }

  const resolvedCategory = category || autoCategory({ message, url, pageTitle });

  await prisma.feedbackSubmission.create({
    data: {
      sessionId,
      name: name || null,
      source: heardFrom,
      pageUrl: url || "/feedback",
      pageTitle: pageTitle || null,
      category: resolvedCategory || null,
      followUp: followUp || null,
      clientSummary: clientSummary || null,
      message,
      screenshotName: screenshotDataUrl ? screenshotName || null : null,
      screenshotType: screenshotDataUrl ? screenshotType || null : null,
      screenshotDataUrl: screenshotDataUrl ? screenshotDataUrl : null,
    },
  });

  return { ok: true };
}


