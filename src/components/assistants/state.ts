"use client";

export type AssistantsOpenState = {
  professorOpen: boolean;
  feedbackOpen: boolean;
};

const KEY = "rn_assistants_open_state_v1";

export function readAssistantsOpenState(): AssistantsOpenState {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return { professorOpen: false, feedbackOpen: false };
    const p = JSON.parse(raw);
    return { professorOpen: Boolean(p?.professorOpen), feedbackOpen: Boolean(p?.feedbackOpen) };
  } catch {
    return { professorOpen: false, feedbackOpen: false };
  }
}

export function writeAssistantsOpenState(next: AssistantsOpenState) {
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}

export function enforceOneOpen(next: AssistantsOpenState): AssistantsOpenState {
  if (next.professorOpen && next.feedbackOpen) return { professorOpen: next.professorOpen, feedbackOpen: false };
  return next;
}


