/**
 * Architecture Diagram Studio Templates
 * 
 * Pre-built diagram templates for the Architecture Diagram Studio
 */

export interface ArchitectureDiagramTemplate {
  id: string;
  title: string;
  description: string;
  category: "c4" | "uml" | "archimate" | "mermaid" | "flowchart" | "network" | "deployment" | "sequence";
  difficulty: "beginner" | "intermediate" | "advanced";
  useCase: string;
  components: number;
  estimatedTime: string;
  credits: number;
}

export const architectureTemplates: ArchitectureDiagramTemplate[] = [
  // C4 Model Templates
  {
    id: "c4-system-context",
    title: "System Context Diagram",
    description: "High-level view of system and its external actors",
    category: "c4",
    difficulty: "beginner",
    useCase: "System overview and stakeholder communication",
    components: 5,
    estimatedTime: "30 minutes",
    credits: 20
  },
  {
    id: "c4-container",
    title: "Container Diagram",
    description: "Applications and data stores within a system",
    category: "c4",
    difficulty: "intermediate",
    useCase: "System architecture documentation",
    components: 8,
    estimatedTime: "1 hour",
    credits: 40
  },
  {
    id: "c4-component",
    title: "Component Diagram",
    description: "Components within a container",
    category: "c4",
    difficulty: "intermediate",
    useCase: "Detailed system design",
    components: 12,
    estimatedTime: "2 hours",
    credits: 60
  },
  {
    id: "c4-code",
    title: "Code Diagram",
    description: "Classes and interfaces within a component",
    category: "c4",
    difficulty: "advanced",
    useCase: "Code-level architecture",
    components: 20,
    estimatedTime: "3 hours",
    credits: 100
  },
  
  // UML Templates
  {
    id: "uml-class-diagram",
    title: "UML Class Diagram",
    description: "Class structure and relationships",
    category: "uml",
    difficulty: "intermediate",
    useCase: "Object-oriented design",
    components: 15,
    estimatedTime: "1-2 hours",
    credits: 50
  },
  {
    id: "uml-sequence-diagram",
    title: "UML Sequence Diagram",
    description: "Interaction between objects over time",
    category: "sequence",
    difficulty: "intermediate",
    useCase: "Process flow documentation",
    components: 10,
    estimatedTime: "1 hour",
    credits: 45
  },
  {
    id: "uml-activity-diagram",
    title: "UML Activity Diagram",
    description: "Business process workflow",
    category: "flowchart",
    difficulty: "beginner",
    useCase: "Business process modeling",
    components: 8,
    estimatedTime: "45 minutes",
    credits: 35
  },
  {
    id: "uml-state-diagram",
    title: "UML State Diagram",
    description: "State transitions of an object",
    category: "flowchart",
    difficulty: "intermediate",
    useCase: "State machine design",
    components: 10,
    estimatedTime: "1 hour",
    credits: 40
  },
  {
    id: "uml-use-case",
    title: "UML Use Case Diagram",
    description: "System use cases and actors",
    category: "uml",
    difficulty: "beginner",
    useCase: "Requirements analysis",
    components: 6,
    estimatedTime: "30 minutes",
    credits: 25
  },
  
  // Archimate Templates
  {
    id: "archimate-business-layer",
    title: "Archimate Business Layer",
    description: "Business processes, functions, and services",
    category: "archimate",
    difficulty: "advanced",
    useCase: "Enterprise architecture",
    components: 12,
    estimatedTime: "2 hours",
    credits: 70
  },
  {
    id: "archimate-application-layer",
    title: "Archimate Application Layer",
    description: "Application components and services",
    category: "archimate",
    difficulty: "advanced",
    useCase: "Application architecture",
    components: 15,
    estimatedTime: "2-3 hours",
    credits: 80
  },
  {
    id: "archimate-technology-layer",
    title: "Archimate Technology Layer",
    description: "Infrastructure and technology components",
    category: "archimate",
    difficulty: "advanced",
    useCase: "Infrastructure architecture",
    components: 18,
    estimatedTime: "3 hours",
    credits: 90
  },
  
  // Deployment Diagrams
  {
    id: "deployment-aws",
    title: "AWS Deployment Diagram",
    description: "Application deployment on AWS infrastructure",
    category: "deployment",
    difficulty: "intermediate",
    useCase: "Cloud deployment planning",
    components: 10,
    estimatedTime: "1-2 hours",
    credits: 55
  },
  {
    id: "deployment-azure",
    title: "Azure Deployment Diagram",
    description: "Application deployment on Azure infrastructure",
    category: "deployment",
    difficulty: "intermediate",
    useCase: "Cloud deployment planning",
    components: 10,
    estimatedTime: "1-2 hours",
    credits: 55
  },
  {
    id: "deployment-gcp",
    title: "GCP Deployment Diagram",
    description: "Application deployment on Google Cloud",
    category: "deployment",
    difficulty: "intermediate",
    useCase: "Cloud deployment planning",
    components: 10,
    estimatedTime: "1-2 hours",
    credits: 55
  },
  {
    id: "deployment-kubernetes",
    title: "Kubernetes Deployment",
    description: "Container orchestration architecture",
    category: "deployment",
    difficulty: "advanced",
    useCase: "Container deployment",
    components: 15,
    estimatedTime: "2-3 hours",
    credits: 85
  },
  {
    id: "deployment-microservices",
    title: "Microservices Architecture",
    description: "Distributed microservices deployment",
    category: "deployment",
    difficulty: "advanced",
    useCase: "Microservices design",
    components: 20,
    estimatedTime: "3-4 hours",
    credits: 120
  },
  
  // Network Diagrams
  {
    id: "network-topology",
    title: "Network Topology",
    description: "Network infrastructure layout",
    category: "network",
    difficulty: "intermediate",
    useCase: "Network planning",
    components: 12,
    estimatedTime: "1-2 hours",
    credits: 50
  },
  {
    id: "network-security",
    title: "Network Security Architecture",
    description: "Security zones and firewall placement",
    category: "network",
    difficulty: "advanced",
    useCase: "Security architecture",
    components: 15,
    estimatedTime: "2-3 hours",
    credits: 75
  },
  {
    id: "network-vpc",
    title: "VPC Architecture",
    description: "Virtual private cloud design",
    category: "network",
    difficulty: "advanced",
    useCase: "Cloud network design",
    components: 18,
    estimatedTime: "3 hours",
    credits: 90
  },
  
  // Flowcharts
  {
    id: "flowchart-process",
    title: "Business Process Flowchart",
    description: "Step-by-step business process",
    category: "flowchart",
    difficulty: "beginner",
    useCase: "Process documentation",
    components: 8,
    estimatedTime: "45 minutes",
    credits: 30
  },
  {
    id: "flowchart-decision-tree",
    title: "Decision Tree",
    description: "Decision-making flowchart",
    category: "flowchart",
    difficulty: "beginner",
    useCase: "Decision logic documentation",
    components: 6,
    estimatedTime: "30 minutes",
    credits: 25
  },
  {
    id: "flowchart-user-journey",
    title: "User Journey Map",
    description: "User interaction flow",
    category: "flowchart",
    difficulty: "beginner",
    useCase: "UX design",
    components: 10,
    estimatedTime: "1 hour",
    credits: 40
  },
  
  // Sequence Diagrams
  {
    id: "sequence-api-call",
    title: "API Call Sequence",
    description: "API request/response flow",
    category: "sequence",
    difficulty: "intermediate",
    useCase: "API documentation",
    components: 8,
    estimatedTime: "1 hour",
    credits: 45
  },
  {
    id: "sequence-authentication",
    title: "Authentication Flow",
    description: "User authentication sequence",
    category: "sequence",
    difficulty: "intermediate",
    useCase: "Security documentation",
    components: 10,
    estimatedTime: "1-2 hours",
    credits: 50
  },
  {
    id: "sequence-payment",
    title: "Payment Processing Flow",
    description: "Payment transaction sequence",
    category: "sequence",
    difficulty: "intermediate",
    useCase: "Payment system design",
    components: 12,
    estimatedTime: "2 hours",
    credits: 60
  },
  
  // Industry-Specific Templates
  {
    id: "ecommerce-architecture",
    title: "E-commerce Architecture",
    description: "Complete e-commerce system architecture",
    category: "c4",
    difficulty: "advanced",
    useCase: "E-commerce platform design",
    components: 25,
    estimatedTime: "4-5 hours",
    credits: 150
  },
  {
    id: "saas-architecture",
    title: "SaaS Multi-Tenant Architecture",
    description: "Multi-tenant SaaS platform design",
    category: "c4",
    difficulty: "advanced",
    useCase: "SaaS platform design",
    components: 30,
    estimatedTime: "5-6 hours",
    credits: 180
  },
  {
    id: "data-pipeline",
    title: "Data Pipeline Architecture",
    description: "ETL/ELT pipeline design",
    category: "flowchart",
    difficulty: "intermediate",
    useCase: "Data engineering",
    components: 15,
    estimatedTime: "2-3 hours",
    credits: 80
  },
  {
    id: "ml-pipeline",
    title: "ML Pipeline Architecture",
    description: "Machine learning pipeline design",
    category: "flowchart",
    difficulty: "advanced",
    useCase: "ML system design",
    components: 20,
    estimatedTime: "3-4 hours",
    credits: 110
  },
  {
    id: "event-driven",
    title: "Event-Driven Architecture",
    description: "Event-driven system design",
    category: "c4",
    difficulty: "advanced",
    useCase: "Event-driven systems",
    components: 22,
    estimatedTime: "4 hours",
    credits: 130
  },
  {
    id: "serverless",
    title: "Serverless Architecture",
    description: "Serverless function architecture",
    category: "deployment",
    difficulty: "intermediate",
    useCase: "Serverless design",
    components: 12,
    estimatedTime: "2 hours",
    credits: 65
  },
  {
    id: "edge-computing",
    title: "Edge Computing Architecture",
    description: "Edge and cloud hybrid architecture",
    category: "deployment",
    difficulty: "advanced",
    useCase: "Edge computing design",
    components: 18,
    estimatedTime: "3-4 hours",
    credits: 100
  },
  {
    id: "blockchain",
    title: "Blockchain Architecture",
    description: "Blockchain network architecture",
    category: "network",
    difficulty: "advanced",
    useCase: "Blockchain design",
    components: 20,
    estimatedTime: "4 hours",
    credits: 120
  },
  {
    id: "iot-architecture",
    title: "IoT Architecture",
    description: "Internet of Things system design",
    category: "c4",
    difficulty: "advanced",
    useCase: "IoT platform design",
    components: 25,
    estimatedTime: "4-5 hours",
    credits: 140
  },
  {
    id: "mobile-backend",
    title: "Mobile Backend Architecture",
    description: "Backend for mobile applications",
    category: "c4",
    difficulty: "intermediate",
    useCase: "Mobile app backend",
    components: 15,
    estimatedTime: "2-3 hours",
    credits: 75
  },
  {
    id: "api-gateway",
    title: "API Gateway Architecture",
    description: "API gateway and microservices",
    category: "c4",
    difficulty: "advanced",
    useCase: "API management",
    components: 18,
    estimatedTime: "3 hours",
    credits: 95
  },
  {
    id: "cd-cd-pipeline",
    title: "CI/CD Pipeline",
    description: "Continuous integration and deployment",
    category: "flowchart",
    difficulty: "intermediate",
    useCase: "DevOps pipeline design",
    components: 12,
    estimatedTime: "2 hours",
    credits: 60
  },
  {
    id: "monitoring-observability",
    title: "Monitoring & Observability",
    description: "Observability stack architecture",
    category: "deployment",
    difficulty: "intermediate",
    useCase: "Monitoring design",
    components: 10,
    estimatedTime: "1-2 hours",
    credits: 50
  },
  {
    id: "disaster-recovery",
    title: "Disaster Recovery Architecture",
    description: "DR and backup architecture",
    category: "deployment",
    difficulty: "advanced",
    useCase: "Disaster recovery planning",
    components: 15,
    estimatedTime: "3 hours",
    credits: 85
  },
  {
    id: "hybrid-cloud",
    title: "Hybrid Cloud Architecture",
    description: "On-premises and cloud hybrid",
    category: "deployment",
    difficulty: "advanced",
    useCase: "Hybrid cloud design",
    components: 20,
    estimatedTime: "4 hours",
    credits: 110
  },
  {
    id: "content-delivery",
    title: "Content Delivery Network",
    description: "CDN and caching architecture",
    category: "network",
    difficulty: "intermediate",
    useCase: "CDN design",
    components: 12,
    estimatedTime: "2 hours",
    credits: 60
  },
  {
    id: "data-lake",
    title: "Data Lake Architecture",
    description: "Data lake and analytics platform",
    category: "c4",
    difficulty: "advanced",
    useCase: "Data platform design",
    components: 22,
    estimatedTime: "4-5 hours",
    credits: 125
  },
  {
    id: "real-time-streaming",
    title: "Real-Time Streaming Architecture",
    description: "Stream processing architecture",
    category: "flowchart",
    difficulty: "advanced",
    useCase: "Stream processing design",
    components: 18,
    estimatedTime: "3-4 hours",
    credits: 105
  },
  {
    id: "graphql-api",
    title: "GraphQL API Architecture",
    description: "GraphQL API and resolvers",
    category: "c4",
    difficulty: "intermediate",
    useCase: "GraphQL API design",
    components: 14,
    estimatedTime: "2-3 hours",
    credits: 70
  },
  {
    id: "websocket-realtime",
    title: "WebSocket Real-Time Architecture",
    description: "Real-time communication architecture",
    category: "sequence",
    difficulty: "intermediate",
    useCase: "Real-time systems",
    components: 10,
    estimatedTime: "1-2 hours",
    credits: 55
  },
  {
    id: "message-queue",
    title: "Message Queue Architecture",
    description: "Message broker and queue system",
    category: "c4",
    difficulty: "intermediate",
    useCase: "Async messaging design",
    components: 12,
    estimatedTime: "2 hours",
    credits: 65
  },
  {
    id: "search-engine",
    title: "Search Engine Architecture",
    description: "Search and indexing architecture",
    category: "c4",
    difficulty: "advanced",
    useCase: "Search system design",
    components: 20,
    estimatedTime: "4 hours",
    credits: 115
  },
  {
    id: "recommendation-system",
    title: "Recommendation System Architecture",
    description: "ML-based recommendation engine",
    category: "c4",
    difficulty: "advanced",
    useCase: "Recommendation system design",
    components: 22,
    estimatedTime: "4-5 hours",
    credits: 130
  },
  {
    id: "gaming-backend",
    title: "Gaming Backend Architecture",
    description: "Multiplayer game backend",
    category: "c4",
    difficulty: "advanced",
    useCase: "Gaming platform design",
    components: 25,
    estimatedTime: "5-6 hours",
    credits: 150
  },
  {
    id: "fintech-platform",
    title: "Fintech Platform Architecture",
    description: "Financial services platform",
    category: "c4",
    difficulty: "advanced",
    useCase: "Fintech system design",
    components: 28,
    estimatedTime: "6-8 hours",
    credits: 180
  },
  {
    id: "healthcare-system",
    title: "Healthcare System Architecture",
    description: "HIPAA-compliant healthcare platform",
    category: "c4",
    difficulty: "advanced",
    useCase: "Healthcare system design",
    components: 30,
    estimatedTime: "6-8 hours",
    credits: 200
  },
  {
    id: "education-platform",
    title: "Education Platform Architecture",
    description: "Learning management system",
    category: "c4",
    difficulty: "intermediate",
    useCase: "Education platform design",
    components: 20,
    estimatedTime: "4 hours",
    credits: 110
  },
  {
    id: "social-network",
    title: "Social Network Architecture",
    description: "Social networking platform",
    category: "c4",
    difficulty: "advanced",
    useCase: "Social platform design",
    components: 32,
    estimatedTime: "6-8 hours",
    credits: 190
  },
  {
    id: "marketplace",
    title: "Marketplace Architecture",
    description: "Two-sided marketplace platform",
    category: "c4",
    difficulty: "advanced",
    useCase: "Marketplace design",
    components: 28,
    estimatedTime: "5-6 hours",
    credits: 160
  },
  {
    id: "video-platform",
    title: "Video Platform Architecture",
    description: "Video streaming and processing",
    category: "c4",
    difficulty: "advanced",
    useCase: "Video platform design",
    components: 26,
    estimatedTime: "5-6 hours",
    credits: 155
  },
  {
    id: "analytics-platform",
    title: "Analytics Platform Architecture",
    description: "Business intelligence and analytics",
    category: "c4",
    difficulty: "advanced",
    useCase: "Analytics platform design",
    components: 24,
    estimatedTime: "4-5 hours",
    credits: 140
  },
  {
    id: "cms-architecture",
    title: "CMS Architecture",
    description: "Content management system",
    category: "c4",
    difficulty: "intermediate",
    useCase: "CMS design",
    components: 18,
    estimatedTime: "3-4 hours",
    credits: 100
  },
  {
    id: "identity-provider",
    title: "Identity Provider Architecture",
    description: "Identity and access management",
    category: "c4",
    difficulty: "advanced",
    useCase: "IAM system design",
    components: 20,
    estimatedTime: "4 hours",
    credits: 115
  },
  {
    id: "blockchain-defi",
    title: "DeFi Architecture",
    description: "Decentralized finance platform",
    category: "network",
    difficulty: "advanced",
    useCase: "DeFi platform design",
    components: 30,
    estimatedTime: "6-8 hours",
    credits: 200
  },
  {
    id: "ai-platform",
    title: "AI Platform Architecture",
    description: "ML/AI platform infrastructure",
    category: "c4",
    difficulty: "advanced",
    useCase: "AI platform design",
    components: 28,
    estimatedTime: "5-6 hours",
    credits: 170
  }
];

export function getArchitectureTemplatesByCategory(category: string) {
  return architectureTemplates.filter(t => t.category === category);
}

export function getArchitectureTemplatesByDifficulty(difficulty: string) {
  return architectureTemplates.filter(t => t.difficulty === difficulty);
}

export function getArchitectureTemplate(id: string) {
  return architectureTemplates.find(t => t.id === id);
}


