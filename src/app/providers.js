"use client";

import { NotesProvider } from "@/components/notes/NotesProvider";

export function Providers({ children }) {
  return <NotesProvider>{children}</NotesProvider>;
}
