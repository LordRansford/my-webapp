import React, { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

const defaultSnippet = `import secrets
import time

def audit_latency(trials=3):
    timings = []
    for _ in range(trials):
        start = time.perf_counter()
        secrets.token_hex(32)
        timings.append((time.perf_counter() - start) * 1000)
    return sum(timings) / len(timings)

print("Median keygen latency (ms):", round(audit_latency(), 4))
print("Confidentiality check: input never leaves the browser.")`;

export default function PythonPlayground() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    import("@runno/runtime")
      .then(() => {
        if (isMounted) setReady(true);
      })
      .catch((error) => {
        if (isMounted) {
          setReady(false);
          setError("Python runtime could not load in this browser session. Please refresh and try again.");
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="panel">
      <div className="panel__header">
        <div className="chip chip--accent">
          <Sparkles size={14} aria-hidden="true" />
          Python (Runno · WASM)
        </div>
        <p className="muted">Runs entirely in your browser for fast, isolated experiments.</p>
      </div>

      {ready ? (
        <runno-run runtime="python" editor controls>
          {defaultSnippet}
        </runno-run>
      ) : (
        <p className="muted" role={error ? "alert" : "status"} aria-live="polite">
          {error ? error : "Loading the Python runtime…"}
        </p>
      )}
    </section>
  );
}
