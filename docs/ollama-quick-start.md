# Ollama Quick Start Guide

**Quick setup in 5 minutes**

## Step 1: Install Ollama

1. Go to https://ollama.ai/download
2. Download and install Ollama for your OS
3. Verify installation:
   ```bash
   ollama --version
   ```

## Step 2: Download a Model

```bash
ollama pull llama3.2
```

This downloads the model (~2GB). Wait for it to complete.

## Step 3: Test Ollama Works

```bash
ollama run llama3.2 "Hello, what is digitalisation?"
```

You should see a response. If you do, Ollama is working! ✅

## Step 4: Configure Your App

Create or edit `.env.local` in your project root:

```env
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

## Step 5: Restart Dev Server

```bash
# Stop current server (Ctrl+C), then:
npm run dev
```

## Step 6: Test Mentor

1. Visit http://localhost:3000/mentor
2. Ask: "What is digitalisation?"
3. You should get a detailed answer! 🎉

---

**That's it!** For detailed setup, troubleshooting, and advanced options, see [ollama-setup-guide.md](./ollama-setup-guide.md)

