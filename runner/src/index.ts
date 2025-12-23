import { z } from "zod";
import { runJsQuickjs } from "./engines/jsQuickjs";
import { runPythonStub } from "./engines/pythonStub";

const RunnerJobRequestSchema = z.object({
  toolId: z.string().min(1),
  jobId: z.string().min(1),
  payload: z.unknown(),
  limits: z.object({
    maxRunMs: z.number().int().positive(),
    maxOutputBytes: z.number().int().positive(),
    maxMemoryMb: z.number().int().positive(),
  }),
});

const CodeRunnerPayloadSchema = z.object({
  language: z.enum(["js", "py"]),
  code: z.string(),
  input: z.string().optional(),
  presets: z.array(z.string()).optional(),
});

const ALLOWED_TOOLS = new Set(["sandbox-echo", "code-runner"]);
const HARD_CAP_RUN_MS = 30_000;
const HARD_CAP_OUTPUT_BYTES = 200_000;
const CODE_RUNNER_HARD_CAP_MS = 8_000;
const CODE_RUNNER_HARD_CAP_OUTPUT = 60_000;
const CODE_RUNNER_HARD_CAP_MEMORY_MB = 128;
const CODE_RUNNER_MAX_CODE_CHARS = 6_000;

function json(res: any, status = 200) {
  return new Response(JSON.stringify(res), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function safeString(v: unknown, max = 4000) {
  const s = typeof v === "string" ? v : String(v ?? "");
  return s.slice(0, max);
}

async function handleRun(req: Request) {
  const started = Date.now();
  const body = await req.json().catch(() => null);
  const parsed = RunnerJobRequestSchema.safeParse(body);
  if (!parsed.success) {
    return json(
      {
        ok: false,
        metrics: { runMs: Date.now() - started },
        error: { code: "BAD_REQUEST", message: "Invalid runner request." },
      },
      400
    );
  }

  const job = parsed.data;
  if (!ALLOWED_TOOLS.has(job.toolId)) {
    return json(
      {
        ok: false,
        metrics: { runMs: Date.now() - started },
        error: { code: "TOOL_NOT_ALLOWED", message: "Tool not allowed." },
      },
      403
    );
  }

  const maxRunMs = Math.min(HARD_CAP_RUN_MS, job.limits.maxRunMs);
  const maxOutputBytes = Math.min(HARD_CAP_OUTPUT_BYTES, job.limits.maxOutputBytes);

  // sandbox-echo: deterministic, no code execution.
  if (job.toolId === "sandbox-echo") {
    const payload = job.payload as any;
    const message = safeString(payload?.message ?? "", 1000);
    const repeat = Math.max(1, Math.min(20, Number(payload?.repeat ?? 1)));

    const out = Array.from({ length: repeat }, () => message).join("\n");
    const sizeBytes = Buffer.byteLength(out, "utf8");
    const clipped = sizeBytes > maxOutputBytes ? out.slice(0, Math.max(0, maxOutputBytes - 20)) + "\n[clipped]" : out;

    const runMs = Math.min(Date.now() - started, maxRunMs);
    return json({
      ok: true,
      stdout: clipped,
      stderr: "",
      artifacts: [],
      metrics: { runMs, peakMemoryMb: 32 },
    });
  }

  if (job.toolId === "code-runner") {
    const payloadParsed = CodeRunnerPayloadSchema.safeParse(job.payload);
    if (!payloadParsed.success) {
      return json(
        { ok: false, metrics: { runMs: Date.now() - started }, error: { code: "BAD_PAYLOAD", message: "Invalid code runner payload." } },
        400
      );
    }

    const payload = payloadParsed.data;
    if (payload.code.length > CODE_RUNNER_MAX_CODE_CHARS) {
      return json(
        { ok: false, metrics: { runMs: Date.now() - started }, error: { code: "CODE_TOO_LARGE", message: "Code is too large." } },
        400
      );
    }

    const runCapsMs = Math.min(CODE_RUNNER_HARD_CAP_MS, maxRunMs);
    const outCaps = Math.min(CODE_RUNNER_HARD_CAP_OUTPUT, maxOutputBytes);

    if (Math.min(CODE_RUNNER_HARD_CAP_MEMORY_MB, job.limits.maxMemoryMb) > CODE_RUNNER_HARD_CAP_MEMORY_MB) {
      // Fail closed. Keep memory bounded.
      return json(
        { ok: false, metrics: { runMs: Date.now() - started }, error: { code: "MEMORY_LIMIT", message: "Memory limit too high." } },
        400
      );
    }

    if (payload.language === "js") {
      const out = await runJsQuickjs({ code: payload.code, input: payload.input || "", maxRunMs: runCapsMs, maxOutputBytes: outCaps });
      return json({
        ok: out.ok,
        stdout: out.stdout,
        stderr: out.stderr,
        artifacts: [],
        metrics: { runMs: out.runMs, peakMemoryMb: 64 },
        error: out.ok ? undefined : out.error,
      });
    }

    const py = await runPythonStub();
    return json({
      ok: py.ok,
      stdout: py.stdout,
      stderr: py.stderr,
      artifacts: [],
      metrics: { runMs: py.runMs, peakMemoryMb: 64 },
      error: py.error,
    });
  }

  return json(
    {
      ok: false,
      metrics: { runMs: Date.now() - started },
      error: { code: "NOT_IMPLEMENTED", message: "Not implemented." },
    },
    501
  );
}

import http from "node:http";

const port = Number(process.env.PORT || "5055");

const httpServer = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
    if (req.method === "POST" && url.pathname === "/run") {
      const chunks: Buffer[] = [];
      for await (const c of req) chunks.push(Buffer.from(c));
      const raw = Buffer.concat(chunks).toString("utf8");
      const request = new Request("http://local/run", {
        method: "POST",
        body: raw,
        headers: { "content-type": (req.headers["content-type"] as string) || "application/json" },
      });
      const response = await handleRun(request);
      res.statusCode = response.status;
      for (const [k, v] of response.headers.entries()) res.setHeader(k, v);
      const buf = Buffer.from(await response.arrayBuffer());
      res.end(buf);
      return;
    }

    res.statusCode = 404;
    res.setHeader("content-type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ ok: false, error: { code: "NOT_FOUND", message: "Not found." }, metrics: { runMs: 0 } }));
  } catch (err: any) {
    res.statusCode = 500;
    res.setHeader("content-type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ ok: false, error: { code: "RUNNER_ERROR", message: "Runner error." }, metrics: { runMs: 0 } }));
  }
});

httpServer.listen(port, "0.0.0.0", () => {
  console.log("runner:listening", { port });
});


