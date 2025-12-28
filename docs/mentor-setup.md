# Mentor System Setup Guide

The mentor system uses RAG (Retrieval Augmented Generation) to answer questions about the website content. It supports multiple LLM providers with automatic fallback.

## LLM Provider Options

The system will automatically detect and use the first available provider in this order:

### 1. OpenAI (Recommended for Production)
- **Setup**: Set `OPENAI_API_KEY` environment variable
- **Model**: `gpt-4o-mini` (default, configurable via `OPENAI_MODEL`)
- **Pros**: High quality, fast, reliable
- **Cons**: Costs per token

### 2. Together.ai (Open Source Models)
- **Setup**: Set `TOGETHER_API_KEY` environment variable
- **Model**: `meta-llama/Llama-3.1-8B-Instruct-Turbo` (default, configurable via `TOGETHER_MODEL`)
- **Pros**: Uses open source models, cheaper than OpenAI
- **Cons**: May be slower, quality varies by model

### 3. Ollama (Local, Most Secure)
- **Setup**: Set `OLLAMA_BASE_URL` environment variable (default: `http://localhost:11434`)
- **Model**: `llama3.2` (default, configurable via `OLLAMA_MODEL`)
- **Pros**: Completely local, no data leaves your infrastructure, free
- **Cons**: Requires running Ollama server, slower on CPU
- **Installation**: 
  ```bash
  # Install Ollama from https://ollama.ai
  ollama pull llama3.2
  ```

### 4. None (Keyword-Only Mode)
- If no LLM provider is configured, the system falls back to keyword-based search
- Answers will be simpler excerpts from content without LLM-generated explanations

## Configuration

Add to your `.env.local`:

```bash
# Option 1: OpenAI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini  # Optional

# Option 2: Together.ai
TOGETHER_API_KEY=...
TOGETHER_MODEL=meta-llama/Llama-3.1-8B-Instruct-Turbo  # Optional

# Option 3: Ollama (local)
OLLAMA_BASE_URL=http://localhost:11434  # Optional, defaults to localhost
OLLAMA_MODEL=llama3.2  # Optional
```

## Safety Features

1. **Content Filtering**: Only public-facing content is indexed (no backend secrets)
2. **Grounded Answers**: LLM is instructed to answer ONLY from retrieved content
3. **Fallback Mode**: If LLM fails, falls back to keyword search
4. **No Secrets**: The system never exposes backend information, API keys, or internal details
5. **Rate Limiting**: Built-in rate limiting prevents abuse
6. **Timeout Protection**: 12-second timeout prevents long-running requests

## Content Sources

The mentor indexes:
- Course content (from `content/courses/`)
- Notes (from `content/notes/`)
- Blog posts (from `content/posts/`)
- Tool documentation (from `public/tools-index.json`)
- Tool descriptions and usage instructions

## Testing

Test the mentor by visiting `/mentor` and asking questions like:
- "What is digitalisation?"
- "How do I use the Python playground?"
- "Explain threat modeling"
- "Where can I learn about AI fundamentals?"

The system should provide detailed answers with links to relevant pages.

