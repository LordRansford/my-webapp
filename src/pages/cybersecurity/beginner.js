import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Layout from "@/components/Layout";
import RsaPlayground from "@/components/RsaPlayground";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "first-principles", label: "First principles" },
  { id: "basics", label: "Basics of cryptography" },
  { id: "symmetric-asymmetric", label: "Symmetric vs asymmetric" },
  { id: "story", label: "Alice, Bob, and Eve" },
  { id: "real-world", label: "Real-world examples" },
  { id: "hands-on", label: "Hands-on exercises" },
  { id: "wrap-up", label: "Beginner wrap-up" },
];

export default function CybersecurityBeginner() {
  const [activeId, setActiveId] = useState("overview");
  const [hashInput, setHashInput] = useState("Hello world");
  const [hashOutput, setHashOutput] = useState("");

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

  return (
    <Layout
      title="Cybersecurity Notes — Beginner"
      description="Foundations of cybersecurity and cryptography with hands-on prompts."
    >
      <Head>
        <title>Cybersecurity Notes — Beginner</title>
      </Head>
      <div className="note-layout">
        <aside className="note-sidebar" aria-label="Contents">
          <p className="eyebrow">Sections</p>
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
            <p className="eyebrow">Cybersecurity Notes</p>
            <h1>Beginner level</h1>
            <p className="lead">
              Interactive Cybersecurity Course: From Basics to Advanced. Welcome to a hands-on journey through
              cybersecurity and cryptography. We&apos;ll start from first principles - understanding what information
              security means - and build up to advanced topics like post-quantum cryptography and zero trust
              architecture. Along the way, you&apos;ll encounter stories (meet Alice, Bob, and an eavesdropper Eve),
              real-world examples, and interactive exercises. Each level (Beginner, Intermediate, Advanced) is a
              self-contained module/page. By the end, you&apos;ll not only grasp the how of security techniques, but also
              why they work - with the math, analogies, and best practices that make them tick. Get ready to learn by
              doing in a fun, inclusive way!
            </p>
          </header>

          <section id="overview" className="note-section">
            <h2>Beginner Level: Fundamentals of Cybersecurity and Cryptography</h2>
            <h3>What is Information Security? (First Principles)</h3>
            <p>
              Information Security is the practice of protecting information from unauthorized access, alteration, or
              destruction. A classic model is the CIA Triad:
            </p>
            <ul>
              <li>Confidentiality: Ensuring information is accessible only to those authorized (keeping secrets secret).</li>
              <li>Integrity: Ensuring information cannot be altered undetectably (your data isn&apos;t tampered with).</li>
              <li>Availability: Ensuring information and systems are available when needed (keeping services running for those who need them).</li>
            </ul>
            <p>
              Think of a diary: locking it keeps it confidential, using ink that shows tampering ensures integrity, and
              keeping it in a safe place ensures you can read it when you want (availability). Cybersecurity builds on
              these principles to protect digital data. It spans many domains - from network security to application
              security - but at its heart is cryptography, the art and science of secret codes.
            </p>
          </section>

          <section id="first-principles" className="note-section">
            <h2>The Basics of Cryptography - Locking and Unlocking Data</h2>
            <p>
              Cryptography is all about transforming readable data (plaintext) into unreadable form (ciphertext) using a
              process called encryption, and back to plaintext using decryption. In simple terms, encryption is like
              scrambling a message with a secret recipe, and decryption is unscrambling it with the same recipe. This
              ensures confidentiality: even if Eve (an eavesdropper) intercepts the ciphertext, she can&apos;t understand it
              without the secret &quot;recipe.&quot;
            </p>
            <div className="panel">
              <p className="eyebrow">How does encryption work?</p>
              <ol className="stack">
                <li>You start with a readable message (plaintext), e.g. HELLO.</li>
                <li>You apply an encryption key - essentially a secret value or password - via an encryption algorithm.</li>
                <li>The output is ciphertext, e.g. KHOOR.</li>
                <li>To decrypt, the authorized recipient applies the corresponding decryption key to recover the original.</li>
              </ol>
            </div>
            <p>
              Real-world example: When you use a messaging app and see a lock icon, your message text is being encrypted.
              Only the intended recipient&apos;s device (with the key) can decrypt and read it.
            </p>
            <div className="panel stack">
              <p className="eyebrow">Plaintext, Ciphertext, and Keys</p>
              <p>
                In any encryption: plaintext is the original data; ciphertext is the encrypted data; the key is the secret
                that locks or unlocks the data. Without the key, even if you know the algorithm, you shouldn&apos;t be able to
                easily get plaintext from ciphertext.
              </p>
              <p>
                Under the hood, computers perform encryption on binary data. Everything on a computer is ultimately just
                1s and 0s (binary). For example, the letter `A&apos; is represented in ASCII code as 65, which in binary is
                01000001. When we encrypt, we are mathematically transforming these numbers.
              </p>
            </div>
          </section>

          <section id="symmetric-asymmetric" className="note-section">
            <h2>Symmetric vs. Asymmetric Cryptography (One Key or Two?)</h2>
            <div className="panel stack">
              <p className="eyebrow">Symmetric Encryption</p>
              <p>
                Uses one key for both encryption and decryption. It&apos;s like a shared house key - if Alice and Bob both have
                a copy, either can lock or unlock the door. Symmetric ciphers (e.g. AES) are typically very fast and great
                for bulk data encryption. The challenge is key exchange - how do you share the secret key securely with
                someone in the first place? If Eve intercepts the key during exchange, she can decrypt everything.
              </p>
            </div>
            <div className="panel stack">
              <p className="eyebrow">Asymmetric Encryption</p>
              <p>
                Uses two keys - a public key and a private key - which are mathematically linked. It&apos;s more like a padlock:
                you can give out copies of an open padlock (public key) to anyone, but only you have the physical key
                (private key) that opens it. Asymmetric encryption solves the key exchange problem (no need to share a
                secret in advance), but it&apos;s slower and more computationally intensive than symmetric encryption.
              </p>
              <p>
                Public-key cryptography illustrated via the padlock analogy: Public keys are like open padlocks anyone can
                use to lock a box for you, but only your private key can unlock it.
              </p>
            </div>
            <div className="panel stack">
              <p className="eyebrow">Try RSA keys</p>
              <p className="muted">Generate a pair and observe the difference between public and private material.</p>
              <RsaPlayground />
            </div>
            <p>
              In practice, modern secure systems use both types: they use asymmetric encryption to exchange a symmetric
              key, and then use symmetric encryption for the bulk of the data. This is how HTTPS secures the web.
            </p>
          </section>

          <section id="story" className="note-section">
            <h2>Story Time: Alice and Bob&apos;s Secret Message</h2>
            <p>
              Let&apos;s tie these concepts together in a story: - Alice wants to send a secret message to Bob without Eve
              (the eavesdropper) reading it. They start with a simple approach: agree on a password (key) and use it to
              scramble messages (symmetric encryption). This is like both having the same secret decoder ring. - Problem:
              How do they agree on the secret key in the first place? If Alice just emails the key to Bob, Eve could steal
              it - oops! This is the key exchange problem. - Enter public-key cryptography: Alice generates a matching key
              pair - a public key (padlock) and private key (secret key). She publishes the public key openly (even Eve
              can see it, but that&apos;s fine). Bob uses Alice&apos;s public key to encrypt the message. Now, even if Eve
              intercepts the encrypted message, she can&apos;t decrypt it - only Alice&apos;s private key can unlock it. Alice and
              Bob have solved the secret-sharing dilemma by using clever math instead of a shared password. - When Alice
              replies, she can do the same with Bob&apos;s public key. Now both sides are communicating securely without ever
              having exchanged a private secret.
            </p>
            <p>This simple story underpins almost all secure communication on the internet today.</p>
          </section>

          <section id="real-world" className="note-section">
            <h2>Real-World Examples (You Use This Everyday!)</h2>
            <ul>
              <li>
                Web Browsing (HTTPS): Your browser uses the website&apos;s public key to establish a secure connection, then
                exchanges a symmetric session key to encrypt data.
              </li>
              <li>
                Secure Messaging: Apps use end-to-end encryption with public-private key pairs. Messages encrypted with the
                recipient&apos;s public key can only be decrypted with their private key.
              </li>
              <li>
                Wi-Fi Security: WPA2 uses symmetric encryption (AES) with the Wi-Fi password as the shared key.
              </li>
              <li>
                ATM Cards and PINs: Chips use cryptographic keys; PINs are verified by one-way hashing.
              </li>
            </ul>
          </section>

          <section id="hands-on" className="note-section">
            <h2>Hands-On Exercise</h2>
            <p>
              Secret Message with a Shift Cipher: Below is a simple interactive tool. Enter a short message and choose a
              number shift (the key). The tool will encrypt your message by shifting letters, and you can try to decrypt it
              by shifting back. This simulates the Caesar cipher discussed earlier.
            </p>
            <p>
              Binary Peek: Input any character and see its numeric code and binary representation. This shows how computers
              see your data before and after encryption.
            </p>
            <div className="panel stack">
              <p className="eyebrow">Hashing quick check</p>
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
                  Compute hash (SHA-256)
                </button>
                {hashOutput && <p className="mono">{hashOutput}</p>}
              </div>
            </div>
          </section>

          <section id="wrap-up" className="note-section">
            <h2>Beginner Wrap-Up</h2>
            <p>
              Great job on completing the beginner level! You&apos;ve learned why we need cybersecurity, what cryptography
              is, and the difference between symmetric and asymmetric encryption. You also met Alice, Bob, and Eve - who
              will continue to guide us. You even tried out a simple cipher yourself.
            </p>
            <p>
              Coming up next: Intermediate level with modern cryptographic algorithms (AES, RSA, ECC, hashing), how these
              pieces work together in real systems, and more hands-on practice.
            </p>
          </section>
        </article>
      </div>
    </Layout>
  );
}
