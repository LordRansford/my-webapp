"use client";

import { NotesProvider } from "@/components/notes/NotesProvider";
import AuthSessionProvider from "@/components/auth/SessionProvider";
import { MusicProvider } from "@/components/spotify/MusicProvider";
import { AccessibilityProvider } from "@/components/accessibility/AccessibilityProvider";

export function Providers({ children }) {
  return (
    <AuthSessionProvider>
      <NotesProvider>
        <MusicProvider>
          <AccessibilityProvider>{children}</AccessibilityProvider>
        </MusicProvider>
      </NotesProvider>
    </AuthSessionProvider>
  );
}
