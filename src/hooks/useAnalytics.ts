import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";

type AnalyticsEvent = {
  type: "section_started" | "section_completed" | "quiz_attempted" | "quiz_completed" | "tool_used";
  timestamp?: string;
  trackId?: string;
  levelId?: string;
  sectionId?: string;
  quizId?: string;
  success?: boolean;
  toolId?: string;
};

export function useAnalytics() {
  const { data: session } = useSession();
  const userId = session?.user?.id || null;

  const [consented, setConsented] = useState(false);
  const queueRef = useRef<AnalyticsEvent[]>([]);
  const flushTimerRef = useRef<any>(null);

  useEffect(() => {
    if (!userId) {
      setConsented(false);
      queueRef.current = [];
      return;
    }
    fetch("/api/account/profile")
      .then((r) => r.json())
      .then((d) => {
        const acceptedAt = d?.user?.consent?.cpdDataUseAcceptedAt;
        setConsented(Boolean(acceptedAt));
      })
      .catch(() => setConsented(false));
  }, [userId]);

  const flush = async () => {
    if (!userId || !consented) {
      queueRef.current = [];
      return;
    }
    const events = queueRef.current.splice(0, queueRef.current.length);
    if (!events.length) return;
    try {
      await fetch("/api/analytics/events", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ events }),
      });
    } catch {
      // keep best effort; drop events rather than retry loops
    }
  };

  const track = (event: AnalyticsEvent) => {
    if (!userId || !consented) return;
    queueRef.current.push({ ...event, timestamp: new Date().toISOString() });
    if (queueRef.current.length >= 20) {
      void flush();
      return;
    }
    if (flushTimerRef.current) clearTimeout(flushTimerRef.current);
    flushTimerRef.current = setTimeout(() => void flush(), 1200);
  };

  useEffect(() => {
    return () => {
      if (flushTimerRef.current) clearTimeout(flushTimerRef.current);
    };
  }, []);

  // Returning plain functions is fine here; we keep writes debounced and best-effort.
  return { consented, track, flush };
}


