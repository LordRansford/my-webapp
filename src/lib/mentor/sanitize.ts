const MAX_LEN = 320;
const banned = ["medical", "doctor", "diagnosis", "legal", "lawsuit", "attorney", "politics", "election", "crypto", "stock"];

export function sanitizeQuestion(input: string): { ok: boolean; cleaned: string; reason?: string } {
  if (!input) return { ok: false, cleaned: "", reason: "empty" };
  const stripped = input.replace(/<[^>]+>/g, " ").trim();
  if (stripped.length > MAX_LEN) return { ok: false, cleaned: "", reason: "too_long" };
  const lower = stripped.toLowerCase();
  if (banned.some((w) => lower.includes(w))) return { ok: false, cleaned: "", reason: "out_of_scope" };
  return { ok: true, cleaned: stripped };
}


