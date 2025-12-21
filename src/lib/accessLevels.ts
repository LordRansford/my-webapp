export type AccessLevel = "public" | "registered" | "supporter" | "professional";

// Intent (non user-facing, mutually exclusive roles):
// public: anonymous browsing, reading notes, limited tools.
// registered: saved progress, quizzes, basic labs.
// supporter: advanced tools, templates, downloads, certificates.
// professional: future enterprise features, audits, institutional use.
export const AccessOrder: AccessLevel[] = ["public", "registered", "supporter", "professional"];

export function meetsAccess(required: AccessLevel, actual: AccessLevel) {
  return AccessOrder.indexOf(actual) >= AccessOrder.indexOf(required);
}


