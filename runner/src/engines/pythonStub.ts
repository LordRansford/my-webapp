export type PyStubResponse = {
  ok: boolean;
  stdout: string;
  stderr: string;
  runMs: number;
  error?: { code: string; message: string };
};

export async function runPythonStub(): Promise<PyStubResponse> {
  return {
    ok: false,
    stdout: "",
    stderr: "",
    runMs: 0,
    error: { code: "PYTHON_NOT_AVAILABLE", message: "Python sandbox coming soon." },
  };
}


