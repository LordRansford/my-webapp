# Enhanced Mentor System

The mentor system has been upgraded to use RAG (Retrieval Augmented Generation) with LLM support for intelligent, context-aware answers about the website content.

## Features

✅ **LLM-Powered Answers**: Generates detailed, contextual answers using retrieved content  
✅ **Multiple LLM Providers**: Supports OpenAI, Together.ai (open source), and Ollama (local)  
✅ **Enhanced Retrieval**: Combines vector search, keyword search, and tool documentation  
✅ **Safe & Secure**: Only indexes public content, no backend secrets exposed  
✅ **Detailed Citations**: Provides links to relevant pages with context  
✅ **Tool Usage Instructions**: Can explain how to use tools from the website  
✅ **Fallback Mode**: Works without LLM using keyword search  

## Quick Setup

### Option 1: OpenAI (Recommended)

Add to `.env.local`:
```bash
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4o-mini  # Optional, defaults to gpt-4o-mini
```

### Option 2: Together.ai (Open Source Models)

Add to `.env.local`:
```bash
TOGETHER_API_KEY=your-key-here
TOGETHER_MODEL=meta-llama/Llama-3.1-8B-Instruct-Turbo  # Optional
```

### Option 3: Ollama (Local, Most Secure)

1. Install Ollama from https://ollama.ai
2. Pull a model: `ollama pull llama3.2`
3. Add to `.env.local`:
```bash
OLLAMA_BASE_URL=http://localhost:11434  # Optional
OLLAMA_MODEL=llama3.2  # Optional
```

### Option 4: Keyword-Only Mode (No LLM)

If no LLM provider is configured, the system falls back to keyword-based search with excerpts from content.

## How It Works

1. **Question Processing**: User asks a question
2. **Content Retrieval**: System searches multiple sources:
   - Course content (MDX files)
   - Notes and blog posts
   - Tool documentation
   - Current page context
3. **Answer Generation**: 
   - If LLM available: Generates detailed answer grounded in retrieved content
   - If LLM unavailable: Returns relevant excerpts with links
4. **Citations**: Provides links to all relevant pages with context

## Safety Features

- ✅ Only public-facing content is indexed
- ✅ No backend secrets or internal paths exposed
- ✅ LLM is instructed to answer ONLY from retrieved content
- ✅ Rate limiting prevents abuse
- ✅ Timeout protection (12 seconds)
- ✅ Validation script: `npm run validate:mentor-safety`

## Testing

Visit `/mentor` and try questions like:
- "What is digitalisation?"
- "How do I use the Python playground?"
- "Explain threat modeling"
- "Where can I learn about AI fundamentals?"
- "What tools are available for cybersecurity?"

## Architecture

```
User Question
    ↓
Enhanced Retrieval (vector + keyword + tools)
    ↓
LLM Generation (with retrieved context)
    ↓
Answer + Citations + Links
```

## Files

- `src/lib/mentor/llm.ts` - LLM integration (multiple providers)
- `src/lib/mentor/enhancedRetrieve.ts` - Enhanced content retrieval
- `src/app/api/mentor/query/route.ts` - API endpoint
- `src/app/mentor/page.tsx` - UI component
- `scripts/validate-mentor-safety.mjs` - Safety validation

## Validation

Run safety validation:
```bash
npm run validate:mentor-safety
```

This checks:
- Content index doesn't contain internal routes
- Tools index is safe
- Mentor code doesn't expose secrets
- File system operations are safe

