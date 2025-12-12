"use client";

import { createContext, useContext, useMemo, useState } from "react";

const NotesContext = createContext(null);

const defaultPrefs = {
  institutionalMode: false,
  hideTools: false,
  hideQuizzes: false,
};

export function NotesProvider({ children }) {
  const [prefs, setPrefs] = useState(defaultPrefs);

  const value = useMemo(
    () => ({
      prefs,
      setPrefs,
      toggleInstitutionalMode: () => setPrefs((p) => ({ ...p, institutionalMode: !p.institutionalMode })),
      toggleTools: () => setPrefs((p) => ({ ...p, hideTools: !p.hideTools })),
      toggleQuizzes: () => setPrefs((p) => ({ ...p, hideQuizzes: !p.hideQuizzes })),
    }),
    [prefs]
  );

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}

export function useNotes() {
  const ctx = useContext(NotesContext);
  if (!ctx) {
    throw new Error("useNotes must be used within NotesProvider");
  }
  return ctx;
}
