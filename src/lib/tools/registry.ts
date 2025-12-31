/**
 * Tool Registry - Single Source of Truth
 * 
 * Defines all tools with their execution mode, pricing, limits, and requirements.
 * This is the authoritative source for tool metadata used by the credit engine,
 * access control, and UI.
 */

export type ExecutionMode = "client_only" | "hybrid" | "server_required";
export type RiskTier = "low" | "medium" | "high";
export type AvailabilityFlag = "enabled" | "beta" | "deprecated" | "coming_soon";

export interface ToolLimits {
  cpuMsMax: number; // Maximum CPU time in milliseconds
  memMbMax: number; // Maximum memory in MB
  outputKbMax: number; // Maximum output size in KB
  timeoutMs: number; // Request timeout in milliseconds
  concurrencyMax: number; // Maximum concurrent executions per user
}

export interface ToolPricing {
  baseCreditsPerRun: number; // Base fee per server run (default: 2)
  cpuMsPerCredit: number; // CPU time per credit (default: 2000ms = 1 credit per 2s)
  memMbMsPerCredit: number; // Memory time per credit (default: 4000ms per GB = 1 credit per 4s per GB)
  minCreditsPerRun: number; // Minimum charge (default: 3)
  maxCreditsPerRun: number; // Tool-specific maximum cap
}

export interface ToolDefinition {
  toolId: string;
  title: string;
  category: string; // "dev-studio" | "cyber-studio" | "data-studio" | etc.
  executionMode: ExecutionMode;
  requiresAuth: boolean; // true for server_required and any "buy credits"
  riskTier: RiskTier;
  limits: ToolLimits;
  pricing: ToolPricing;
  availability: {
    enabled: boolean;
    flag: AvailabilityFlag;
    mobileSupported: boolean;
  };
  description?: string;
}

// Default pricing configuration
const DEFAULT_PRICING: Omit<ToolPricing, "maxCreditsPerRun"> = {
  baseCreditsPerRun: 2,
  cpuMsPerCredit: 2000, // 1 credit per 2 seconds
  memMbMsPerCredit: 4000, // 1 credit per 4 seconds per GB
  minCreditsPerRun: 3,
};

// Default limits
const DEFAULT_LIMITS: ToolLimits = {
  cpuMsMax: 5000, // 5 seconds
  memMbMax: 512, // 512 MB
  outputKbMax: 1024, // 1 MB
  timeoutMs: 10000, // 10 seconds
  concurrencyMax: 1,
};

/**
 * Tool Registry
 * 
 * Add all studio tools here with their complete definitions.
 */
export const TOOL_REGISTRY: Record<string, ToolDefinition> = {
  // Dev Studio Tools
  "dev-studio-projects": {
    toolId: "dev-studio-projects",
    title: "Project Builder",
    category: "dev-studio",
    executionMode: "client_only",
    requiresAuth: false,
    riskTier: "low",
    limits: DEFAULT_LIMITS,
    pricing: {
      ...DEFAULT_PRICING,
      maxCreditsPerRun: 0, // Client-side only
    },
    availability: {
      enabled: true,
      flag: "enabled",
      mobileSupported: true,
    },
    description: "Visual project scaffolding with stack selection",
  },
  "dev-studio-api-designer": {
    toolId: "dev-studio-api-designer",
    title: "API Designer",
    category: "dev-studio",
    executionMode: "hybrid",
    requiresAuth: false, // Client-side works without auth
    riskTier: "low",
    limits: DEFAULT_LIMITS,
    pricing: {
      ...DEFAULT_PRICING,
      maxCreditsPerRun: 5, // Save/share operations
    },
    availability: {
      enabled: true,
      flag: "enabled",
      mobileSupported: true,
    },
    description: "Design, test, and document APIs with OpenAPI export",
  },
  "dev-studio-schema-designer": {
    toolId: "dev-studio-schema-designer",
    title: "Database Schema Designer",
    category: "dev-studio",
    executionMode: "client_only",
    requiresAuth: false,
    riskTier: "low",
    limits: DEFAULT_LIMITS,
    pricing: {
      ...DEFAULT_PRICING,
      maxCreditsPerRun: 0,
    },
    availability: {
      enabled: true,
      flag: "enabled",
      mobileSupported: true,
    },
    description: "Visual schema builder with migration generation",
  },
  "dev-studio-cicd": {
    toolId: "dev-studio-cicd",
    title: "CI/CD Pipeline Builder",
    category: "dev-studio",
    executionMode: "hybrid",
    requiresAuth: false,
    riskTier: "low",
    limits: DEFAULT_LIMITS,
    pricing: {
      ...DEFAULT_PRICING,
      maxCreditsPerRun: 5,
    },
    availability: {
      enabled: true,
      flag: "enabled",
      mobileSupported: true,
    },
    description: "Visual pipeline designer with GitHub Actions export",
  },
  "dev-studio-deployment": {
    toolId: "dev-studio-deployment",
    title: "Deployment Wizard",
    category: "dev-studio",
    executionMode: "server_required",
    requiresAuth: true,
    riskTier: "high",
    limits: {
      ...DEFAULT_LIMITS,
      cpuMsMax: 30000, // 30 seconds
      timeoutMs: 60000, // 60 seconds
    },
    pricing: {
      ...DEFAULT_PRICING,
      maxCreditsPerRun: 100, // External API calls
    },
    availability: {
      enabled: true,
      flag: "beta",
      mobileSupported: false,
    },
    description: "Multi-cloud deployment (Vercel, AWS, GCP, Azure)",
  },
  "dev-studio-security": {
    toolId: "dev-studio-security",
    title: "Security Scanner",
    category: "dev-studio",
    executionMode: "server_required",
    requiresAuth: true,
    riskTier: "high",
    limits: {
      ...DEFAULT_LIMITS,
      cpuMsMax: 20000, // 20 seconds
      timeoutMs: 30000, // 30 seconds
    },
    pricing: {
      ...DEFAULT_PRICING,
      maxCreditsPerRun: 50, // External API calls + compute
    },
    availability: {
      enabled: true,
      flag: "beta",
      mobileSupported: false,
    },
    description: "Automated security checklist and vulnerability scanning",
  },
  "dev-studio-performance": {
    toolId: "dev-studio-performance",
    title: "Performance Profiler",
    category: "dev-studio",
    executionMode: "server_required",
    requiresAuth: true,
    riskTier: "medium",
    limits: {
      ...DEFAULT_LIMITS,
      cpuMsMax: 15000, // 15 seconds
      timeoutMs: 20000, // 20 seconds
    },
    pricing: {
      ...DEFAULT_PRICING,
      maxCreditsPerRun: 25, // Heavy compute
    },
    availability: {
      enabled: true,
      flag: "beta",
      mobileSupported: false,
    },
    description: "Load testing and performance analysis",
  },
  "dev-studio-cost": {
    toolId: "dev-studio-cost",
    title: "Cost Calculator",
    category: "dev-studio",
    executionMode: "client_only",
    requiresAuth: false,
    riskTier: "low",
    limits: DEFAULT_LIMITS,
    pricing: {
      ...DEFAULT_PRICING,
      maxCreditsPerRun: 0,
    },
    availability: {
      enabled: true,
      flag: "enabled",
      mobileSupported: true,
    },
    description: "Real-time infrastructure cost estimation",
  },
  // Cyber Studio Tools
  "cyber-studio-threat-modeling": {
    toolId: "cyber-studio-threat-modeling",
    title: "Threat Model Generator",
    category: "cyber-studio",
    executionMode: "hybrid",
    requiresAuth: false,
    riskTier: "low",
    limits: DEFAULT_LIMITS,
    pricing: {
      ...DEFAULT_PRICING,
      maxCreditsPerRun: 5,
    },
    availability: {
      enabled: true,
      flag: "enabled",
      mobileSupported: true,
    },
    description: "Automated threat modeling from system descriptions",
  },
  "cyber-studio-risk-register": {
    toolId: "cyber-studio-risk-register",
    title: "Risk Register Builder",
    category: "cyber-studio",
    executionMode: "hybrid",
    requiresAuth: false,
    riskTier: "low",
    limits: DEFAULT_LIMITS,
    pricing: {
      ...DEFAULT_PRICING,
      maxCreditsPerRun: 5,
    },
    availability: {
      enabled: true,
      flag: "enabled",
      mobileSupported: true,
    },
    description: "Comprehensive risk tracking with mitigation plans",
  },
  "cyber-studio-compliance": {
    toolId: "cyber-studio-compliance",
    title: "Compliance Auditor",
    category: "cyber-studio",
    executionMode: "server_required",
    requiresAuth: true,
    riskTier: "medium",
    limits: {
      ...DEFAULT_LIMITS,
      cpuMsMax: 10000, // 10 seconds
      timeoutMs: 15000, // 15 seconds
    },
    pricing: {
      ...DEFAULT_PRICING,
      maxCreditsPerRun: 25,
    },
    availability: {
      enabled: true,
      flag: "beta",
      mobileSupported: false,
    },
    description: "Automated compliance gap analysis",
  },
  "cyber-studio-ir-playbook": {
    toolId: "cyber-studio-ir-playbook",
    title: "Incident Response Playbook Builder",
    category: "cyber-studio",
    executionMode: "hybrid",
    requiresAuth: false,
    riskTier: "low",
    limits: DEFAULT_LIMITS,
    pricing: {
      ...DEFAULT_PRICING,
      maxCreditsPerRun: 5,
    },
    availability: {
      enabled: true,
      flag: "enabled",
      mobileSupported: true,
    },
    description: "Create and test IR procedures",
  },
  "cyber-studio-security-architecture": {
    toolId: "cyber-studio-security-architecture",
    title: "Security Architecture Designer",
    category: "cyber-studio",
    executionMode: "hybrid",
    requiresAuth: false,
    riskTier: "low",
    limits: DEFAULT_LIMITS,
    pricing: {
      ...DEFAULT_PRICING,
      maxCreditsPerRun: 5,
    },
    availability: {
      enabled: true,
      flag: "enabled",
      mobileSupported: true,
    },
    description: "Visual security architecture with attack surface mapping",
  },
  "cyber-studio-vulnerability-scanner": {
    toolId: "cyber-studio-vulnerability-scanner",
    title: "Vulnerability Scanner",
    category: "cyber-studio",
    executionMode: "server_required",
    requiresAuth: true,
    riskTier: "high",
    limits: {
      ...DEFAULT_LIMITS,
      cpuMsMax: 20000,
      timeoutMs: 30000,
    },
    pricing: {
      ...DEFAULT_PRICING,
      maxCreditsPerRun: 50, // External API calls
    },
    availability: {
      enabled: true,
      flag: "beta",
      mobileSupported: false,
    },
    description: "Integration with OWASP, CVE databases",
  },
  "cyber-studio-metrics": {
    toolId: "cyber-studio-metrics",
    title: "Security Metrics Dashboard",
    category: "cyber-studio",
    executionMode: "hybrid",
    requiresAuth: false,
    riskTier: "low",
    limits: DEFAULT_LIMITS,
    pricing: {
      ...DEFAULT_PRICING,
      maxCreditsPerRun: 5,
    },
    availability: {
      enabled: true,
      flag: "enabled",
      mobileSupported: true,
    },
    description: "KPIs, KRIs, compliance scores",
  },
  "cyber-studio-policy-generator": {
    toolId: "cyber-studio-policy-generator",
    title: "Security Policy Generator",
    category: "cyber-studio",
    executionMode: "hybrid",
    requiresAuth: false,
    riskTier: "low",
    limits: DEFAULT_LIMITS,
    pricing: {
      ...DEFAULT_PRICING,
      maxCreditsPerRun: 5,
    },
    availability: {
      enabled: true,
      flag: "enabled",
      mobileSupported: true,
    },
    description: "Generate policies from templates",
  },
  // Data Studio Tools
  "data-studio-pipelines": {
    toolId: "data-studio-pipelines",
    title: "Data Pipeline Designer",
    category: "data-studio",
    executionMode: "hybrid",
    requiresAuth: false,
    riskTier: "low",
    limits: DEFAULT_LIMITS,
    pricing: {
      ...DEFAULT_PRICING,
      maxCreditsPerRun: 5,
    },
    availability: {
      enabled: true,
      flag: "enabled",
      mobileSupported: true,
    },
    description: "Visual ETL/ELT pipeline builder",
  },
  "data-studio-quality": {
    toolId: "data-studio-quality",
    title: "Data Quality Monitor",
    category: "data-studio",
    executionMode: "server_required",
    requiresAuth: true,
    riskTier: "medium",
    limits: {
      ...DEFAULT_LIMITS,
      cpuMsMax: 10000,
      timeoutMs: 15000,
    },
    pricing: {
      ...DEFAULT_PRICING,
      maxCreditsPerRun: 25,
    },
    availability: {
      enabled: true,
      flag: "beta",
      mobileSupported: false,
    },
    description: "Automated data quality checks and alerts",
  },
  "data-studio-catalog": {
    toolId: "data-studio-catalog",
    title: "Data Catalog Builder",
    category: "data-studio",
    executionMode: "hybrid",
    requiresAuth: false,
    riskTier: "low",
    limits: DEFAULT_LIMITS,
    pricing: {
      ...DEFAULT_PRICING,
      maxCreditsPerRun: 5,
    },
    availability: {
      enabled: true,
      flag: "enabled",
      mobileSupported: true,
    },
    description: "Automated metadata cataloging",
  },
  "data-studio-dashboards": {
    toolId: "data-studio-dashboards",
    title: "Analytics Dashboard Builder",
    category: "data-studio",
    executionMode: "hybrid",
    requiresAuth: false,
    riskTier: "low",
    limits: DEFAULT_LIMITS,
    pricing: {
      ...DEFAULT_PRICING,
      maxCreditsPerRun: 5,
    },
    availability: {
      enabled: true,
      flag: "enabled",
      mobileSupported: true,
    },
    description: "Drag-and-drop dashboard creation",
  },
  "data-studio-privacy": {
    toolId: "data-studio-privacy",
    title: "Data Privacy Impact Assessor",
    category: "data-studio",
    executionMode: "server_required",
    requiresAuth: true,
    riskTier: "medium",
    limits: {
      ...DEFAULT_LIMITS,
      cpuMsMax: 10000,
      timeoutMs: 15000,
    },
    pricing: {
      ...DEFAULT_PRICING,
      maxCreditsPerRun: 25,
    },
    availability: {
      enabled: true,
      flag: "beta",
      mobileSupported: false,
    },
    description: "GDPR, CCPA compliance checker",
  },
  "data-studio-lineage": {
    toolId: "data-studio-lineage",
    title: "Data Lineage Tracker",
    category: "data-studio",
    executionMode: "server_required",
    requiresAuth: true,
    riskTier: "medium",
    limits: {
      ...DEFAULT_LIMITS,
      cpuMsMax: 15000,
      timeoutMs: 20000,
    },
    pricing: {
      ...DEFAULT_PRICING,
      maxCreditsPerRun: 25,
    },
    availability: {
      enabled: true,
      flag: "beta",
      mobileSupported: false,
    },
    description: "Automated lineage discovery and visualization",
  },
  "data-studio-schema": {
    toolId: "data-studio-schema",
    title: "Schema Designer",
    category: "data-studio",
    executionMode: "client_only",
    requiresAuth: false,
    riskTier: "low",
    limits: DEFAULT_LIMITS,
    pricing: {
      ...DEFAULT_PRICING,
      maxCreditsPerRun: 0,
    },
    availability: {
      enabled: true,
      flag: "enabled",
      mobileSupported: true,
    },
    description: "Visual database schema design with validation",
  },
  "data-studio-governance": {
    toolId: "data-studio-governance",
    title: "Data Governance Framework",
    category: "data-studio",
    executionMode: "hybrid",
    requiresAuth: false,
    riskTier: "low",
    limits: DEFAULT_LIMITS,
    pricing: {
      ...DEFAULT_PRICING,
      maxCreditsPerRun: 5,
    },
    availability: {
      enabled: true,
      flag: "enabled",
      mobileSupported: true,
    },
    description: "Policy management and enforcement",
  },
};

/**
 * Get tool definition by ID
 */
export function getToolDefinition(toolId: string): ToolDefinition | null {
  return TOOL_REGISTRY[toolId] || null;
}

/**
 * Get all tools for a category
 */
export function getToolsByCategory(category: string): ToolDefinition[] {
  return Object.values(TOOL_REGISTRY).filter((tool) => tool.category === category);
}

/**
 * Check if tool requires authentication
 */
export function toolRequiresAuth(toolId: string): boolean {
  const tool = getToolDefinition(toolId);
  return tool?.requiresAuth ?? false;
}

/**
 * Check if tool is client-side only
 */
export function isClientSideOnly(toolId: string): boolean {
  const tool = getToolDefinition(toolId);
  return tool?.executionMode === "client_only";
}

/**
 * Check if tool is enabled
 */
export function isToolEnabled(toolId: string): boolean {
  const tool = getToolDefinition(toolId);
  return tool?.availability.enabled ?? false;
}
