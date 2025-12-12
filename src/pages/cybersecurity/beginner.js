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
              cybersecurity and cryptography. We&apos;ll start from first principles and build up to advanced topics like
              post-quantum cryptography and zero trust architecture. Each level is a self-contained module. By the end,
              you&apos;ll understand how and why security techniques work, with the math, analogies, and best practices that
              make them tick.
            </p>
          </header>

          <section id="overview" className="note-section">
            <h2>Overview</h2>
            <p>
              Beginner Level: Fundamentals of Cybersecurity and Cryptography. What is Information Security? (First
              Principles)
            </p>
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
            <p>How does encryption work? At a high level:</p>
            <ol>
              <li>You start with a readable message (plaintext), e.g. HELLO.</li>
              <li>You apply an encryption key via an algorithm.</li>
              <li>The output is ciphertext, e.g. KHOOR.</li>
              <li>To decrypt, the authorized recipient applies the corresponding decryption key to recover the original.</li>
            </ol>
            <p>
              Plaintext, Ciphertext, and Keys: In any encryption: plaintext is the original data; ciphertext is the
              encrypted data; the key is the secret that locks or unlocks the data. Without the key, even if you know the
              algorithm, you shouldn&apos;t be able to easily get plaintext from ciphertext. Under the hood, computers perform
              encryption on binary data.
            </p>
          </section>

          <section id="symmetric-asymmetric" className="note-section">
            <h2>Symmetric vs. Asymmetric Cryptography</h2>
            <p>
              Symmetric Encryption: Uses one key for both encryption and decryption. It&apos;s like a shared house key. These
              ciphers (e.g. AES) are fast and great for bulk data. The challenge is key exchange—how do you share the
              secret key securely?
            </p>
            <p>
              Asymmetric Encryption: Uses two keys—a public key and a private key. The public key can be shared openly,
              while the private key is kept secret. This solves the key exchange problem without needing a shared secret
              in advance, but it&apos;s slower than symmetric encryption.
            </p>
            <div className="panel stack">
              <p className="eyebrow">Try RSA keys</p>
              <p className="muted">Generate a pair and observe the difference between public and private material.</p>
              <RsaPlayground />
            </div>
          </section>

          <section id="story" className="note-section">
            <h2>Story Time: Alice and Bob&apos;s Secret Message</h2>
            <p>
              Alice wants to send a secret message to Bob without Eve reading it. They start with symmetric encryption
              using a shared password (key). Problem: how do they share the key safely? If Alice emails the key, Eve could
              steal it—this is the key exchange problem. Enter public-key cryptography: Alice generates a public/private
              key pair. She publishes the public key. Bob uses it to encrypt his message. Even if Eve intercepts it, she
              can&apos;t decrypt it; only Alice&apos;s private key can.
            </p>
          </section>

          <section id="real-world" className="note-section">
            <h2>Real-World Examples</h2>
            <ul>
              <li>
                Web Browsing (HTTPS): The padlock icon shows your browser used the site&apos;s public key to establish a secure
                connection, exchange a symmetric session key, then encrypt data with that key.
              </li>
              <li>
                Secure Messaging: Apps like Signal and WhatsApp use end-to-end encryption with public-private key pairs.
              </li>
              <li>
                Wi-Fi Security: WPA2 uses symmetric encryption (AES) with the Wi-Fi password as the shared key.
              </li>
              <li>
                ATM Cards and PINs: Chips use cryptographic keys; PINs are verified with one-way hashing.
              </li>
            </ul>
          </section>

          <section id="hands-on" className="note-section">
            <h2>Hands-On Exercise</h2>
            <p>
              Secret Message with a Shift Cipher: Enter a short message and choose a number shift (the key). The tool will
              encrypt your message by shifting letters, and you can try to decrypt it by shifting back. (Toy cipher for
              learning only.)
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
              You learned why we need cybersecurity, what cryptography is, and the difference between symmetric and
              asymmetric encryption. Alice, Bob, and Eve will stay with us as we move to intermediate topics: modern
              algorithms (AES, RSA, ECC, hashing), how they combine in real systems, and how math underpins security.
            </p>
          </section>
        </article>
      </div>
    </Layout>
  );
}
