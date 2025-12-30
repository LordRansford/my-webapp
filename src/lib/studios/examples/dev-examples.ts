/**
 * Dev Studio Example Templates
 * 
 * Pre-built project templates for the Dev Studio
 */

export interface DevStudioExample {
  id: string;
  title: string;
  description: string;
  category: "web-app" | "api" | "mobile" | "saas" | "ecommerce" | "iot";
  difficulty: "beginner" | "intermediate" | "advanced";
  stack: {
    frontend: string;
    backend: string;
    database: string;
    deployment?: string;
  };
  features: string[];
  estimatedTime: string;
  credits: number;
}

export const devExamples: DevStudioExample[] = [
  {
    id: "ecommerce-store",
    title: "E-commerce Store",
    description: "Full-featured online store with cart, checkout, and payment integration",
    category: "ecommerce",
    difficulty: "intermediate",
    stack: {
      frontend: "React + Next.js",
      backend: "Node.js + Express",
      database: "PostgreSQL",
      deployment: "Vercel + AWS"
    },
    features: [
      "Product catalog",
      "Shopping cart",
      "Checkout flow",
      "Payment processing",
      "Order management",
      "User authentication"
    ],
    estimatedTime: "2-3 weeks",
    credits: 500
  },
  {
    id: "saas-platform",
    title: "SaaS Platform",
    description: "Multi-tenant SaaS application with subscription management",
    category: "saas",
    difficulty: "advanced",
    stack: {
      frontend: "React + TypeScript",
      backend: "Node.js + Express",
      database: "PostgreSQL + Redis",
      deployment: "AWS ECS"
    },
    features: [
      "Multi-tenancy",
      "Subscription billing",
      "User management",
      "API authentication",
      "Analytics dashboard",
      "Webhooks"
    ],
    estimatedTime: "4-6 weeks",
    credits: 1000
  },
  {
    id: "api-first-service",
    title: "API-First Service",
    description: "RESTful API with OpenAPI documentation and rate limiting",
    category: "api",
    difficulty: "intermediate",
    stack: {
      frontend: "No UI",
      backend: "Node.js + Express",
      database: "PostgreSQL",
      deployment: "AWS Lambda"
    },
    features: [
      "RESTful API",
      "OpenAPI documentation",
      "Rate limiting",
      "Authentication",
      "Error handling",
      "Logging"
    ],
    estimatedTime: "1-2 weeks",
    credits: 300
  },
  {
    id: "mobile-app-backend",
    title: "Mobile App Backend",
    description: "Backend API for mobile applications with push notifications",
    category: "mobile",
    difficulty: "intermediate",
    stack: {
      frontend: "No UI",
      backend: "Node.js + Express",
      database: "MongoDB",
      deployment: "AWS Elastic Beanstalk"
    },
    features: [
      "REST API",
      "Push notifications",
      "File uploads",
      "Real-time updates",
      "Offline sync",
      "Analytics"
    ],
    estimatedTime: "2-3 weeks",
    credits: 400
  },
  {
    id: "simple-blog",
    title: "Simple Blog",
    description: "Content management system for blogging",
    category: "web-app",
    difficulty: "beginner",
    stack: {
      frontend: "Next.js",
      backend: "Next.js API Routes",
      database: "SQLite",
      deployment: "Vercel"
    },
    features: [
      "Post creation",
      "Markdown support",
      "Comments",
      "Search",
      "RSS feed",
      "SEO optimization"
    ],
    estimatedTime: "1 week",
    credits: 150
  },
  {
    id: "task-manager",
    title: "Task Manager",
    description: "Collaborative task management with real-time updates",
    category: "web-app",
    difficulty: "intermediate",
    stack: {
      frontend: "React",
      backend: "Node.js + Socket.io",
      database: "PostgreSQL",
      deployment: "Heroku"
    },
    features: [
      "Task CRUD",
      "Real-time collaboration",
      "User assignments",
      "Due dates",
      "Notifications",
      "Project organization"
    ],
    estimatedTime: "2 weeks",
    credits: 350
  },
  {
    id: "iot-dashboard",
    title: "IoT Dashboard",
    description: "Dashboard for monitoring IoT devices and sensors",
    category: "iot",
    difficulty: "advanced",
    stack: {
      frontend: "React + D3.js",
      backend: "Node.js + MQTT",
      database: "InfluxDB",
      deployment: "AWS IoT Core"
    },
    features: [
      "Device management",
      "Real-time data visualization",
      "Alerts and notifications",
      "Data analytics",
      "Device control",
      "Historical data"
    ],
    estimatedTime: "3-4 weeks",
    credits: 800
  },
  {
    id: "social-network",
    title: "Social Network",
    description: "Basic social networking platform with feeds and connections",
    category: "web-app",
    difficulty: "advanced",
    stack: {
      frontend: "React + Redux",
      backend: "Node.js + GraphQL",
      database: "PostgreSQL + Redis",
      deployment: "AWS ECS"
    },
    features: [
      "User profiles",
      "News feed",
      "Friend connections",
      "Messaging",
      "Media uploads",
      "Notifications"
    ],
    estimatedTime: "4-6 weeks",
    credits: 1200
  },
  {
    id: "analytics-platform",
    title: "Analytics Platform",
    description: "Web analytics platform with custom event tracking",
    category: "saas",
    difficulty: "advanced",
    stack: {
      frontend: "React + TypeScript",
      backend: "Node.js + Express",
      database: "ClickHouse",
      deployment: "AWS EKS"
    },
    features: [
      "Event tracking",
      "Real-time dashboards",
      "Custom reports",
      "Funnel analysis",
      "Cohort analysis",
      "API access"
    ],
    estimatedTime: "5-8 weeks",
    credits: 1500
  },
  {
    id: "cms-platform",
    title: "CMS Platform",
    description: "Content management system with multi-site support",
    category: "web-app",
    difficulty: "advanced",
    stack: {
      frontend: "Next.js",
      backend: "Node.js + Express",
      database: "PostgreSQL",
      deployment: "Vercel + AWS"
    },
    features: [
      "Content editor",
      "Media library",
      "Multi-site support",
      "User roles",
      "Version control",
      "API access"
    ],
    estimatedTime: "4-6 weeks",
    credits: 1000
  },
  {
    id: "marketplace",
    title: "Marketplace",
    description: "Two-sided marketplace connecting buyers and sellers",
    category: "ecommerce",
    difficulty: "advanced",
    stack: {
      frontend: "React + Next.js",
      backend: "Node.js + Express",
      database: "PostgreSQL",
      deployment: "AWS ECS"
    },
    features: [
      "Seller onboarding",
      "Product listings",
      "Search and filters",
      "Reviews and ratings",
      "Payment processing",
      "Order management"
    ],
    estimatedTime: "6-8 weeks",
    credits: 1800
  },
  {
    id: "learning-platform",
    title: "Learning Platform",
    description: "Online learning management system with courses and quizzes",
    category: "saas",
    difficulty: "intermediate",
    stack: {
      frontend: "React",
      backend: "Node.js + Express",
      database: "PostgreSQL",
      deployment: "AWS Elastic Beanstalk"
    },
    features: [
      "Course creation",
      "Video hosting",
      "Quizzes and assessments",
      "Progress tracking",
      "Certificates",
      "Payment integration"
    ],
    estimatedTime: "3-4 weeks",
    credits: 600
  },
  {
    id: "booking-system",
    title: "Booking System",
    description: "Appointment and reservation booking system",
    category: "web-app",
    difficulty: "intermediate",
    stack: {
      frontend: "React",
      backend: "Node.js + Express",
      database: "PostgreSQL",
      deployment: "Heroku"
    },
    features: [
      "Calendar integration",
      "Availability management",
      "Booking confirmation",
      "Email notifications",
      "Payment processing",
      "Admin dashboard"
    ],
    estimatedTime: "2-3 weeks",
    credits: 450
  },
  {
    id: "chat-application",
    title: "Chat Application",
    description: "Real-time messaging application with rooms and file sharing",
    category: "web-app",
    difficulty: "intermediate",
    stack: {
      frontend: "React + Socket.io",
      backend: "Node.js + Socket.io",
      database: "MongoDB",
      deployment: "AWS EC2"
    },
    features: [
      "Real-time messaging",
      "Chat rooms",
      "File sharing",
      "User presence",
      "Message history",
      "Notifications"
    ],
    estimatedTime: "2-3 weeks",
    credits: 400
  },
  {
    id: "portfolio-website",
    title: "Portfolio Website",
    description: "Personal portfolio website with blog and contact form",
    category: "web-app",
    difficulty: "beginner",
    stack: {
      frontend: "Next.js",
      backend: "Next.js API Routes",
      database: "SQLite",
      deployment: "Vercel"
    },
    features: [
      "Portfolio showcase",
      "Blog",
      "Contact form",
      "SEO optimization",
      "Responsive design",
      "Analytics"
    ],
    estimatedTime: "3-5 days",
    credits: 100
  },
  {
    id: "restaurant-app",
    title: "Restaurant App",
    description: "Restaurant management with online ordering",
    category: "web-app",
    difficulty: "intermediate",
    stack: {
      frontend: "React Native",
      backend: "Node.js + Express",
      database: "PostgreSQL",
      deployment: "AWS ECS"
    },
    features: [
      "Menu management",
      "Online ordering",
      "Table reservations",
      "Payment processing",
      "Order tracking",
      "Admin dashboard"
    ],
    estimatedTime: "3-4 weeks",
    credits: 700
  }
];

export function getDevExamplesByCategory(category: string) {
  return devExamples.filter(ex => ex.category === category);
}

export function getDevExamplesByDifficulty(difficulty: string) {
  return devExamples.filter(ex => ex.difficulty === difficulty);
}

export function getDevExample(id: string) {
  return devExamples.find(ex => ex.id === id);
}


