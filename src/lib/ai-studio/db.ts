/**
 * AI Studio Database Utilities
 * 
 * Database helpers and Prisma client for AI Studio
 */

import crypto from "crypto";

// Try to import Prisma client, fallback to simulated if not available
let prisma: any = null;
let prismaAvailable = false;

try {
  try {
    const prismaModule = require("@/lib/db/prisma");
    prisma = prismaModule.prisma || prismaModule.default?.prisma || prismaModule.default;
    prismaAvailable = !!prisma;
  } catch {
    const { PrismaClient } = require("@prisma/client");
    prisma = new PrismaClient();
    prismaAvailable = !!prisma;
  }
} catch (error) {
  if (process.env.NODE_ENV !== "production") {
    console.warn("[AI Studio DB] Prisma not available, using simulated responses");
  }
}

const USE_SIMULATED = !prismaAvailable || process.env.AI_STUDIO_USE_SIMULATED === "true";

// ============================================================================
// Dataset Functions
// ============================================================================

export async function getDataset(datasetId: string, userId: string) {
  if (USE_SIMULATED || !prisma) {
    return null;
  }

  try {
    if (prisma.dataset) {
      return await prisma.dataset.findFirst({
        where: {
          id: datasetId,
          userId: userId,
          deletedAt: null,
        },
      });
    }
    return null;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[AI Studio DB] Dataset model not found, using simulated response");
    }
    return null;
  }
}

export async function createDataset(data: {
  userId: string;
  name: string;
  description?: string;
  type: string;
  size: number;
  filePath: string;
  license: string;
  status?: string;
}) {
  if (USE_SIMULATED || !prisma) {
    return {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  try {
    if (prisma.dataset) {
      return await prisma.dataset.create({
        data: {
          userId: data.userId,
          name: data.name,
          description: data.description,
          type: data.type,
          size: data.size,
          filePath: data.filePath,
          license: data.license,
          status: data.status || "uploaded",
        },
      });
    }
    
    return {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error("[AI Studio DB] Error creating dataset:", error);
    return {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}

export async function updateDataset(
  datasetId: string,
  userId: string,
  updates: Partial<{
    name: string;
    description: string;
    license: string;
    status: string;
  }>
) {
  if (USE_SIMULATED || !prisma) {
    return {
      id: datasetId,
      ...updates,
      updatedAt: new Date(),
    };
  }

  try {
    if (prisma?.dataset) {
      const dataset = await prisma.dataset.updateMany({
        where: {
          id: datasetId,
          userId: userId,
          deletedAt: null,
        },
        data: {
          ...(updates.name && { name: updates.name }),
          ...(updates.description !== undefined && { description: updates.description }),
          ...(updates.license && { license: updates.license }),
          ...(updates.status && { status: updates.status }),
          updatedAt: new Date(),
        },
      });
      if (dataset.count === 0) return null;
      return getDataset(datasetId, userId);
    }
    return {
      id: datasetId,
      ...updates,
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error("[AI Studio DB] Error updating dataset:", error);
    throw error;
  }
}

export async function deleteDataset(datasetId: string, userId: string) {
  if (USE_SIMULATED || !prisma) {
    return;
  }

  try {
    if (prisma?.dataset) {
      await prisma.dataset.updateMany({
        where: {
          id: datasetId,
          userId: userId,
          deletedAt: null,
        },
        data: {
          deletedAt: new Date(),
          status: "deleted",
          updatedAt: new Date(),
        },
      });
    }
  } catch (error) {
    console.error("[AI Studio DB] Error deleting dataset:", error);
    throw error;
  }
}

export async function listDatasets(userId: string, options?: {
  limit?: number;
  offset?: number;
  status?: string;
}) {
  if (USE_SIMULATED || !prisma) {
    return [];
  }

  try {
    if (prisma.dataset) {
      return await prisma.dataset.findMany({
        where: {
          userId: userId,
          deletedAt: null,
          ...(options?.status && { status: options.status }),
        },
        take: options?.limit || 50,
        skip: options?.offset || 0,
        orderBy: {
          createdAt: "desc",
        },
      });
    }
    return [];
  } catch (error) {
    console.error("[AI Studio DB] Error listing datasets:", error);
    return [];
  }
}

// ============================================================================
// Model Functions
// ============================================================================

export async function getModel(modelId: string, userId: string) {
  if (USE_SIMULATED || !prisma) {
    return null;
  }

  try {
    if (prisma.model) {
      return await prisma.model.findFirst({
        where: {
          id: modelId,
          userId: userId,
          deletedAt: null,
        },
      });
    }
    return null;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[AI Studio DB] Model not found, using simulated response");
    }
    return null;
  }
}

export async function createModel(data: {
  userId: string;
  name: string;
  description?: string;
  type: string;
  architecture: any;
  status?: string;
  version?: string;
  trainingDatasetId?: string;
  trainingConfig?: any;
  metadata?: any;
}) {
  if (USE_SIMULATED || !prisma) {
    return {
      id: crypto.randomUUID(),
      ...data,
      status: data.status || "created",
      version: data.version || "1.0.0",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  try {
    if (prisma?.model) {
      return await prisma.model.create({
        data: {
          userId: data.userId,
          name: data.name,
          description: data.description,
          type: data.type,
          architecture: data.architecture,
          status: data.status || "created",
          version: data.version || "1.0.0",
          trainingDatasetId: data.trainingDatasetId,
          trainingConfig: data.trainingConfig,
          metadata: data.metadata || {},
        },
      });
    }
    
    return {
      id: crypto.randomUUID(),
      ...data,
      status: data.status || "created",
      version: data.version || "1.0.0",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error("[AI Studio DB] Error creating model:", error);
    throw error;
  }
}

export async function updateModel(
  modelId: string,
  userId: string,
  updates: Partial<{
    name: string;
    description: string;
    architecture: any;
    status: string;
    trainingConfig: any;
    metrics: any;
  }>
) {
  if (USE_SIMULATED || !prisma) {
    return {
      id: modelId,
      ...updates,
      updatedAt: new Date(),
    };
  }

  try {
    if (prisma?.model) {
      const model = await prisma.model.updateMany({
        where: {
          id: modelId,
          userId: userId,
          deletedAt: null,
        },
        data: {
          ...(updates.name && { name: updates.name }),
          ...(updates.description !== undefined && { description: updates.description }),
          ...(updates.architecture && { architecture: updates.architecture }),
          ...(updates.status && { status: updates.status }),
          ...(updates.trainingConfig && { trainingConfig: updates.trainingConfig }),
          ...(updates.metrics && { metrics: updates.metrics }),
          updatedAt: new Date(),
        },
      });
      if (model.count === 0) return null;
      return getModel(modelId, userId);
    }
    return {
      id: modelId,
      ...updates,
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error("[AI Studio DB] Error updating model:", error);
    throw error;
  }
}

export async function deleteModel(modelId: string, userId: string) {
  if (USE_SIMULATED || !prisma) {
    return;
  }

  try {
    if (prisma?.model) {
      await prisma.model.updateMany({
        where: {
          id: modelId,
          userId: userId,
          deletedAt: null,
        },
        data: {
          deletedAt: new Date(),
          status: "archived",
          updatedAt: new Date(),
        },
      });
    }
  } catch (error) {
    console.error("[AI Studio DB] Error deleting model:", error);
    throw error;
  }
}

export async function listModels(userId: string, options?: {
  limit?: number;
  offset?: number;
  status?: string;
}) {
  if (USE_SIMULATED || !prisma) {
    return [];
  }

  try {
    if (prisma.model) {
      return await prisma.model.findMany({
        where: {
          userId: userId,
          deletedAt: null,
          ...(options?.status && { status: options.status }),
        },
        take: options?.limit || 50,
        skip: options?.offset || 0,
        orderBy: {
          createdAt: "desc",
        },
      });
    }
    return [];
  } catch (error) {
    console.error("[AI Studio DB] Error listing models:", error);
    return [];
  }
}

// ============================================================================
// Training Job Functions
// ============================================================================

export async function createTrainingJob(data: {
  userId: string;
  modelId: string;
  datasetId: string;
  status?: string;
  computeType?: string;
  config: any;
}) {
  if (USE_SIMULATED || !prisma) {
    return {
      id: crypto.randomUUID(),
      ...data,
      status: data.status || "queued",
      computeType: data.computeType || "browser",
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  try {
    if (prisma?.trainingJob) {
      return await prisma.trainingJob.create({
        data: {
          userId: data.userId,
          modelId: data.modelId,
          datasetId: data.datasetId,
          status: data.status || "queued",
          computeType: data.computeType || "browser",
          config: data.config,
          progress: 0,
        },
      });
    }
    
    // Fallback to generic Job model
    if (prisma.job) {
      return await prisma.job.create({
        data: {
          userId: data.userId,
          toolId: "ai-studio-training",
          status: data.status || "queued",
          inputJson: {
            modelId: data.modelId,
            datasetId: data.datasetId,
            computeType: data.computeType || "browser",
            config: data.config,
          } as any,
        },
      });
    }
    
    return {
      id: crypto.randomUUID(),
      ...data,
      status: data.status || "queued",
      computeType: data.computeType || "browser",
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error("[AI Studio DB] Error creating training job:", error);
    return {
      id: crypto.randomUUID(),
      ...data,
      status: data.status || "queued",
      computeType: data.computeType || "browser",
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}

export async function updateTrainingJob(
  jobId: string,
  userId: string,
  updates: {
    status?: string;
    progress?: number;
    currentEpoch?: number;
    metrics?: any;
    errorMessage?: string;
    completedAt?: Date;
  }
) {
  if (USE_SIMULATED || !prisma) {
    return {
      id: jobId,
      ...updates,
      updatedAt: new Date(),
    };
  }

  try {
    if (prisma?.trainingJob) {
      const job = await prisma.trainingJob.updateMany({
        where: {
          id: jobId,
          userId: userId,
        },
        data: {
          ...(updates.status && { status: updates.status }),
          ...(updates.progress !== undefined && { progress: updates.progress }),
          ...(updates.currentEpoch !== undefined && { currentEpoch: updates.currentEpoch }),
          ...(updates.metrics && { metrics: updates.metrics }),
          ...(updates.errorMessage && { errorMessage: updates.errorMessage }),
          ...(updates.completedAt && { completedAt: updates.completedAt }),
          updatedAt: new Date(),
        },
      });
      if (job.count === 0) return null;
      return getTrainingJob(jobId, userId);
    }
    
    // Fallback to generic Job model
    if (prisma.job) {
      const job = await prisma.job.updateMany({
        where: {
          id: jobId,
          userId: userId,
          toolId: "ai-studio-training",
        },
        data: {
          status: updates.status,
          outputJson: {
            progress: updates.progress,
            currentEpoch: updates.currentEpoch,
            metrics: updates.metrics,
            errorMessage: updates.errorMessage,
            completedAt: updates.completedAt,
          } as any,
          finishedAt: updates.completedAt || (updates.status === "succeeded" || updates.status === "failed" ? new Date() : undefined),
        },
      });
      if (job.count === 0) return null;
      return getTrainingJob(jobId, userId);
    }
    
    return {
      id: jobId,
      ...updates,
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error("[AI Studio DB] Error updating training job:", error);
    return {
      id: jobId,
      ...updates,
      updatedAt: new Date(),
    };
  }
}

export async function getTrainingJob(jobId: string, userId: string) {
  if (USE_SIMULATED || !prisma) {
    return null;
  }

  try {
    if (prisma?.trainingJob) {
      return await prisma.trainingJob.findFirst({
        where: {
          id: jobId,
          userId: userId,
        },
      });
    }
    
    if (prisma.job) {
      return await prisma.job.findFirst({
        where: {
          id: jobId,
          userId: userId,
          toolId: "ai-studio-training",
        },
      });
    }
    return null;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[AI Studio DB] Training job not found, using simulated response");
    }
    return null;
  }
}

export async function listTrainingJobs(userId: string, options?: {
  limit?: number;
  offset?: number;
  status?: string;
}) {
  if (USE_SIMULATED || !prisma) {
    return [];
  }

  try {
    if (prisma?.trainingJob) {
      return await prisma.trainingJob.findMany({
        where: {
          userId: userId,
          ...(options?.status && { status: options.status }),
        },
        take: options?.limit || 50,
        skip: options?.offset || 0,
        orderBy: {
          createdAt: "desc",
        },
      });
    }
    
    if (prisma.job) {
      return await prisma.job.findMany({
        where: {
          userId: userId,
          toolId: "ai-studio-training",
          ...(options?.status && { status: options.status }),
        },
        take: options?.limit || 50,
        skip: options?.offset || 0,
        orderBy: {
          startedAt: "desc",
        },
      });
    }
    return [];
  } catch (error) {
    console.error("[AI Studio DB] Error listing training jobs:", error);
    return [];
  }
}

// ============================================================================
// Agent Functions
// ============================================================================

export async function getAgent(agentId: string, userId: string) {
  if (USE_SIMULATED || !prisma) {
    return null;
  }

  try {
    if (prisma?.agent) {
      return await prisma.agent.findFirst({
        where: {
          id: agentId,
          userId: userId,
          deletedAt: null,
        },
      });
    }
    return null;
  } catch (error) {
    console.error("[AI Studio DB] Error fetching agent:", error);
    return null;
  }
}

export async function createAgent(data: {
  userId: string;
  name: string;
  description?: string;
  config: any;
  status?: string;
  version?: string;
}) {
  if (USE_SIMULATED || !prisma) {
    return {
      id: crypto.randomUUID(),
      ...data,
      status: data.status || "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  try {
    if (prisma?.agent) {
      return await prisma.agent.create({
        data: {
          userId: data.userId,
          name: data.name,
          description: data.description,
          type: data.config?.type || 'single',
          modelConfig: data.config?.modelConfig || {},
          tools: data.config?.tools || [],
          memoryConfig: data.config?.memoryConfig,
          systemPrompt: data.config?.systemPrompt,
          workflow: data.config?.workflow,
          status: data.status || "active",
          metadata: data.config?.metadata || {},
        },
      });
    }
    
    return {
      id: crypto.randomUUID(),
      ...data,
      status: data.status || "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error("[AI Studio DB] Error creating agent:", error);
    throw error;
  }
}

export async function updateAgent(
  agentId: string,
  userId: string,
  updates: Partial<{
    name: string;
    description: string;
    config: any;
    status: string;
  }>
) {
  if (USE_SIMULATED || !prisma) {
    return {
      id: agentId,
      ...updates,
      updatedAt: new Date(),
    };
  }

  try {
    if (prisma?.agent) {
      const agent = await prisma.agent.updateMany({
        where: {
          id: agentId,
          userId: userId,
          deletedAt: null,
        },
        data: {
          ...(updates.name && { name: updates.name }),
          ...(updates.description !== undefined && { description: updates.description }),
          ...(updates.config && {
            type: updates.config.type,
            modelConfig: updates.config.modelConfig || {},
            tools: updates.config.tools || [],
            memoryConfig: updates.config.memoryConfig,
            systemPrompt: updates.config.systemPrompt,
            workflow: updates.config.workflow,
            metadata: updates.config.metadata || {},
          }),
          ...(updates.status && { status: updates.status }),
          updatedAt: new Date(),
        },
      });
      if (agent.count === 0) return null;
      return getAgent(agentId, userId);
    }
    return {
      id: agentId,
      ...updates,
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error("[AI Studio DB] Error updating agent:", error);
    throw error;
  }
}

export async function deleteAgent(agentId: string, userId: string) {
  if (USE_SIMULATED || !prisma) {
    return;
  }

  try {
    if (prisma?.agent) {
      await prisma.agent.updateMany({
        where: {
          id: agentId,
          userId: userId,
          deletedAt: null,
        },
        data: {
          deletedAt: new Date(),
          status: "archived",
          updatedAt: new Date(),
        },
      });
    }
  } catch (error) {
    console.error("[AI Studio DB] Error deleting agent:", error);
    throw error;
  }
}

export async function listAgents(userId: string, options?: {
  limit?: number;
  offset?: number;
  status?: string;
}) {
  if (USE_SIMULATED || !prisma) {
    return [];
  }

  try {
    if (prisma.agent) {
      return await prisma.agent.findMany({
        where: {
          userId: userId,
          deletedAt: null,
          ...(options?.status && { status: options.status }),
        },
        take: options?.limit || 50,
        skip: options?.offset || 0,
        orderBy: {
          createdAt: "desc",
        },
      });
    }
    return [];
  } catch (error) {
    console.error("[AI Studio DB] Error listing agents:", error);
    return [];
  }
}
