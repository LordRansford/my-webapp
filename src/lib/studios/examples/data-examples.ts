/**
 * Data Studio Example Projects
 * 
 * Pre-built data projects for the Data Studio
 */

export interface DataStudioExample {
  id: string;
  title: string;
  description: string;
  category: "pipeline" | "analytics" | "governance" | "quality" | "warehouse" | "catalog";
  difficulty: "beginner" | "intermediate" | "advanced";
  dataSources: string[];
  transformations: string[];
  outputs: string[];
  estimatedTime: string;
  credits: number;
}

export const dataExamples: DataStudioExample[] = [
  {
    id: "etl-pipeline",
    title: "ETL Pipeline",
    description: "Extract, transform, and load data from multiple sources",
    category: "pipeline",
    difficulty: "intermediate",
    dataSources: ["PostgreSQL", "CSV files", "REST API"],
    transformations: [
      "Data cleaning",
      "Type conversion",
      "Aggregation",
      "Joins"
    ],
    outputs: ["Data warehouse", "Analytics database"],
    estimatedTime: "2-3 days",
    credits: 400
  },
  {
    id: "real-time-analytics",
    title: "Real-Time Analytics",
    description: "Stream processing pipeline for real-time analytics",
    category: "analytics",
    difficulty: "advanced",
    dataSources: ["Kafka", "Event streams"],
    transformations: [
      "Stream processing",
      "Windowing",
      "Aggregations",
      "Enrichment"
    ],
    outputs: ["Real-time dashboard", "Alerting system"],
    estimatedTime: "4-5 days",
    credits: 600
  },
  {
    id: "data-quality-monitoring",
    title: "Data Quality Monitoring",
    description: "Automated data quality checks and monitoring",
    category: "quality",
    difficulty: "intermediate",
    dataSources: ["Data warehouse", "Data lake"],
    transformations: [
      "Completeness checks",
      "Accuracy validation",
      "Consistency checks",
      "Timeliness validation"
    ],
    outputs: ["Quality dashboard", "Alert notifications"],
    estimatedTime: "2-3 days",
    credits: 350
  },
  {
    id: "data-catalog",
    title: "Data Catalog",
    description: "Automated metadata cataloging and discovery",
    category: "catalog",
    difficulty: "intermediate",
    dataSources: ["Multiple databases", "Data warehouses"],
    transformations: [
      "Schema discovery",
      "Metadata extraction",
      "Lineage tracking",
      "Classification"
    ],
    outputs: ["Searchable catalog", "Data dictionary"],
    estimatedTime: "3-4 days",
    credits: 500
  },
  {
    id: "customer-analytics",
    title: "Customer Analytics Dashboard",
    description: "Comprehensive customer analytics and insights",
    category: "analytics",
    difficulty: "intermediate",
    dataSources: ["CRM", "Transaction data", "Web analytics"],
    transformations: [
      "Customer segmentation",
      "RFM analysis",
      "Churn prediction",
      "Lifetime value calculation"
    ],
    outputs: ["Analytics dashboard", "Reports"],
    estimatedTime: "3-4 days",
    credits: 450
  },
  {
    id: "data-governance-framework",
    title: "Data Governance Framework",
    description: "Establish data governance policies and procedures",
    category: "governance",
    difficulty: "advanced",
    dataSources: ["All data sources"],
    transformations: [
      "Policy definition",
      "Access control",
      "Data classification",
      "Retention policies"
    ],
    outputs: ["Governance policies", "Compliance reports"],
    estimatedTime: "5-7 days",
    credits: 800
  },
  {
    id: "data-warehouse-design",
    title: "Data Warehouse Design",
    description: "Design and implement a data warehouse",
    category: "warehouse",
    difficulty: "advanced",
    dataSources: ["OLTP systems", "External APIs"],
    transformations: [
      "Dimensional modeling",
      "ETL processes",
      "Data aggregation",
      "Historical tracking"
    ],
    outputs: ["Data warehouse", "ETL pipelines"],
    estimatedTime: "1-2 weeks",
    credits: 1200
  },
  {
    id: "data-lineage-tracking",
    title: "Data Lineage Tracking",
    description: "Track data flow and dependencies across systems",
    category: "catalog",
    difficulty: "intermediate",
    dataSources: ["All data systems"],
    transformations: [
      "Lineage discovery",
      "Dependency mapping",
      "Impact analysis",
      "Change tracking"
    ],
    outputs: ["Lineage visualization", "Impact reports"],
    estimatedTime: "3-4 days",
    credits: 400
  },
  {
    id: "privacy-impact-assessment",
    title: "Privacy Impact Assessment",
    description: "Assess privacy risks and compliance",
    category: "governance",
    difficulty: "intermediate",
    dataSources: ["Personal data sources"],
    transformations: [
      "Data classification",
      "Risk assessment",
      "Compliance checking",
      "Mitigation planning"
    ],
    outputs: ["DPIA report", "Compliance checklist"],
    estimatedTime: "2-3 days",
    credits: 300
  },
  {
    id: "predictive-analytics",
    title: "Predictive Analytics Pipeline",
    description: "Build predictive models for business forecasting",
    category: "analytics",
    difficulty: "advanced",
    dataSources: ["Historical data", "External datasets"],
    transformations: [
      "Feature engineering",
      "Model training",
      "Validation",
      "Scoring"
    ],
    outputs: ["Predictive models", "Forecast dashboard"],
    estimatedTime: "1-2 weeks",
    credits: 1000
  }
];

export function getDataExamplesByCategory(category: string) {
  return dataExamples.filter(ex => ex.category === category);
}

export function getDataExamplesByDifficulty(difficulty: string) {
  return dataExamples.filter(ex => ex.difficulty === difficulty);
}

export function getDataExample(id: string) {
  return dataExamples.find(ex => ex.id === id);
}


