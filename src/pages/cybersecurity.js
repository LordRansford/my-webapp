import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Layout from "@/components/Layout";
import RsaPlayground from "@/components/RsaPlayground";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
  { id: "exercises", label: "Exercises" },
  { id: "media", label: "Adding media" },
];

export default function CybersecurityNotesPage() {
  const [activeId, setActiveId] = useState("overview");
  const [hashInput, setHashInput] = useState("Hello world");
  const [hashOutput, setHashOutput] = useState("");
  const [quizAnswer, setQuizAnswer] = useState("");
  const [quizResult, setQuizResult] = useState(null);

  const tocIds = useMemo(() => sections.map((s) => s.id), []);

  useEffect(() => {
    const handler = () => {
      let current = activeId;
      for (const id of tocIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= 140 && rect.bottom >= 140) {
          current = id;
          break;
        }
      }
      if (current !== activeId) setActiveId(current);
    };

    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [tocIds, activeId]);

  const computeHash = async (value) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(value);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    setHashOutput(hashHex);
  };

  const submitQuiz = () => {
    setQuizResult(quizAnswer === "b");
  };

  return (
    <Layout title="Cybersecurity Notes" description="Long-form notes on cybersecurity with interactive sandboxes and quick checks.">
      <Head>
        <title>Cybersecurity Notes</title>
      </Head>
      <div className="note-layout">
        <aside className="note-sidebar" aria-label="Contents">
          <p className="eyebrow">Contents</p>
          <ul className="note-toc">
            {sections.map((section) => (
              <li key={section.id}>
                <a className={activeId === section.id ? "note-toc__link is-active" : "note-toc__link"} href={`#${section.id}`}>
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        <article className="note-article">
          <header className="page-header">
            <p className="eyebrow">Notes</p>
            <h1>Cybersecurity Notes</h1>
            <p className="lead">
              A single page you can read, scan, and practice from. Follow the levels, try the sandboxes, and use the quick
              checks to see what stuck.
            </p>
          </header>

          <section id="overview" className="note-section">
            <h2>Overview</h2>
            <p>
              These notes move from first principles to advanced ideas. They are written in plain language, with short
              exercises and browser-only tools. You will see why confidentiality, integrity, and availability matter, how
              keys and hashes work, and how to think about future threats such as quantum computing.
            </p>
          </section>

          <section id="beginner" className="note-section">
            <h2>Beginner: fundamentals</h2>
            <p>
              Information security protects data from unauthorised access, tampering, and loss. The classic trio is
              confidentiality, integrity, and availability. Imagine a diary: the lock keeps it secret, tamper-evident ink
              protects integrity, and keeping it in reach protects availability.
            </p>
            <p>
              Cryptography turns readable text (plaintext) into scrambled text (ciphertext) using a key. A key is the
              secret recipe. Without it, ciphertext should look useless to an attacker.
            </p>
            <div className="panel stack">
              <p className="eyebrow">Story: Alice, Bob, and Eve</p>
              <p>
                Alice wants to send Bob a secret. If they share one key (symmetric), Eve can ruin things if she steals it
                during exchange. If they use two keys (asymmetric), Alice can publish a padlock (public key) and keep her
                private key safe. Bob locks a box with the padlock; only Alice can open it.
              </p>
              <p className="muted">Notice how asymmetric keys solve the key exchange problem without sharing a secret.</p>
            </div>
          </section>

          <section id="intermediate" className="note-section">
            <h2>Intermediate: modern cryptography</h2>
            <p>
              Symmetric ciphers like AES are fast and used for bulk data. Asymmetric systems like RSA and elliptic curves
              solve key exchange and identity. In practice, protocols use both: asymmetric to agree a session key, then
              symmetric for speed.
            </p>
            <div className="panel stack">
              <p className="eyebrow">RSA practice</p>
              <p className="muted">Generate a public/private pair below. Copy the public key, keep the private key safe.</p>
              <RsaPlayground />
            </div>
            <div className="panel stack">
              <p className="eyebrow">Diffie-Hellman intuition</p>
              <p>
                Diffie-Hellman lets two people agree a secret in public. Think of mixing paint: each shares a public shade,
                then mixes the other shade with their own private colour. Both end up with the same final colour; an
                eavesdropper sees only the public shades.
              </p>
            </div>
            <div className="panel stack">
              <p className="eyebrow">Digital signatures</p>
              <p>
                Sign with a private key, verify with a public key. Any tiny change breaks the signature. This proves who
                signed a message and that it was not altered.
              </p>
            </div>
          </section>

          <section id="advanced" className="note-section">
            <h2>Advanced: future and design</h2>
            <p>
              Quantum computing threatens RSA and ECC. Post-quantum algorithms such as lattice-based Kyber and Dilithium
              aim to stay secure even with quantum attacks. Crypto agility matters: design systems so you can swap
              algorithms as standards change.
            </p>
            <p>
              Zero trust is another design shift: never trust by location, always verify identity and device, and grant
              least privilege. Encrypt internally, log access, and assume breach.
            </p>
          </section>

          <section id="exercises" className="note-section">
            <h2>Exercises and sandboxes</h2>
            <div className="panel stack">
              <p className="eyebrow">Hashing (SHA-256)</p>
              <label className="control">
                Enter text to hash
                <textarea
                  value={hashInput}
                  onChange={(e) => {
                    const value = e.target.value;
                    setHashInput(value);
                    computeHash(value);
                  }}
                  rows={3}
                />
              </label>
              <div className="control-row">
                <button className="button primary" type="button" onClick={() => computeHash(hashInput)}>
                  Compute hash
                </button>
                <p className="muted">Runs locally in your browser via Web Crypto.</p>
              </div>
              {hashOutput && (
                <div className="hash-output">
                  <p className="eyebrow">Result</p>
                  <p className="mono">{hashOutput}</p>
                </div>
              )}
            </div>

            <div className="panel stack">
              <p className="eyebrow">Quiz</p>
              <p>Which statement is not true about symmetric encryption?</p>
              <div className="stack">
                <label className="radio">
                  <input type="radio" name="quiz" value="a" checked={quizAnswer === "a"} onChange={(e) => setQuizAnswer(e.target.value)} />
                  It uses the same key to lock and unlock data.
                </label>
                <label className="radio">
                  <input type="radio" name="quiz" value="b" checked={quizAnswer === "b"} onChange={(e) => setQuizAnswer(e.target.value)} />
                  It automatically solves the key exchange problem.
                </label>
                <label className="radio">
                  <input type="radio" name="quiz" value="c" checked={quizAnswer === "c"} onChange={(e) => setQuizAnswer(e.target.value)} />
                  It is fast for large volumes of data.
                </label>
              </div>
              <div className="control-row">
                <button className="button secondary" type="button" onClick={submitQuiz}>
                  Submit
                </button>
                {quizResult !== null && (
                  <p className={quizResult ? "status status--ok" : "status status--warn"}>
                    {quizResult
                      ? "Correct. Symmetric encryption still needs a separate way to share the key."
                      : "Not quite. Remember symmetric encryption does not handle key exchange on its own."}
                  </p>
                )}
              </div>
            </div>

            <div className="panel stack">
              <p className="eyebrow">Browser Python (hidden code)</p>
              <p className="muted">Click run to see a small RSA encrypt and decrypt cycle. Code stays hidden.</p>
              <runno-run runtime="python" hide-source class="runno-embed">
{`import rsa

public_key, private_key = rsa.newkeys(512)
message = 'Hello'
cipher = rsa.encrypt(message.encode(), public_key)
plain = rsa.decrypt(cipher, private_key).decode()

print('Original:', message)
print('Encrypted (hex):', cipher.hex())
print('Decrypted:', plain)`}
              </runno-run>
            </div>
          </section>

          <section id="media" className="note-section">
            <h2>Adding media</h2>
            <p>
              You can add pictures and videos to any note. Use markdown for images:
              <code> ![alt text](/path/to/image.jpg) </code>. For video, use a simple HTML embed such as
              <code> &lt;video controls src=&quot;/path/to/video.mp4&quot;&gt;&lt;/video&gt; </code> or an iframe if you are
              hosting elsewhere. Keep file sizes modest for faster loading and always include alt text.
            </p>
          </section>
        </article>
      </div>
    </Layout>
  );
}
