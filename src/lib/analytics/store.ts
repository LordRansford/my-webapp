export type AnalyticsEventType =
  | "section_started"
  | "section_completed"
  | "quiz_attempted"
  | "quiz_completed"
  | "tool_used";

export type AnalyticsEvent = {
  type: AnalyticsEventType;
  timestamp: string;
  trackId?: string;
  levelId?: string;
  sectionId?: string;
  quizId?: string;
  success?: boolean;
  toolId?: string;
};

// TS wrapper around the JS core module so Node tests can import the core without TS transpilation.
const core = require("./store.core.js");

export const appendAnalyticsEvents: (userId: string, events: AnalyticsEvent[]) => any = core.appendAnalyticsEvents;
export const getUserAnalytics: (userId: string) => any = core.getUserAnalytics;
export const getOwnerAnalyticsSummary: () => any = core.getOwnerAnalyticsSummary;


