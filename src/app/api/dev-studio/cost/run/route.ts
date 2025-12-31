import { NextRequest } from "next/server";
import { createToolExecutionHandler } from "@/lib/studios/toolExecutionHelper";

type Platform = "vercel" | "aws" | "gcp" | "azure";

interface ResourceConfig {
  cpu: number; // vCPU cores
  memory: number; // GB
  storage: number; // GB
  bandwidth: number; // GB/month
  requests: number; // requests/month
}

// Platform pricing per unit (aligned with frontend)
const platformPricing: Record<Platform, { cpu: number; memory: number; storage: number; bandwidth: number; requests: number }> = {
  vercel: {
    cpu: 0.0001, // per vCPU-hour
    memory: 0.00005, // per GB-hour
    storage: 0.0002, // per GB-month
    bandwidth: 0.0001, // per GB
    requests: 0.000001, // per request
  },
  aws: {
    cpu: 0.00008,
    memory: 0.00004,
    storage: 0.00015,
    bandwidth: 0.00009,
    requests: 0.0000008,
  },
  gcp: {
    cpu: 0.00009,
    memory: 0.000045,
    storage: 0.00018,
    bandwidth: 0.000095,
    requests: 0.0000009,
  },
  azure: {
    cpu: 0.000085,
    memory: 0.000042,
    storage: 0.00016,
    bandwidth: 0.000092,
    requests: 0.00000085,
  },
};

export const POST = createToolExecutionHandler({
  toolId: "dev-studio-cost",
  executeTool: async (userId, body) => {
    const executionStart = Date.now();
    const platform: Platform = body.platform || "vercel";
    const resources: ResourceConfig = body.resources || {
      cpu: 1,
      memory: 1,
      storage: 10,
      bandwidth: 100,
      requests: 1000000,
    };

    // Calculate costs using the same logic as frontend
    const pricing = platformPricing[platform];
    const monthly = {
      compute: (resources.cpu * pricing.cpu * 24 * 30) + (resources.memory * pricing.memory * 24 * 30),
      storage: resources.storage * pricing.storage,
      bandwidth: resources.bandwidth * pricing.bandwidth,
      requests: resources.requests * pricing.requests,
    };
    const totalMonthly = monthly.compute + monthly.storage + monthly.bandwidth + monthly.requests;
    const totalYearly = totalMonthly * 12;

    // Calculate percentage breakdown
    const breakdown = {
      compute: totalMonthly > 0 ? (monthly.compute / totalMonthly) * 100 : 0,
      storage: totalMonthly > 0 ? (monthly.storage / totalMonthly) * 100 : 0,
      bandwidth: totalMonthly > 0 ? (monthly.bandwidth / totalMonthly) * 100 : 0,
      requests: totalMonthly > 0 ? (monthly.requests / totalMonthly) * 100 : 0,
    };

    // Calculate costs for all platforms for comparison
    const platformComparison = Object.entries(platformPricing).map(([p, pPricing]) => {
      const pCosts =
        (resources.cpu * pPricing.cpu * 24 * 30) +
        (resources.memory * pPricing.memory * 24 * 30) +
        (resources.storage * pPricing.storage) +
        (resources.bandwidth * pPricing.bandwidth) +
        (resources.requests * pPricing.requests);
      return {
        platform: p,
        monthlyCost: pCosts,
        yearlyCost: pCosts * 12,
      };
    });

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 150));
    
    return {
      result: {
        success: true,
        estimate: {
          platform,
          monthlyCost: totalMonthly,
          yearlyCost: totalYearly,
          breakdown: {
            compute: monthly.compute,
            storage: monthly.storage,
            bandwidth: monthly.bandwidth,
            requests: monthly.requests,
            percentages: breakdown,
          },
          platformComparison,
          resources,
          toolId: "dev-studio-cost",
          timestamp: new Date().toISOString(),
        },
      },
      actualUsage: {
        cpuMs: Date.now() - executionStart,
        memMb: 100,
        durationMs: Date.now() - executionStart,
      },
    };
  },
});
