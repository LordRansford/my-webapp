import { addFeedback, hasFeedbackForSession } from "@/lib/feedback/store";
import { AppError } from "@/server/errors";

const HEARD_OPTIONS = ["Family", "Friend", "Work colleague", "Other"] as const;

export type FeedbackPayload = {
  name?: string;
  heardFrom: (typeof HEARD_OPTIONS)[number];
  message: string;
  rateClarity?: number;
  rateUsefulness?: number;
  url?: string;
  sessionId: string;
};

export function submitFeedback(raw: any) {
  const name = typeof raw?.name === "string" ? raw.name.trim().slice(0, 120) : "";
  const heardFrom = typeof raw?.heardFrom === "string" ? raw.heardFrom : "";
  const message = typeof raw?.message === "string" ? raw.message.trim() : "";
  const rateClarity = Number.isFinite(raw?.rateClarity) ? Number(raw.rateClarity) : undefined;
  const rateUsefulness = Number.isFinite(raw?.rateUsefulness) ? Number(raw.rateUsefulness) : undefined;
  const url = typeof raw?.url === "string" ? raw.url.trim().slice(0, 400) : "";
  const sessionId = typeof raw?.sessionId === "string" ? raw.sessionId.slice(0, 64) : "";

  if (!HEARD_OPTIONS.includes(heardFrom as any)) {
    throw new AppError({ code: "VALIDATION_ERROR", status: 400, message: "Invalid heardFrom", exposeMessage: "Invalid source." });
  }
  if (!sessionId) {
    throw new AppError({ code: "VALIDATION_ERROR", status: 400, message: "Missing sessionId", exposeMessage: "Session missing." });
  }
  if (hasFeedbackForSession(sessionId)) {
    throw new AppError({
      code: "VALIDATION_ERROR",
      status: 409,
      message: "Duplicate session feedback",
      exposeMessage: "Feedback already submitted in this session.",
    });
  }
  if (!message || message.length < 4 || message.length > 1500) {
    throw new AppError({
      code: "VALIDATION_ERROR",
      status: 400,
      message: "Invalid message length",
      exposeMessage: "Feedback must be between 4 and 1500 characters.",
    });
  }
  if (rateClarity !== undefined && (rateClarity < 1 || rateClarity > 5)) {
    throw new AppError({ code: "VALIDATION_ERROR", status: 400, message: "Invalid rateClarity", exposeMessage: "Invalid clarity rating." });
  }
  if (rateUsefulness !== undefined && (rateUsefulness < 1 || rateUsefulness > 5)) {
    throw new AppError({
      code: "VALIDATION_ERROR",
      status: 400,
      message: "Invalid rateUsefulness",
      exposeMessage: "Invalid usefulness rating.",
    });
  }

  addFeedback({
    sessionId,
    name: name || undefined,
    heardFrom: heardFrom as any,
    message,
    rateClarity,
    rateUsefulness,
    url: url || "/feedback",
  });

  return { ok: true };
}


