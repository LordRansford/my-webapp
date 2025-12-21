"use client";

import { useEffect, useMemo, useState } from "react";
import { useCPD } from "@/hooks/useCPD";
import { resolveTrackId } from "@/lib/cpd";
import SaveProgressPrompt from "@/components/auth/SaveProgressPrompt";
import { useAnalytics } from "@/hooks/useAnalytics";

export default function QuizBlock({
  id,
  title = "Quiz",
  questions = [],
  courseId,
  levelId,
  sectionId,
}) {
  const storageKey = id ? `quiz-block-${id}` : "quiz-block";
  const [answers, setAnswers] = useState({});
  const [hasAwarded, setHasAwarded] = useState(false);
  const { state, updateSection, isAuthed } = useCPD();
  const { track } = useAnalytics();
  const trackId = courseId ? resolveTrackId(courseId) : null;
  const [showSavePrompt, setShowSavePrompt] = useState(false);
  const [attemptTracked, setAttemptTracked] = useState(false);

  const existingSection = useMemo(() => {
    if (!trackId || !levelId || !sectionId) return null;
    return state.sections.find(
      (section) =>
        section.trackId === trackId &&
        section.levelId === levelId &&
        section.sectionId === sectionId
    );
  }, [state.sections, trackId, levelId, sectionId]);

  const alreadyCompleted = Boolean(existingSection?.completed);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      try {
        setAnswers(JSON.parse(saved));
      } catch {
        // ignore bad data
      }
    }
  }, [storageKey]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(storageKey, JSON.stringify(answers));
  }, [answers, storageKey]);

  const allAnswered = useMemo(
    () => questions.length > 0 && questions.every((_, idx) => answers[idx]?.open),
    [questions, answers]
  );

  useEffect(() => {
    if (!attemptTracked && isAuthed && id) {
      const anyOpened = questions.length > 0 && questions.some((_, idx) => Boolean(answers[idx]?.open));
      if (anyOpened) {
        track({ type: "quiz_attempted", quizId: id, trackId: trackId || undefined, levelId, sectionId });
        setAttemptTracked(true);
      }
    }
  }, [attemptTracked, answers, isAuthed, id, questions, track, trackId, levelId, sectionId]);

  useEffect(() => {
    if (!trackId || !levelId || !sectionId) return;
    if (!allAnswered || alreadyCompleted || hasAwarded) return;
    if (!isAuthed) {
      setShowSavePrompt(true);
      return;
    }

    if (id) track({ type: "quiz_completed", quizId: id, trackId: trackId || undefined, levelId, sectionId, success: true });
    updateSection({
      trackId,
      levelId,
      sectionId,
      completed: true,
      minutesDelta: 5,
      note: id ? `Completed quiz ${id}` : "Completed quiz",
    });
    setHasAwarded(true);
  }, [allAnswered, alreadyCompleted, hasAwarded, trackId, levelId, sectionId, updateSection, id, isAuthed, track]);

  return (
    <section className="my-6 w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-semibold text-gray-900 break-words">{title}</p>
      <div className="mt-3 space-y-3">
        {questions.map((q, idx) => {
          const isOpen = answers[idx]?.open;
          const questionText = q?.q ?? q?.question ?? "";
          const answerText = q?.a ?? q?.answer ?? "Answer not provided.";
          return (
            <div key={idx} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
              <p className="text-sm font-medium text-gray-900 break-words whitespace-pre-wrap">{questionText}</p>
              <button
                className="mt-2 rounded-full border px-3 py-1 text-xs text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring focus:ring-blue-200 w-full sm:w-auto text-center"
                onClick={() =>
                  setAnswers((prev) => ({
                    ...prev,
                    [idx]: { open: !isOpen },
                  }))
                }
              >
                {isOpen ? "Hide answer" : "Show answer"}
              </button>
              {isOpen ? (
                <p className="mt-2 text-sm text-gray-800 break-words whitespace-pre-wrap">
                  {answerText}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
      {showSavePrompt && !isAuthed ? <SaveProgressPrompt /> : null}
    </section>
  );
}
