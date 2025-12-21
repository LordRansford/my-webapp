import Link from "next/link";
import Layout from "@/components/Layout";

const labs = [
  {
    title: "Python lab (Pyodide)",
    use: "Run Python in the browser for data transforms and quick experiments.",
    unique: "No server needed; open source Pyodide runtime.",
    example: `import math\nnums = [1,2,3]\nprint([math.sqrt(n) for n in nums])`,
    pros: "Fast to start, safe, offline-friendly.",
    cons: "No network or heavy native libs.",
  },
  {
    title: "WebCrypto studio",
    use: "Hash, sign, and verify in the browser with the SubtleCrypto API.",
    unique: "Standards-based crypto already in modern browsers.",
    example: `const data = new TextEncoder().encode("hello");\nconst hash = await crypto.subtle.digest("SHA-256", data);`,
    pros: "No dependencies, audited primitives.",
    cons: "Asymmetric keys can be tricky to manage.",
  },
  {
    title: "Certificate viewer",
    use: "Load a sample cert JSON and explore CN, SAN, issuer, and validity.",
    unique: "Shows chain of trust visually in-browser.",
    example: `{\n  "subject": "example.com",\n  "issuer": "Example CA",\n  "san": ["www.example.com"],\n  "notBefore": "2025-01-01"\n}`,
    pros: "Great for explaining TLS trust quickly.",
    cons: "Uses sample data only; no live network fetch.",
  },
  {
    title: "Hash and entropy lab",
    use: "See how tiny text changes alter hashes and how length drives entropy.",
    unique: "Combines avalanche demo with entropy slider.",
    example: `H = L * log2(N)\n# Change length to see bits of effort`,
    pros: "Instant visual feedback.",
    cons: "Didactic, not a production tool.",
  },
  {
    title: "Regex + log parser",
    use: "Test patterns against sample logs and extract fields.",
    unique: "Lightweight, client-only parsing with live matches.",
    example: `/user=(\\w+)/g  -> captures user field`,
    pros: "Great for quick triage and teaching patterns.",
    cons: "Not a replacement for SIEM-scale tooling.",
  },
];

export async function getStaticProps() {
  return { props: {}, revalidate: 300 };
}

export default function Home() {
  return (
    <Layout
      title="Ransford's Notes · Labs first"
      description="Browser-first labs for security, architecture, and AI. Practical, calm, and built for learning by doing."
    >
      <div className="hero">
        <div className="hero__copy">
          <p className="eyebrow">Hands-on learning, not hype</p>
          <h1>Ransford’s Notes</h1>
          <p className="lead">
            I build small labs that let you test an idea in minutes. This is for practitioners who prefer a concrete
            example over a long lecture.
          </p>
          <p className="muted">
            What this is: learning tools and notes you can reuse at work. What it is not: a certification provider, a
            penetration test service, or a promise of professional advice.
          </p>
          <div className="actions">
            <Link href="/tools" className="button primary">
              Open the labs
            </Link>
          </div>
        </div>
        <div className="hero__panel">
          <p className="eyebrow">How the labs are built</p>
          <ul className="hero-list">
            <li>
              <span className="dot dot--accent" />
              Open source runtimes and browser APIs (Pyodide, WebCrypto, client-only React)
            </li>
            <li>
              <span className="dot dot--accent" />
              Most tools run client-side; your inputs stay in your browser unless a page clearly says otherwise
            </li>
            <li>
              <span className="dot dot--accent" />
              Each tool includes context, concept, logical flow, and practical examples
            </li>
          </ul>
          <p className="muted">
            If something is unclear or feels off, assume I need to explain it better and tell me so I can improve it.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="section-heading">
          <h2>Labs with clear boundaries</h2>
          <span className="hint">Examples, trade-offs, and a clear statement of what the tool does</span>
        </div>
        <div className="card-grid">
          {labs.map((lab) => (
            <div key={lab.title} className="card" style={{ display: "grid", gap: "0.6rem" }}>
              <div>
                <h3>{lab.title}</h3>
                <p className="muted">{lab.use}</p>
              </div>
              <p>
                <strong>Concept</strong>: {lab.unique}
              </p>
              <p className="mono" style={{ whiteSpace: "pre-wrap" }}>
                {lab.example}
              </p>
              <p className="muted">Pros: {lab.pros}</p>
              <p className="muted">Cons: {lab.cons}</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
