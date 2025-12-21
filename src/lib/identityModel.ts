export type UserRole = "public" | "registered" | "supporter" | "professional";

export type Identity = {
  id: string;
  email: string;
  displayName?: string | null;
  authProvider: "email" | "google" | "github" | "unknown";
  createdAt: string;
  lastLoginAt: string;
  role: UserRole;
  supporterSince?: string | null;
  supporterTier?: string | null;
};

// Roles are server-controlled only. Email is the unique identifier. Role defaults to "registered".

