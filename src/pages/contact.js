"use client";

import { useState } from "react";
import Layout from "@/components/Layout";

export default function ContactPage() {
  const [status, setStatus] = useState("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "", company: "", extra: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Honeypot check
    if (form.extra) {
      return;
    }
    
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatus("error");
      return;
    }
    
    setStatus("sending");
    try {
      const res = await fetch("/api/contact/request", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company,
          message: form.message,
          // extra is honeypot, intentionally omitted
        }),
      });
      // Prevent enumeration: always show a generic success on 200/202.
      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", message: "", company: "", extra: "" });
        return;
      }
      setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <Layout
      title="Contact - Ransford's Notes"
      description="Get in touch with questions, feedback, or collaboration ideas."
    >
      <header className="page-header">
        <p className="eyebrow">Contact</p>
        <h1>Get in touch</h1>
        <p className="lead">
          I am happy to hear about collaborations, classroom use, speaking, corrections, or simply that an explanation finally clicked.
        </p>
      </header>

      <section className="section">
        <div className="card">
          <h2>Send a message</h2>
          <form onSubmit={handleSubmit} noValidate>
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="name">Name *</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  aria-required="true"
                />
              </div>
              <div className="form-field">
                <label htmlFor="email">Email *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  aria-required="true"
                />
              </div>
              <div className="form-field">
                <label htmlFor="company">Organisation (optional)</label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  autoComplete="organization"
                  value={form.company}
                  onChange={handleChange}
                />
              </div>
              <div className="form-field">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  required
                  aria-required="true"
                />
              </div>
              <div className="form-field" aria-hidden="true" style={{ position: "absolute", left: "-9999px" }}>
                <label htmlFor="extra">Leave this empty</label>
                <input
                  id="extra"
                  name="extra"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.extra}
                  onChange={handleChange}
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="button primary" disabled={status === "sending"}>
                  {status === "sending" ? "Sending..." : "Send message"}
                </button>
                {status === "error" && (
                  <p className="text-rose-600 text-sm" role="alert">
                    Could not send right now. Please try again.
                  </p>
                )}
                {status === "sent" && (
                  <p className="text-emerald-700 text-sm" role="alert">
                    Thanks. Your message was received.
                  </p>
                )}
              </div>
            </div>
          </form>
        </div>
      </section>

      <section className="section">
        <h2>Other ways to reach me</h2>
        <ul className="list">
          <li>
            <strong>WhatsApp:</strong>{" "}
            <a className="text-link" href="/api/contact/whatsapp">
              Start a chat
            </a>
          </li>
          <li>
            <strong>GitHub:</strong>{" "}
            <a
              className="text-link"
              href="https://github.com/LordRansford"
              target="_blank"
              rel="noreferrer"
            >
              github.com/LordRansford
            </a>
          </li>
        </ul>
        <p className="muted">
          I aim to reply within a few working days. If you are writing about something specific, include who you are, why you are reaching out, and any useful links. It helps me reply clearly and quickly.
        </p>
      </section>
    </Layout>
  );
}
