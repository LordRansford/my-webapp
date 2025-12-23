import { prisma } from "@/lib/db/prisma";

export type ProjectTopic = "ai" | "cyber" | "software" | "data" | "digitalisation";

export async function createProject(params: {
  ownerId: string | null;
  workspaceSessionId: string | null;
  title: string;
  topic: ProjectTopic;
}) {
  const project = (prisma as any).project as { create: (args: any) => Promise<any> };
  return project.create({
    data: {
      ownerId: params.ownerId,
      workspaceSessionId: params.workspaceSessionId,
      title: params.title,
      topic: params.topic,
    },
  });
}

export async function listProjects(params: { ownerId: string | null; workspaceSessionId: string | null; q?: string }) {
  const project = (prisma as any).project as { findMany: (args: any) => Promise<any[]> };
  const where: any = params.ownerId
    ? { ownerId: params.ownerId }
    : { ownerId: null, workspaceSessionId: params.workspaceSessionId };
  if (params.q) where.title = { contains: params.q };
  return project.findMany({ where, orderBy: { updatedAt: "desc" }, take: 50 });
}

export async function getProject(params: { projectId: string }) {
  const project = (prisma as any).project as { findUnique: (args: any) => Promise<any> };
  return project.findUnique({
    where: { id: params.projectId },
    include: { runs: { orderBy: { startedAt: "desc" } }, notes: { orderBy: { createdAt: "desc" } } },
  });
}

export async function createRun(params: {
  projectId: string;
  toolId: string;
  status: string;
  inputJson: any;
}) {
  const run = (prisma as any).run as { create: (args: any) => Promise<any> };
  return run.create({
    data: {
      projectId: params.projectId,
      toolId: params.toolId,
      status: params.status,
      startedAt: new Date(),
      inputJson: params.inputJson ?? null,
    },
  });
}

export async function updateRun(params: {
  runId: string;
  status: string;
  outputJson?: any;
  metricsJson?: any;
  errorJson?: any;
}) {
  const run = (prisma as any).run as { update: (args: any) => Promise<any> };
  return run.update({
    where: { id: params.runId },
    data: {
      status: params.status,
      finishedAt: new Date(),
      outputJson: params.outputJson ?? null,
      metricsJson: params.metricsJson ?? null,
      errorJson: params.errorJson ?? null,
    },
  });
}

export async function createNote(params: { projectId: string; runId: string | null; content: string }) {
  const note = (prisma as any).note as { create: (args: any) => Promise<any> };
  return note.create({ data: { projectId: params.projectId, runId: params.runId, content: params.content.slice(0, 8000) } });
}

export async function claimWorkspace(params: { ownerId: string; workspaceSessionId: string }) {
  const project = (prisma as any).project as { updateMany: (args: any) => Promise<any> };
  return project.updateMany({
    where: { ownerId: null, workspaceSessionId: params.workspaceSessionId },
    data: { ownerId: params.ownerId },
  });
}


