"use client";

export type AssistantsOpenState = {
  mentorOpen: boolean;
  feedbackOpen: boolean;
};

const KEY = "rn_assistants_open_state_v1";

export function readAssistantsOpenState(): AssistantsOpenState {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return { mentorOpen: false, feedbackOpen: false };
    const p = JSON.parse(raw);
    return { mentorOpen: Boolean(p?.mentorOpen), feedbackOpen: Boolean(p?.feedbackOpen) };
  } catch {
    return { mentorOpen: false, feedbackOpen: false };
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
  if (next.mentorOpen && next.feedbackOpen) return { mentorOpen: next.mentorOpen, feedbackOpen: false };
  return next;
}


