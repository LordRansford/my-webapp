/**
 * LLM Integration for Mentor RAG System
 * 
 * Supports multiple LLM providers with fallback:
 * - OpenAI (if OPENAI_API_KEY is set)
 * - Together.ai (if TOGETHER_API_KEY is set, uses open source models)
 * - Local Ollama (if OLLAMA_BASE_URL is set)
 * 
 * Safety: All responses are grounded in retrieved content only.
 */

type LLMProvider = "openai" | "together" | "ollama" | "none";

type LLMResponse = {
  answer: string;
  tokensUsed?: number;
  provider: LLMProvider;
};

type LLMConfig = {
  provider: LLMProvider;
  model?: string;
  maxTokens?: number;
  temperature?: number;
};

/**
 * Detect available LLM provider
 */
function detectProvider(): LLMConfig {
  // Priority: OpenAI > Together.ai > Ollama
  if (process.env.OPENAI_API_KEY) {
    return {
      provider: "openai",
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      maxTokens: 800,
      temperature: 0.3,
    };
  }
  
  if (process.env.TOGETHER_API_KEY) {
    return {
      provider: "together",
      model: process.env.TOGETHER_MODEL || "meta-llama/Llama-3.1-8B-Instruct-Turbo",
      maxTokens: 800,
      temperature: 0.3,
    };
  }
  
  if (process.env.OLLAMA_BASE_URL) {
    return {
      provider: "ollama",
      model: process.env.OLLAMA_MODEL || "llama3.2",
      maxTokens: 800,
      temperature: 0.3,
    };
  }
  
  return { provider: "none" };
}

/**
 * Generate answer using OpenAI
 */
async function generateWithOpenAI(
  prompt: string,
  config: { model: string; maxTokens: number; temperature: number }
): Promise<LLMResponse> {
  const key = process.env.OPENAI_API_KEY!;
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        {
          role: "system",
          content: `You are a helpful learning mentor for Ransford's Notes, a website about cybersecurity, AI, software architecture, data, and digitalisation. You answer questions based ONLY on the provided context from the website. You provide clear, practical explanations with links to relevant pages. You never make up information that isn't in the context. If the context doesn't contain enough information to answer the question, you say so and suggest where the user might find more information on the website.`,
        },
        { role: "user", content: prompt },
      ],
      max_tokens: config.maxTokens,
      temperature: config.temperature,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${error}`);
  }

  const data = await response.json();
  const answer = data.choices?.[0]?.message?.content || "";
  const tokensUsed = data.usage?.total_tokens;

  return { answer, tokensUsed, provider: "openai" };
}

/**
 * Generate answer using Together.ai (open source models)
 */
async function generateWithTogether(
  prompt: string,
  config: { model: string; maxTokens: number; temperature: number }
): Promise<LLMResponse> {
  const key = process.env.TOGETHER_API_KEY!;
  const response = await fetch("https://api.together.xyz/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        {
          role: "system",
          content: `You are a helpful learning mentor for Ransford's Notes, a website about cybersecurity, AI, software architecture, data, and digitalisation. You answer questions based ONLY on the provided context from the website. You provide clear, practical explanations with links to relevant pages. You never make up information that isn't in the context. If the context doesn't contain enough information to answer the question, you say so and suggest where the user might find more information on the website.`,
        },
        { role: "user", content: prompt },
      ],
      max_tokens: config.maxTokens,
      temperature: config.temperature,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Together.ai API error: ${response.status} ${error}`);
  }

  const data = await response.json();
  const answer = data.choices?.[0]?.message?.content || "";
  const tokensUsed = data.usage?.total_tokens;

  return { answer, tokensUsed, provider: "together" };
}

/**
 * Generate answer using Ollama (local)
 */
async function generateWithOllama(
  prompt: string,
  config: { model: string; maxTokens: number; temperature: number }
): Promise<LLMResponse> {
  const baseUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
  const response = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: config.model,
      messages: [
        {
          role: "system",
          content: `You are a helpful learning mentor for Ransford's Notes, a website about cybersecurity, AI, software architecture, data, and digitalisation. You answer questions based ONLY on the provided context from the website. You provide clear, practical explanations with links to relevant pages. You never make up information that isn't in the context. If the context doesn't contain enough information to answer the question, you say so and suggest where the user might find more information on the website.`,
        },
        { role: "user", content: prompt },
      ],
      options: {
        num_predict: config.maxTokens,
        temperature: config.temperature,
      },
      stream: false,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Ollama API error: ${response.status} ${error}`);
  }

  const data = await response.json();
  const answer = data.message?.content || "";

  return { answer, provider: "ollama" };
}

/**
 * Build RAG prompt from retrieved content
 */
export function buildRAGPrompt(
  question: string,
  retrievedContent: Array<{
    title: string;
    href: string;
    excerpt?: string;
    text?: string;
    why?: string;
  }>,
  currentPageContext?: { title?: string; pathname?: string }
): string {
  const contextParts: string[] = [];

  if (currentPageContext?.title) {
    contextParts.push(`Current page: ${currentPageContext.title} (${currentPageContext.pathname || ""})`);
  }

  contextParts.push("\nRelevant content from the website:\n");

  retrievedContent.forEach((item, idx) => {
    const text = item.excerpt || item.text || item.why || "";
    contextParts.push(`\n[Source ${idx + 1}: ${item.title}]`);
    contextParts.push(`URL: ${item.href}`);
    contextParts.push(`Content: ${text}`);
  });

  const context = contextParts.join("\n");

  return `Answer the following question based ONLY on the context provided below. If the context doesn't contain enough information, say so clearly and suggest relevant pages from the website where the user can learn more.

Question: ${question}

${context}

Instructions:
- Answer the question using only information from the context above
- Include the exact URLs from the context in your answer using markdown links like [Page Title](URL)
- If explaining how to use a tool, provide step-by-step instructions based on the context
- If the context is about a concept (like "digitalisation"), provide a clear explanation with links
- Never make up information that isn't in the context
- If multiple sources are relevant, reference them all

Answer:`;
}

/**
 * Generate answer using available LLM provider
 */
export async function generateAnswer(
  question: string,
  retrievedContent: Array<{
    title: string;
    href: string;
    excerpt?: string;
    text?: string;
    why?: string;
  }>,
  currentPageContext?: { title?: string; pathname?: string },
  timeoutMs = 15000
): Promise<LLMResponse | null> {
  const config = detectProvider();
  
  if (config.provider === "none") {
    return null;
  }

  const prompt = buildRAGPrompt(question, retrievedContent, currentPageContext);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    let result: LLMResponse;

    switch (config.provider) {
      case "openai":
        result = await generateWithOpenAI(prompt, config as any);
        break;
      case "together":
        result = await generateWithTogether(prompt, config as any);
        break;
      case "ollama":
        result = await generateWithOllama(prompt, config as any);
        break;
      default:
        return null;
    }

    clearTimeout(timeoutId);
    return result;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error("LLM request timed out");
    }
    throw err;
  }
}

