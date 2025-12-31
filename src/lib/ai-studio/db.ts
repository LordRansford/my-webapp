/**
 * AI Studio Database Utilities
 * 
 * Database helpers and Prisma client for AI Studio
 * 
 * Note: This assumes Prisma is set up. In production, you would:
 * 1. Run: npx prisma migrate dev
 * 2. Generate client: npx prisma generate
 * 3. Use the prisma client from @/lib/db/prisma or create a new instance
 */

import crypto from "crypto";

// Try to import Prisma client, fallback to simulated if not available
let prisma: any = null;
let prismaAvailable = false;

try {
  // Try multiple possible import paths
  try {
    const prismaModule = require("@/lib/db/prisma");
    prisma = prismaModule.prisma || prismaModule.default?.prisma || prismaModule.default;
    prismaAvailable = !!prisma;
  } catch {
    // Try direct Prisma client import
    const { PrismaClient } = require("@prisma/client");
    prisma = new PrismaClient();
    prismaAvailable = !!prisma;
  }
} catch (error) {
  // Prisma not set up yet, will use simulated responses
  if (process.env.NODE_ENV !== "production") {
    console.warn("[AI Studio DB] Prisma not available, using simulated responses");
  }
}

// Check if AI Studio tables exist (they would be in a separate schema or merged)
// For now, we'll use simulated responses until the schema is merged
// Set to false to enable Prisma queries when schema is ready
const USE_SIMULATED = !prismaAvailable || process.env.AI_STUDIO_USE_SIMULATED === "true";

/**
 * Get dataset by ID
 */
export async function getDataset(datasetId: string, userId: string) {
  if (USE_SIMULATED || !prisma) {
    // Simulated response for now
    return null;
  }

  try {
    // Try to use Prisma if Dataset model exists
    // Note: This will work once the schema is merged
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
    // Model might not exist yet - this is okay
    if (process.env.NODE_ENV !== "production") {
      console.warn("[AI Studio DB] Dataset model not found, using simulated response");
    }
    return null;
  }
}

/**
 * Create dataset record
 */
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
    // Simulated response
    return {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  try {
    // Try to use Prisma if Dataset model exists
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
    
    // Fallback to simulated
    return {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error("[AI Studio DB] Error creating dataset:", error);
    // Fallback to simulated on error
    return {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}

/**
 * Get model by ID
 */
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

/**
 * Create training job
 */
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
    // Try to use Prisma Job model if available (generic job model)
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
    
    // Fallback to simulated
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
    // Fallback to simulated on error
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

/**
 * Update training job
 */
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

/**
 * Get training job by ID
 */
export async function getTrainingJob(jobId: string, userId: string) {
  if (USE_SIMULATED || !prisma) {
    return null;
  }

  try {
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

/**
 * List datasets for user
 */
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

/**
 * List models for user
 */
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

/**
 * List training jobs for user
 */
export async function listTrainingJobs(userId: string, options?: {
  limit?: number;
  offset?: number;
  status?: string;
}) {
  if (USE_SIMULATED || !prisma) {
    return [];
  }

  try {
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

/**
 * Get agent by ID
 */
export async function getAgent(agentId: string, userId: string) {
  if (USE_SIMULATED || !prisma) {
    return null;
  }

  try {
    // TODO: Uncomment when AI Studio schema is merged
    // return await prisma.agent.findFirst({
    //   where: {
    //     id: agentId,
    //     userId: userId,
    //     deletedAt: null,
    //   },
    // });
    return null;
  } catch (error) {
    console.error("[AI Studio DB] Error fetching agent:", error);
    return null;
  }
}

/**
 * Create agent record
 */
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
      status: data.status || "created",
      version: data.version || "1.0.0",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  try {
    // TODO: Uncomment when AI Studio schema is merged
    // return await prisma.agent.create({
    //   data: {
    //     userId: data.userId,
    //     name: data.name,
    //     description: data.description,
    //     config: data.config,
    //     status: data.status || "created",
    //     version: data.version || "1.0.0",
    //   },
    // });
    return {
      id: crypto.randomUUID(),
      ...data,
      status: data.status || "created",
      version: data.version || "1.0.0",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error("[AI Studio DB] Error creating agent:", error);
    throw error;
  }
}

/**
 * Update agent record
 */
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
    // TODO: Uncomment when AI Studio schema is merged
    // const agent = await prisma.agent.updateMany({
    //   where: {
    //     id: agentId,
    //     userId: userId,
    //     deletedAt: null,
    //   },
    //   data: {
    //     ...updates,
    //     updatedAt: new Date(),
    //   },
    // });
    // if (agent.count === 0) return null;
    // return getAgent(agentId, userId);
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

/**
 * Delete agent record (soft delete)
 */
export async function deleteAgent(agentId: string, userId: string) {
  if (USE_SIMULATED || !prisma) {
    return;
  }

  try {
    // TODO: Uncomment when AI Studio schema is merged
    // await prisma.agent.updateMany({
    //   where: {
    //     id: agentId,
    //     userId: userId,
    //     deletedAt: null,
    //   },
    //   data: {
    //     deletedAt: new Date(),
    //     status: "deleted",
    //     updatedAt: new Date(),
    //   },
    // });
  } catch (error) {
    console.error("[AI Studio DB] Error deleting agent:", error);
    throw error;
  }
}

/**
 * List agents for user
 */
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

