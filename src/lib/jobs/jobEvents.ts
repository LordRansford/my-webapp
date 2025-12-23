import { prisma } from "@/lib/db/prisma";

export async function createJobEvent(params: {
  jobId: string;
  level: "info" | "warn" | "error";
  message: string;
  data?: any;
}) {
  const jobEvent = (prisma as any).jobEvent as { create: (args: any) => Promise<any> };
  await jobEvent.create({ data: { jobId: params.jobId, level: params.level, message: params.message, data: params.data ?? null } });
}


