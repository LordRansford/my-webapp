"use client";

import { NotesProvider } from "@/components/notes/NotesProvider";
import AuthSessionProvider from "@/components/auth/SessionProvider";

export function Providers({ children }) {
  return (
    <AuthSessionProvider>
      <NotesProvider>{children}</NotesProvider>
    </AuthSessionProvider>
  );
}
