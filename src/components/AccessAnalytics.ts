"use client";

import { useAnalytics } from "@/hooks/useAnalytics";
import { useEffect } from "react";

type Props = {
  event: "access_gate_locked" | "access_gate_click";
  payload?: Record<string, any>;
  children?: React.ReactNode;
};

export default function AccessAnalytics({ event, payload, children }: Props) {
  const analytics = useAnalytics();

  useEffect(() => {
    analytics.track({ type: event as any, ...(payload || {}) } as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return children || null;
}


