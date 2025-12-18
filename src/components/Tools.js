import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import PythonPlayground from "@/components/PythonPlayground";
import RsaPlayground from "@/components/RsaPlayground";
import CryptoDemo from "@/components/CryptoDemo";
import RegexTester from "@/components/tools/RegexTester";
import SchemaInspector from "@/components/tools/SchemaInspector";
import JsPlayground from "@/components/tools/JsPlayground";
import PasswordEntropyLab from "@/components/tools/PasswordEntropyLab";
import CertViewer from "@/components/tools/CertViewer";
import LogicGateLab from "@/components/tools/LogicGateLab";

const SqlPlayground = dynamic(() => import("@/components/tools/SqlPlayground"), {
  ssr: false,
  // Avoid hydration mismatch: render nothing on the server and during client boot
  loading: () => null,
});

const categories = [
  {
    title: "Useful tool suites",
    blurb: "Curated, browser-only labs with an Apple-like feel.",
    tools: [
      {
        title: "AI tools",
        context: "Prompt clarity, evaluation metrics, dataset splits.",
        component: (
          <Link className="button primary" href="/tools/ai">
            Open AI labs
          </Link>
        ),
      },
      {
        title: "Cybersecurity tools",
        context: "Email header explainer, phishing simulator, link inspector.",
        component: (
          <Link className="button primary" href="/tools/cybersecurity">
            Open Cyber labs
          </Link>
        ),
      },
      {
        title: "Software architecture tools",
        context: "Latency budgets, availability planning, C4 context sketch.",
        component: (
          <Link className="button primary" href="/tools/software-architecture">
            Open Architecture labs
          </Link>
        ),
      },
      {
        title: "Digitalisation tools",
        context: "Data flows, quality scorecard, process friction heatmap.",
        component: (
          <Link className="button primary" href="/tools/digitalisation">
            Open Digitalisation labs
          </Link>
        ),
      },
    ],
  },
  {
    title: "Compute sandboxes",
    blurb: "Run code with no install. Everything executes in your browser.",
    tools: [
      {
        title: "Python (Pyodide)",
        context: "Quick automation, data transforms, and teaching basics.",
        concept: "Loads CPython into WebAssembly so Python runs locally.",
        logical: "Type → run → see stdout instantly.",
        physical: "Pure WASM runtime; no server calls.",
        example: "import math\nnums = [1,2,3]\nprint([math.sqrt(n) for n in nums])",
        pros: "Fast start, offline-friendly, safe.",
        cons: "No network; some native-heavy libs unavailable.",
        component: <PythonPlayground />,
      },
      {
        title: "JavaScript sandbox",
        context: "Understand JS behaviour, async, and parsing quickly.",
        concept: "Iframe sandbox with isolated console output.",
        logical: "Write code → run in sandbox → view console logs.",
        physical: "Sandboxed iframe, scripts only, no eval in main thread.",
        example: "// Map numbers\nconsole.log([1,2,3].map(n => n*n));",
        pros: "Safe, fast, zero setup.",
        cons: "No DOM access; limited to script logic.",
        component: <JsPlayground />,
      },
      {
        title: "SQL (SQLite · sql.js)",
        context: "Learn queries, joins, and DDL without installing a DB.",
        concept: "SQLite compiled to WebAssembly runs fully client side.",
        logical: "Run multiple statements; last SELECT is shown.",
        physical: "No network; DB lives in memory in your browser.",
        example: "create table users(id int, name text);\nselect * from users;",
        pros: "Great for teaching and quick experiments.",
        cons: "Ephemeral DB; not for large datasets.",
        component: <SqlPlayground />,
      },
    ],
  },
  {
    title: "Security & crypto",
    blurb: "Use browser-native crypto safely.",
    tools: [
      {
        title: "RSA-OAEP · SHA-256",
        context: "Generate keys, encrypt, and explain asymmetry.",
        concept: "WebCrypto powers keygen and encryption client-side.",
        logical: "Generate → copy public key → encrypt/decrypt within the sandbox.",
        physical: "Keys stay in memory; nothing leaves the page.",
        example: "Generate 2048-bit keys and test a ciphertext round-trip.",
        pros: "Audited primitives, no backend.",
        cons: "Browser API quirks; key export formats to manage.",
        component: <RsaPlayground />,
      },
      {
        title: "Entropy + hashing",
        context: "Show avalanche effect and randomness for secrets.",
        concept: "SubtleCrypto hashing plus crypto.getRandomValues.",
        logical: "Input text → hash; generate random bytes for keys.",
        physical: "All computation in-browser; outputs copyable.",
        example: "Hash 'hello' vs 'hello!' and compare hex output.",
        pros: "Lightweight, standards based.",
        cons: "Educational; not a production key manager.",
        component: <CryptoDemo />,
      },
      {
        title: "Password entropy meter",
        context: "Teach length vs complexity trade-offs.",
        concept: "Client-side entropy estimate and illustrative crack time.",
        logical: "Set length and charset → see bits of entropy.",
        physical: "Pure browser math; no network.",
        example: "Length 16 with letters+digits → ~95 bits entropy.",
        pros: "Clear teaching aid.",
        cons: "Illustrative only; real-world factors vary.",
        component: <PasswordEntropyLab />,
      },
      {
        title: "Certificate viewer",
        context: "Explore CN, SAN, issuer, and validity on sample certs.",
        concept: "Parses JSON fields locally; no live probing.",
        logical: "Paste JSON → view fields and trust details.",
        physical: "Client-only parsing.",
        example: '{ "subject": "example.com", "issuer": "Example CA" }',
        pros: "Great for TLS explanations.",
        cons: "Static samples; not a live scanner.",
        component: <CertViewer />,
      },
    ],
  },
  {
    title: "Text & patterns",
    blurb: "Parse and reason about logs without extra tools.",
    tools: [
      {
        title: "Regex tester",
        context: "Triaging logs and learning capture groups.",
        concept: "JavaScript RegExp against your sample text.",
        logical: "Pattern + flags → matches and groups.",
        physical: "Client-only parsing; nothing is stored.",
        example: "Pattern: user=(\\w+)\nFlags: g",
        pros: "Instant feedback, good for learning.",
        cons: "Not a full SIEM; simple matching only.",
        component: <RegexTester />,
      },
    ],
  },
  {
    title: "Data & schema",
    blurb: "Explore structures like CIM quickly.",
    tools: [
      {
        title: "Schema inspector (CIM)",
        context: "Understand entities, fields, and relationships.",
        concept: "Parse JSON, list entities, fields, and relations.",
        logical: "Paste schema → parse → view entities/links.",
        physical: "Runs locally; no upload or network.",
        example: `{ "entities": [ {"name":"Asset","fields":[...] } ], "relationships":[...] }`,
        pros: "Great for onboarding and quick audits.",
        cons: "Static view; no live validation against data.",
        component: <SchemaInspector />,
      },
    ],
  },
  {
    title: "Engineering & logic",
    blurb: "Explore digital fundamentals without hardware.",
    tools: [
      {
        title: "Logic gate simulator",
        context: "Teach AND / OR / XOR with toggles and truth tables.",
        concept: "Pure client-side logic; immediate outputs.",
        logical: "Toggle inputs → pick gate → view output and table.",
        physical: "Runs entirely in browser; no external libs.",
        example: "Inputs 1,1 on XOR → output 0",
        pros: "Great for beginners crossing into computing.",
        cons: "Simple gates only (no timing/propagation).",
        component: <LogicGateLab />,
      },
    ],
  },
];

export default function Tools() {
  return (
    <div className="stack" style={{ gap: "2rem" }}>
      {categories.map((cat) => (
        <section key={cat.title} className="stack" style={{ gap: "0.8rem" }}>
          <div className="section-heading">
            <h2>{cat.title}</h2>
            <span className="hint">{cat.blurb}</span>
          </div>
          <div className="tool-grid">
            {cat.tools.map((tool) => (
              <div key={tool.title} className="card" style={{ display: "grid", gap: "0.5rem" }}>
                <div>
                  <h3>{tool.title}</h3>
                  <p className="muted">{tool.context}</p>
                </div>
                <p><strong>Concept</strong>: {tool.concept}</p>
                <p><strong>Logical flow</strong>: {tool.logical}</p>
                <p><strong>Physical</strong>: {tool.physical}</p>
                <p className="mono" style={{ whiteSpace: "pre-wrap" }}>{tool.example}</p>
                <p className="muted">Pros: {tool.pros}</p>
                <p className="muted">Cons: {tool.cons}</p>
                {tool.component}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
