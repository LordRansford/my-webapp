/**
 * Compute Credit Pricing Configuration
 * 
 * Defines credit packages and pricing tiers for studio compute operations
 */

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number; // in cents
  currency: string;
  description: string;
  popular?: boolean;
}

export const CREDIT_PACKAGES: CreditPackage[] = [
  {
    id: "starter",
    name: "Starter",
    credits: 10000, // 100 seconds at 100 credits/second
    price: 500, // $5.00
    currency: "USD",
    description: "Perfect for trying out features and small projects",
    popular: false
  },
  {
    id: "professional",
    name: "Professional",
    credits: 50000, // 500 seconds
    price: 2000, // $20.00
    currency: "USD",
    description: "Best value for regular use and medium projects",
    popular: true
  },
  {
    id: "enterprise",
    name: "Enterprise",
    credits: 300000, // 3000 seconds
    price: 10000, // $100.00
    currency: "USD",
    description: "For teams and high-volume usage",
    popular: false
  }
];

export const FREE_TIER_CREDITS_PER_DAY = 6000; // 60 seconds at 100 credits/second

export interface CreditCost {
  operation: string;
  baseCost: number;
  complexityMultiplier: number;
  estimatedCredits: number;
}

export const OPERATION_COSTS: Record<string, CreditCost> = {
  // Simple operations (1-10 credits)
  "simple-query": {
    operation: "Simple Query",
    baseCost: 5,
    complexityMultiplier: 1,
    estimatedCredits: 5
  },
  "basic-validation": {
    operation: "Basic Validation",
    baseCost: 3,
    complexityMultiplier: 1,
    estimatedCredits: 3
  },
  
  // Medium complexity (10-100 credits)
  "api-design": {
    operation: "API Design",
    baseCost: 50,
    complexityMultiplier: 1.5,
    estimatedCredits: 75
  },
  "schema-generation": {
    operation: "Schema Generation",
    baseCost: 40,
    complexityMultiplier: 1.3,
    estimatedCredits: 52
  },
  "threat-model": {
    operation: "Threat Modeling",
    baseCost: 60,
    complexityMultiplier: 1.4,
    estimatedCredits: 84
  },
  "risk-assessment": {
    operation: "Risk Assessment",
    baseCost: 45,
    complexityMultiplier: 1.2,
    estimatedCredits: 54
  },
  "pipeline-design": {
    operation: "Pipeline Design",
    baseCost: 55,
    complexityMultiplier: 1.5,
    estimatedCredits: 83
  },
  "quality-check": {
    operation: "Data Quality Check",
    baseCost: 35,
    complexityMultiplier: 1.2,
    estimatedCredits: 42
  },
  
  // Complex operations (100-1000 credits)
  "code-generation": {
    operation: "Code Generation",
    baseCost: 200,
    complexityMultiplier: 2,
    estimatedCredits: 400
  },
  "deployment-setup": {
    operation: "Deployment Setup",
    baseCost: 150,
    complexityMultiplier: 1.8,
    estimatedCredits: 270
  },
  "compliance-audit": {
    operation: "Compliance Audit",
    baseCost: 300,
    complexityMultiplier: 2.5,
    estimatedCredits: 750
  },
  "security-scan": {
    operation: "Security Scan",
    baseCost: 250,
    complexityMultiplier: 2.2,
    estimatedCredits: 550
  },
  "data-catalog": {
    operation: "Data Catalog Generation",
    baseCost: 180,
    complexityMultiplier: 2,
    estimatedCredits: 360
  },
  "diagram-render": {
    operation: "Diagram Rendering",
    baseCost: 120,
    complexityMultiplier: 1.5,
    estimatedCredits: 180
  }
};

export function estimateCredits(operationType: string, complexity: "low" | "medium" | "high" = "medium"): number {
  const cost = OPERATION_COSTS[operationType];
  if (!cost) {
    // Default estimate for unknown operations
    return complexity === "low" ? 10 : complexity === "medium" ? 50 : 200;
  }

  const complexityMultipliers = {
    low: 0.7,
    medium: 1.0,
    high: 1.5
  };

  return Math.round(cost.estimatedCredits * complexityMultipliers[complexity]);
}

export function formatCredits(credits: number): string {
  if (credits >= 1000) {
    return `${(credits / 1000).toFixed(1)}k`;
  }
  return credits.toString();
}

export function creditsToSeconds(credits: number): number {
  // 100 credits = 1 second of compute
  return credits / 100;
}

export function secondsToCredits(seconds: number): number {
  return seconds * 100;
}


