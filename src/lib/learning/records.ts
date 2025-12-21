export type CompletionStatus = "not_started" | "in_progress" | "completed";

export type LearningRecord = {
  userId: string;
  courseId: string;
  levelId: string;
  sectionsCompleted: number;
  quizzesCompleted: number;
  toolsUsed: number;
  timeSpentMinutes: number;
  completionStatus: CompletionStatus;
  completionDate: string | null;
  updatedAt: string;
};

const core = require("./records.core.js");

export const calculateEarnedMinutes: (params: {
  estimatedMinutes: number;
  sectionsCompleted: number;
  quizzesCompleted: number;
  toolsUsed: number;
}) => number = core.calculateEarnedMinutes;

export const deriveLearningRecord: (input: any) => LearningRecord = core.deriveLearningRecord;
export const upsertLearningRecord: (record: LearningRecord) => LearningRecord = core.upsertLearningRecord;
export const listLearningRecordsForUser: (userId: string) => LearningRecord[] = core.listLearningRecordsForUser;


