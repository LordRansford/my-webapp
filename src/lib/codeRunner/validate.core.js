const MAX_CODE_CHARS = 6000;

const JS_BLOCKLIST = ["fetch", "XMLHttpRequest", "WebSocket", "navigator.sendBeacon"];
const PY_BLOCKLIST = ["socket", "urllib", "requests", "http.client"];

function includesAny(haystack, needles) {
  const h = haystack.toLowerCase();
  return needles.find((n) => h.includes(n.toLowerCase())) || null;
}

export function validateCodeRunnerPayload(payload) {
  if (!payload || typeof payload !== "object") return { ok: false, error: "Invalid payload." };
  const language = payload.language;
  const code = payload.code;

  if (language !== "js" && language !== "py") return { ok: false, error: "Unsupported language." };
  if (typeof code !== "string") return { ok: false, error: "Code must be a string." };
  if (code.length > MAX_CODE_CHARS) return { ok: false, error: "Code is too large." };

  const bad = language === "js" ? includesAny(code, JS_BLOCKLIST) : includesAny(code, PY_BLOCKLIST);
  if (bad) {
    return {
      ok: false,
      error: `This sandbox does not allow network access. Remove "${bad}" and try again.`,
    };
  }

  const input = payload.input;
  if (input != null && typeof input !== "string") return { ok: false, error: "Input must be a string." };
  if (input && input.length > 10_000) return { ok: false, error: "Input is too large." };

  return { ok: true, language, code, input: input || "" };
}


