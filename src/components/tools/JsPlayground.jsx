"use client";

import { useEffect, useRef, useState } from "react";

export default function JsPlayground() {
  const [code, setCode] = useState(`// Try JavaScript in a sandboxed iframe\nconst nums = [1,2,3];\nconsole.log('Squares:', nums.map(n => n*n));`);
  const [output, setOutput] = useState([]);
  const iframeRef = useRef(null);

  useEffect(() => {
    function onMessage(e) {
      if (e.data && e.data.type === "js-playground-log") {
        setOutput((prev) => [...prev, e.data.payload]);
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  function run() {
    setOutput([]);
    const iframe = iframeRef.current;
    if (!iframe) return;
    const srcDoc = `
      <script>
        const send = (msg) => parent.postMessage({ type: 'js-playground-log', payload: msg }, '*');
        console.log = (...args) => send(args.join(' '));
        console.error = (...args) => send('Error: ' + args.join(' '));
        try {
          ${code}
        } catch (err) {
          send('Error: ' + err.message);
        }
      </script>
    `;
    iframe.srcdoc = srcDoc;
  }

  return (
    <div className="stack" style={{ gap: "0.6rem" }}>
      <p className="muted">
        Run JavaScript safely in a sandboxed iframe. Great for event loop demos, parsing, and small logic tests.
      </p>
      <label className="control">
        <span>Code</span>
        <textarea rows={8} value={code} onChange={(e) => setCode(e.target.value)} />
      </label>
      <div className="control-row">
        <button className="button primary" type="button" onClick={run}>
          Run in sandbox
        </button>
        <span className="muted">Console output appears below. The iframe is sandboxed (scripts only).</span>
      </div>
      <div className="rounded-lg border px-3 py-3 bg-gray-50">
        <p className="eyebrow">Output</p>
        {output.length === 0 ? (
          <p className="muted">No output yet.</p>
        ) : (
          <ul className="stack" style={{ margin: 0 }}>
            {output.map((line, idx) => (
              <li key={idx} className="font-mono text-sm text-gray-900">
                {line}
              </li>
            ))}
          </ul>
        )}
      </div>
      <iframe
        ref={iframeRef}
        sandbox="allow-scripts"
        style={{ display: "none" }}
        aria-hidden="true"
      />
    </div>
  );
}
