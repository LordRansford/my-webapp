import { listLearningRecordsForUser } from "@/lib/learning/records";
import { listCertificatesForUser } from "@/lib/certificates/list";

export function getAccountLearningSummary(userId: string) {
  const records = listLearningRecordsForUser(userId);
  const certificates = listCertificatesForUser(userId);

  const coursesStarted = new Set(records.map((r) => r.courseId)).size;
  const coursesCompleted = records.filter((r) => r.completionStatus === "completed").length;
  const totalMinutes = records.reduce((sum, r) => sum + (Number(r.timeSpentMinutes) || 0), 0);

  return {
    coursesStarted,
    coursesCompleted,
    totalCpdHours: Math.round((totalMinutes / 60) * 10) / 10,
    certificatesEarned: certificates.length,
  };
}


