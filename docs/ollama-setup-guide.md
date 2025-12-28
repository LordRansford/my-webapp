# Ollama Setup Guide for Mentor System

This guide will walk you through setting up Ollama (local LLM) for the mentor system. Ollama runs models locally on your machine, providing the most secure and private option (no data leaves your computer).

## Step-by-Step Setup

### Step 1: Install Ollama

1. **Visit the Ollama website**: https://ollama.ai
2. **Download Ollama** for your operating system:
   - **Windows**: Download the installer from https://ollama.ai/download/windows
   - **macOS**: Download the installer or use Homebrew: `brew install ollama`
   - **Linux**: Follow the installation instructions on the website
3. **Install Ollama** by running the installer you downloaded

### Step 2: Verify Installation

Open a terminal/command prompt and run:

```bash
ollama --version
```

You should see the Ollama version number. If you get an error, make sure Ollama is installed and added to your PATH.

### Step 3: Start Ollama Server

Ollama runs as a server on your machine. It should start automatically when you install it, but you can verify it's running:

**Windows:**
- Check if the Ollama service is running in Task Manager
- Or start it manually by opening Ollama from the Start menu

**macOS/Linux:**
```bash
ollama serve
```

This will start the server on `http://localhost:11434` (default port).

### Step 4: Pull a Model

You need to download a language model to use. Recommended models for the mentor system:

**Best option for quality (recommended):**
```bash
ollama pull llama3.2
```

**Alternative options:**
```bash
# Smaller, faster model (good for testing)
ollama pull llama3.2:1b

# Larger, better quality model (requires more RAM)
ollama pull llama3.2:3b

# Other options
ollama pull mistral
ollama pull codellama
```

**Note**: The model will be downloaded (this may take a few minutes depending on your internet connection). The first time you run it, it will download automatically, but you can pre-download it with the `pull` command.

### Step 5: Test Ollama Locally

Test that Ollama is working:

```bash
ollama run llama3.2 "Hello, can you explain what digitalisation means?"
```

If this works, you should see a response. This confirms Ollama is set up correctly.

### Step 6: Configure Your Application

#### For Local Development

1. **Create or edit `.env.local`** in your project root directory (if it doesn't exist):

```bash
# If the file doesn't exist, create it
# Windows PowerShell:
New-Item -Path .env.local -ItemType File

# macOS/Linux:
touch .env.local
```

2. **Add the Ollama configuration** to `.env.local`:

```env
# Ollama Configuration
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

**Important notes:**
- `OLLAMA_BASE_URL` is the URL where Ollama is running (default is `http://localhost:11434`)
- `OLLAMA_MODEL` is the model name you pulled (e.g., `llama3.2`, `mistral`, etc.)
- If you're using a different port, update the URL accordingly

3. **Restart your development server**:

```bash
# Stop your current dev server (Ctrl+C)
# Then restart it
npm run dev
```

#### For Production (Vercel)

**Important**: Ollama runs locally on your machine. For production on Vercel, you have a few options:

**Option A: Use a different LLM provider for production** (Recommended)
- Keep Ollama for local development
- Use OpenAI or Together.ai for production by setting those environment variables in Vercel

**Option B: Deploy Ollama separately** (Advanced)
- Deploy Ollama on a separate server (VPS, cloud instance)
- Point `OLLAMA_BASE_URL` to that server's URL
- Ensure proper security (authentication, rate limiting)

**Option C: Don't use Ollama in production**
- Only configure OpenAI or Together.ai in Vercel environment variables
- Ollama will only be used locally if configured

**To set environment variables in Vercel:**
1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add variables for production/preview/development as needed

### Step 7: Test the Mentor System

1. **Start your development server** (if not already running):
   ```bash
   npm run dev
   ```

2. **Visit the mentor page**: http://localhost:3000/mentor

3. **Ask a test question**: "What is digitalisation?"

4. **Check the answer**:
   - If Ollama is working, you'll get a detailed LLM-generated answer
   - The answer mode should show "Generated answer (from site content)"
   - If it's not working, check the console/terminal for errors

### Step 8: Verify It's Working

Check your terminal/console logs. You should see:
- No errors related to Ollama connection
- The mentor API should log successful LLM requests

You can also check if Ollama is being used by looking at:
- Browser developer tools → Network tab → Look for `/api/mentor/query` requests
- The response should have `answerMode: "rag"` if LLM is working

## Troubleshooting

### Problem: "Connection refused" or "Failed to connect to Ollama"

**Solutions:**
1. Make sure Ollama server is running:
   ```bash
   # Check if it's running
   curl http://localhost:11434/api/tags
   ```
   If this fails, start Ollama: `ollama serve`

2. Check the port: Make sure `OLLAMA_BASE_URL` matches the port Ollama is using (default is 11434)

3. Check firewall: Make sure your firewall isn't blocking localhost connections

### Problem: "Model not found"

**Solutions:**
1. Pull the model first:
   ```bash
   ollama pull llama3.2
   ```

2. Check available models:
   ```bash
   ollama list
   ```

3. Update `OLLAMA_MODEL` in `.env.local` to match a model you have

### Problem: Slow responses

**Solutions:**
1. Use a smaller model:
   ```bash
   ollama pull llama3.2:1b  # Smaller, faster
   ```

2. Increase system RAM if possible (larger models need more RAM)

3. Close other applications to free up resources

### Problem: "Out of memory" errors

**Solutions:**
1. Use a smaller model:
   ```bash
   ollama pull llama3.2:1b
   ```

2. Close other applications

3. Consider using a cloud LLM provider (OpenAI, Together.ai) instead

## Model Recommendations

| Model | Size | Quality | Speed | RAM Required |
|-------|------|---------|-------|--------------|
| `llama3.2:1b` | 1B params | Good | Fast | ~2GB |
| `llama3.2` | 3B params | Very Good | Medium | ~4GB |
| `llama3.2:3b` | 3B params | Very Good | Medium | ~4GB |
| `mistral` | 7B params | Excellent | Slower | ~8GB |
| `codellama` | 7B+ params | Excellent (code) | Slower | ~10GB+ |

**For most users**: Start with `llama3.2` (3B parameters) - it's a good balance of quality and speed.

## Next Steps

Once Ollama is set up:
1. ✅ Test with a few questions in the mentor
2. ✅ Check response quality and speed
3. ✅ Adjust the model if needed
4. ✅ For production, consider using OpenAI or Together.ai for better reliability

## Security Notes

- ✅ Ollama runs locally - no data leaves your machine
- ✅ All processing happens on your computer
- ✅ Most secure option for sensitive questions
- ✅ No API keys needed
- ✅ Completely free (no usage costs)

This makes Ollama perfect for local development and testing!

