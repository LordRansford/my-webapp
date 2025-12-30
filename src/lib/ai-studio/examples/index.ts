import { AIStudioExample } from "./types";

export const examples: AIStudioExample[] = [
  // Children Examples
  {
    id: "story-generator",
    title: "Story Generator",
    description: "Create fun, creative stories with AI. Perfect for sparking imagination!",
    audience: "children",
    difficulty: "beginner",
    category: "text-generation",
    useCase: "Creative Writing",
    estimatedCredits: 5,
    estimatedTime: "15 minutes",
    prerequisites: [],
    config: {
      model: {
        type: "generation",
        architecture: "gpt-3.5-turbo",
        parameters: {
          temperature: 0.8,
          maxTokens: 500,
        },
      },
      training: {
        epochs: 0, // Uses pre-trained model
        batchSize: 1,
      },
    },
    tutorial: [
      {
        step: 1,
        title: "Choose a story prompt",
        description: "Pick a topic like 'space adventure' or 'magical forest'",
        action: "Select a prompt from the examples",
      },
      {
        step: 2,
        title: "Generate your story",
        description: "Click generate and watch the AI create a story for you!",
        action: "Click the Generate button",
      },
      {
        step: 3,
        title: "Customize and save",
        description: "Edit the story, add your own ideas, and save it",
        action: "Edit and save your story",
      },
    ],
    preview: {
      input: "A brave robot exploring a new planet",
      output: "Once upon a time, a brave robot named R2-D5 discovered a beautiful new planet filled with colorful crystals...",
      explanation: "The AI creates a creative story based on your prompt, using safe, age-appropriate content.",
    },
  },
  {
    id: "drawing-classifier",
    title: "Drawing Classifier",
    description: "Draw pictures and let AI guess what you drew!",
    audience: "children",
    difficulty: "beginner",
    category: "image-classification",
    useCase: "Fun Learning",
    estimatedCredits: 10,
    estimatedTime: "20 minutes",
    prerequisites: [],
    config: {
      model: {
        type: "classification",
        architecture: "mobilenet-v2",
        parameters: {},
      },
      training: {
        epochs: 0,
        batchSize: 1,
      },
    },
    tutorial: [
      {
        step: 1,
        title: "Draw a picture",
        description: "Use the drawing tool to create a picture",
        action: "Draw something simple like a cat or a house",
      },
      {
        step: 2,
        title: "Let AI guess",
        description: "The AI will try to identify what you drew",
        action: "Click 'Classify' to see the results",
      },
      {
        step: 3,
        title: "Try again!",
        description: "Draw different things and see how well the AI does",
        action: "Draw more pictures and test the AI",
      },
    ],
    preview: {
      input: "A drawing of a cat",
      output: "I think this is a cat! (85% confidence)",
      explanation: "The AI analyzes your drawing and tries to identify what it is.",
    },
  },

  // Student Examples
  {
    id: "homework-helper",
    title: "Homework Helper",
    description: "Get help understanding concepts and solving problems step-by-step",
    audience: "student",
    difficulty: "beginner",
    category: "education",
    useCase: "Learning Support",
    estimatedCredits: 15,
    estimatedTime: "30 minutes",
    prerequisites: ["Basic understanding of the subject"],
    config: {
      model: {
        type: "generation",
        architecture: "gpt-4",
        parameters: {
          temperature: 0.3,
          maxTokens: 1000,
        },
      },
      training: {
        epochs: 0,
        batchSize: 1,
      },
    },
    tutorial: [
      {
        step: 1,
        title: "Enter your question",
        description: "Type in a homework question or concept you need help with",
        action: "Enter your question in the input field",
      },
      {
        step: 2,
        title: "Get step-by-step help",
        description: "The AI will break down the problem and explain each step",
        action: "Review the explanation provided",
      },
      {
        step: 3,
        title: "Practice and verify",
        description: "Try similar problems to reinforce your understanding",
        action: "Use the practice mode to test yourself",
      },
    ],
    preview: {
      input: "How do I solve 2x + 5 = 15?",
      output: "Step 1: Subtract 5 from both sides... Step 2: Divide by 2... Answer: x = 5",
      explanation: "The AI provides step-by-step explanations to help you learn, not just get answers.",
    },
  },
  {
    id: "notes-summarizer",
    title: "Study Notes Summarizer",
    description: "Summarize long notes and create study guides automatically",
    audience: "student",
    difficulty: "intermediate",
    category: "text-processing",
    useCase: "Study Tools",
    estimatedCredits: 20,
    estimatedTime: "25 minutes",
    prerequisites: ["Have notes to summarize"],
    config: {
      model: {
        type: "generation",
        architecture: "gpt-3.5-turbo",
        parameters: {
          temperature: 0.2,
          maxTokens: 800,
        },
      },
      training: {
        epochs: 0,
        batchSize: 1,
      },
    },
    tutorial: [
      {
        step: 1,
        title: "Upload your notes",
        description: "Paste or upload your study notes",
        action: "Upload or paste your notes",
      },
      {
        step: 2,
        title: "Generate summary",
        description: "The AI will create a concise summary with key points",
        action: "Click 'Summarize' to generate",
      },
      {
        step: 3,
        title: "Create study guide",
        description: "Export as flashcards or quiz questions",
        action: "Export in your preferred format",
      },
    ],
    preview: {
      input: "Long lecture notes about photosynthesis...",
      output: "Key Points: 1. Photosynthesis converts light to energy...",
      explanation: "The AI extracts the most important information and presents it clearly.",
    },
  },

  // Professional Examples
  {
    id: "customer-support-bot",
    title: "Customer Support Bot",
    description: "Build an AI assistant to handle common customer inquiries",
    audience: "professional",
    difficulty: "intermediate",
    category: "conversational-ai",
    useCase: "Customer Service",
    estimatedCredits: 100,
    estimatedTime: "2 hours",
    prerequisites: ["Customer support data", "Knowledge base"],
    config: {
      model: {
        type: "generation",
        architecture: "gpt-4",
        parameters: {
          temperature: 0.5,
          maxTokens: 500,
        },
      },
      training: {
        epochs: 10,
        batchSize: 16,
      },
      deployment: {
        platform: "api",
        endpoint: "/api/support",
      },
    },
    tutorial: [
      {
        step: 1,
        title: "Prepare your data",
        description: "Upload FAQ documents and support ticket history",
        action: "Upload your support data",
      },
      {
        step: 2,
        title: "Train the model",
        description: "Train on your specific support scenarios",
        action: "Start training with your data",
      },
      {
        step: 3,
        title: "Test and deploy",
        description: "Test with sample queries, then deploy to production",
        action: "Test and deploy your bot",
      },
    ],
    preview: {
      input: "How do I return an item?",
      output: "To return an item, please follow these steps: 1. Log into your account...",
      explanation: "The bot provides accurate, helpful responses based on your knowledge base.",
    },
  },
  {
    id: "document-analyzer",
    title: "Document Analyzer",
    description: "Extract insights and summarize business documents automatically",
    audience: "professional",
    difficulty: "advanced",
    category: "document-processing",
    useCase: "Business Intelligence",
    estimatedCredits: 150,
    estimatedTime: "3 hours",
    prerequisites: ["Document samples", "Extraction requirements"],
    config: {
      model: {
        type: "generation",
        architecture: "gpt-4",
        parameters: {
          temperature: 0.2,
          maxTokens: 2000,
        },
      },
      training: {
        epochs: 15,
        batchSize: 8,
      },
      deployment: {
        platform: "api",
        endpoint: "/api/analyze",
      },
    },
    tutorial: [
      {
        step: 1,
        title: "Define extraction fields",
        description: "Specify what information to extract from documents",
        action: "Configure extraction schema",
      },
      {
        step: 2,
        title: "Train on sample documents",
        description: "Provide examples of correctly extracted data",
        action: "Upload training documents",
      },
      {
        step: 3,
        title: "Deploy and integrate",
        description: "Connect to your document workflow",
        action: "Deploy and test integration",
      },
    ],
    preview: {
      input: "Contract document PDF",
      output: "Extracted: Parties: Company A & Company B, Date: 2024-01-15, Value: $50,000...",
      explanation: "The AI extracts structured data from unstructured documents automatically.",
    },
  },

  // All Audience Examples
  {
    id: "sentiment-analyzer",
    title: "Sentiment Analyzer",
    description: "Analyze the sentiment of text - positive, negative, or neutral",
    audience: "all",
    difficulty: "beginner",
    category: "text-analysis",
    useCase: "Text Analysis",
    estimatedCredits: 25,
    estimatedTime: "20 minutes",
    prerequisites: [],
    config: {
      model: {
        type: "classification",
        architecture: "bert-base",
        parameters: {},
      },
      training: {
        epochs: 5,
        batchSize: 32,
      },
    },
    tutorial: [
      {
        step: 1,
        title: "Enter text to analyze",
        description: "Paste or type text you want to analyze",
        action: "Enter your text",
      },
      {
        step: 2,
        title: "Get sentiment results",
        description: "See if the text is positive, negative, or neutral",
        action: "Click 'Analyze' to get results",
      },
      {
        step: 3,
        title: "Explore examples",
        description: "Try different types of text to see how it works",
        action: "Test with various examples",
      },
    ],
    preview: {
      input: "I love this product! It's amazing!",
      output: "Sentiment: Positive (95% confidence)",
      explanation: "The AI determines the emotional tone of the text.",
    },
  },
  {
    id: "image-classifier",
    title: "Image Classifier",
    description: "Classify images into categories - perfect for organizing photos",
    audience: "all",
    difficulty: "intermediate",
    category: "image-classification",
    useCase: "Image Organization",
    estimatedCredits: 50,
    estimatedTime: "45 minutes",
    prerequisites: ["Image dataset"],
    config: {
      model: {
        type: "classification",
        architecture: "resnet-50",
        parameters: {},
      },
      training: {
        epochs: 20,
        batchSize: 32,
      },
    },
    tutorial: [
      {
        step: 1,
        title: "Upload your images",
        description: "Upload images you want to classify",
        action: "Upload image dataset",
      },
      {
        step: 2,
        title: "Define categories",
        description: "Specify what categories to classify into",
        action: "Set up classification categories",
      },
      {
        step: 3,
        title: "Train and test",
        description: "Train the model and test on new images",
        action: "Train model and test results",
      },
    ],
    preview: {
      input: "Photo of a cat",
      output: "Classification: Animal - Cat (92% confidence)",
      explanation: "The AI automatically categorizes your images.",
    },
  },
];

export function getExamplesByAudience(audience: string): AIStudioExample[] {
  if (audience === "all") {
    return examples;
  }
  return examples.filter((ex) => ex.audience === audience || ex.audience === "all");
}

export function getExampleById(id: string): AIStudioExample | undefined {
  return examples.find((ex) => ex.id === id);
}

export function getExamplesByDifficulty(difficulty: string): AIStudioExample[] {
  return examples.filter((ex) => ex.difficulty === difficulty);
}

export function getExamplesByCategory(category: string): AIStudioExample[] {
  return examples.filter((ex) => ex.category === category);
}

