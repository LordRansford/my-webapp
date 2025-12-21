"use client";

import { SessionProvider } from "next-auth/react";

export default function AuthSessionProvider({ children }) {
  // Passwordless auth only (magic link + OAuth) reduces security risk (no password storage/reset)
  // and lowers support burden while keeping a smooth UX.
  return <SessionProvider>{children}</SessionProvider>;
}


