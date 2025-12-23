## RansfordsNotes Runner (local only)

This is a minimal, local-only compute runner used to prove the secure boundary.
It does not execute arbitrary code.

## Stage 3 WASM approach

We use QuickJS WASM for JavaScript execution. It is small, reliable, and runs without OS shell access.
Python is stubbed in Stage 3 to keep the runner stable and predictable. A future stage can add a Python WASM runtime.

## Stage 3 sandbox decision

We use **Option 2** for Stage 3:

- JavaScript runs in **QuickJS WebAssembly** inside the Runner.
- Python is **stubbed** for now and returns a clear "coming soon" response.

Why:

- QuickJS has a small operational footprint and is reliable for deterministic beginner labs.
- Pyodide is substantially heavier to run inside a local Docker Runner and would add startup cost and maintenance risk.
- This keeps the Runner stable while still proving real sandboxed execution.

### Endpoint

- POST `/run`

### Allowed toolIds

- `sandbox-echo`
- `code-runner`

### Hard caps (v1)

- maxRunMs: 30s
- maxOutputBytes: 200kb

### Hard caps (code-runner, stage 3)

- maxRunMs: 8s
- maxOutputBytes: 60kb
- maxMemoryMb: 128
- maxCodeChars: 6000


