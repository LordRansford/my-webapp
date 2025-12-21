import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { listLearningRecordsForUser } from "@/lib/learning/records";
import { listCertificatesForUser } from "@/lib/certificates/list";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) return res.status(401).json({ message: "Unauthorized" });

  const records = listLearningRecordsForUser(session.user.id);
  const certificates = listCertificatesForUser(session.user.id);

  const coursesStarted = new Set(records.map((r) => r.courseId)).size;
  const coursesCompleted = records.filter((r) => r.completionStatus === "completed").length;
  const totalMinutes = records.reduce((sum, r) => sum + (Number(r.timeSpentMinutes) || 0), 0);

  res.status(200).json({
    email: session.user.email || null,
    displayName: session.user.name || null,
    coursesStarted,
    coursesCompleted,
    totalCpdHours: Math.round((totalMinutes / 60) * 10) / 10,
    certificatesEarned: certificates.length,
  });
}


