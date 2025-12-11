import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Layout from "@/components/Layout";
import RsaPlayground from "@/components/RsaPlayground";

const sections = [
  { id: "intro", label: "Introduction" },
  { id: "symmetric", label: "Symmetric encryption" },
  { id: "asymmetric", label: "Asymmetric encryption" },
  { id: "hashing", label: "Hashing in practice" },
  { id: "exercises", label: "Exercises and checks" },
  { id: "media", label: "Adding media" },
];

export default function CybersecurityNotesPage() {
  const [activeId, setActiveId] = useState("intro");
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
      setActiveId(current);
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
    <Layout title="Cybersecurity Notes" description="Notes on cybersecurity with interactive sandboxes and quick checks.">
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
              A clear path from first principles to practical experiments. Read the notes, try the sandboxes, and
              check your understanding as you go.
            </p>
          </header>

          <section id="intro" className="note-section">
            <h2>Introduction</h2>
            <p>
              Security protects confidentiality, integrity, and availability. It is about the right people seeing the
              right data at the right time, and no one else. Good security also respects the human who has to use it.
            </p>
            <p>
              Start by noticing threats and impacts. Think about what happens if data leaks, if it changes unexpectedly,
              or if it becomes unavailable. Those simple checks anchor every control you add later.
            </p>
            <div className="panel">
              <p className="eyebrow">Quick check</p>
              <p className="muted">List one item you must keep secret, one you must keep accurate, and one that must stay online.</p>
            </div>
          </section>

          <section id="symmetric" className="note-section">
            <h2>Symmetric encryption</h2>
            <p>
              Symmetric encryption uses one shared key for both locking and unlocking data. Algorithms such as AES are
              fast and well tested. The main risk is sharing the key safely with the other party.
            </p>
            <p>
              Think of a locker with one code. Everyone with the code can open it. If the code leaks, the locker is no
              longer private.
            </p>
            <div className="panel">
              <p className="eyebrow">Practice</p>
              <ol className="stack">
                <li>Write down three ways to share a secret key without email.</li>
                <li>Decide which is safest and why.</li>
              </ol>
            </div>
          </section>

          <section id="asymmetric" className="note-section">
            <h2>Asymmetric encryption</h2>
            <p>
              Asymmetric encryption uses two keys: a public key to lock data and a private key to unlock it. You can
              share the public key openly; the private key stays with you. This removes the need to pass a shared secret
              around.
            </p>
            <p>
              Public keys let anyone send you a private message. Private keys prove identity and must never leave your
              control. Protect them with strong device security and backups.
            </p>
            <div className="panel stack">
              <p className="eyebrow">Try it</p>
              <p className="muted">
                Use the RSA sandbox to generate a pair. Copy the public key, keep the private key safe, and note how the
                keys differ.
              </p>
              <RsaPlayground />
            </div>
          </section>

          <section id="hashing" className="note-section">
            <h2>Hashing in practice</h2>
            <p>
              A hash turns any input into a fixed-length fingerprint. Small changes in input create large changes in the
              output. Hashes help with integrity checks and password storage when paired with salts and slow functions.
            </p>
            <div className="panel stack">
              <p className="eyebrow">SHA-256 sandbox</p>
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
                <p className="muted">Runs in your browser via Web Crypto. No data leaves your device.</p>
              </div>
              {hashOutput && (
                <div className="hash-output">
                  <p className="eyebrow">Result</p>
                  <p className="mono">{hashOutput}</p>
                </div>
              )}
            </div>
          </section>

          <section id="exercises" className="note-section">
            <h2>Exercises and checks</h2>
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
              <p className="muted">
                This Python cell runs in your browser via Runno. The code is hidden to keep the focus on the result.
                Click the run button to see a tiny RSA encrypt and decrypt cycle.
              </p>
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
              hosting elsewhere.
            </p>
            <p className="muted">Keep file sizes small for faster loading, and add meaningful alt text for accessibility.</p>
          </section>
        </article>
      </div>
    </Layout>
  );
}
