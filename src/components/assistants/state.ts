"use client";

export type AssistantsOpenState = {
  feedbackOpen: boolean;
};

const KEY = "rn_assistants_open_state_v1";

export function readAssistantsOpenState(): AssistantsOpenState {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return { feedbackOpen: false };
    const p = JSON.parse(raw);
    return { feedbackOpen: Boolean(p?.feedbackOpen) };
  } catch {
    return { feedbackOpen: false };
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
  return next;
}


