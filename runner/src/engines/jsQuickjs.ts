import { getQuickJS, type QuickJSContext } from "quickjs-emscripten";

export type JsRunResult = {
  ok: boolean;
  stdout: string;
  stderr: string;
  runMs: number;
  error?: { code: string; message: string };
};

function truncateUtf8(input: string, maxBytes: number) {
  const buf = Buffer.from(input, "utf8");
  if (buf.byteLength <= maxBytes) return input;
  return buf.subarray(0, Math.max(0, maxBytes - 20)).toString("utf8") + "\n[clipped]";
}

function attachConsole(ctx: QuickJSContext, stdout: { lines: string[] }, stderr: { lines: string[] }) {
  const q = ctx;
  const consoleObj = q.newObject();
  const logFn = q.newFunction("log", (...args) => {
    const out = args.map((a) => q.dump(a)).join(" ");
    stdout.lines.push(String(out));
  });
  const errFn = q.newFunction("error", (...args) => {
    const out = args.map((a) => q.dump(a)).join(" ");
    stderr.lines.push(String(out));
  });
  q.setProp(consoleObj, "log", logFn);
  q.setProp(consoleObj, "error", errFn);
  q.setProp(q.global, "console", consoleObj);
  logFn.dispose();
  errFn.dispose();
  consoleObj.dispose();
}

function removeDangerousGlobals(ctx: QuickJSContext) {
  // QuickJS does not provide fetch/require by default, but remove in case future config adds them.
  const q = ctx;
  for (const name of ["fetch", "XMLHttpRequest", "WebSocket", "require", "process", "Deno", "import"]) {
    const undef = q.undefined;
    q.setProp(q.global, name, undef);
  }
}

export async function runJsQuickjs(params: { code: string; input?: string; maxRunMs: number; maxOutputBytes: number }): Promise<JsRunResult> {
  const started = Date.now();
  const qjs = await getQuickJS();
  const rt = qjs.newRuntime();
  const ctx = rt.newContext();

  const stdout = { lines: [] as string[] };
  const stderr = { lines: [] as string[] };

  let interrupted = false;
  const deadline = started + Math.max(1, params.maxRunMs);
  rt.setInterruptHandler(() => {
    if (Date.now() > deadline) {
      interrupted = true;
      return true;
    }
    return false;
  });

  attachConsole(ctx, stdout, stderr);
  removeDangerousGlobals(ctx);

  // Provide optional input as a global string.
  if (typeof params.input === "string") {
    const v = ctx.newString(params.input);
    ctx.setProp(ctx.global, "INPUT", v);
    v.dispose();
  }

  try {
    const result = ctx.evalCode(params.code);
    result.dispose();
    const runMs = Date.now() - started;
    const out = truncateUtf8(stdout.lines.join("\n"), params.maxOutputBytes);
    const err = truncateUtf8(stderr.lines.join("\n"), params.maxOutputBytes);
    ctx.dispose();
    rt.dispose();
    return { ok: !interrupted, stdout: out, stderr: err, runMs, error: interrupted ? { code: "TIMEOUT", message: "Execution timed out." } : undefined };
  } catch (e: any) {
    const runMs = Date.now() - started;
    const out = truncateUtf8(stdout.lines.join("\n"), params.maxOutputBytes);
    const err = truncateUtf8((stderr.lines.join("\n") || "") + (e?.message ? `\n${String(e.message)}` : ""), params.maxOutputBytes);
    ctx.dispose();
    rt.dispose();
    return { ok: false, stdout: out, stderr: err, runMs, error: { code: "JS_ERROR", message: "JavaScript error." } };
  }
}


