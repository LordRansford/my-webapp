"use client";

import { useMemo, useState } from "react";

const sampleCert = {
  subject: "www.example.com",
  issuer: "Example CA",
  san: ["www.example.com", "example.com"],
  notBefore: "2025-01-01",
  notAfter: "2027-01-01",
  serialNumber: "12:34:56:78:90",
};

export default function CertViewer() {
  const [json, setJson] = useState(JSON.stringify(sampleCert, null, 2));

  const parsed = useMemo(() => {
    try {
      const data = JSON.parse(json);
      return { error: "", data };
    } catch (err) {
      return { error: err.message, data: null };
    }
  }, [json]);

  return (
    <div className="stack" style={{ gap: "0.6rem" }}>
      <p className="muted">
        Explore certificate fields: Common Name, SAN, issuer, validity, and serial. Uses sample data; nothing is fetched from the network.
      </p>
      <label className="control">
        <span>Certificate JSON</span>
        <textarea rows={8} value={json} onChange={(e) => setJson(e.target.value)} />
      </label>
      {parsed.error ? (
        <p className="status status--warn">Parse error: {parsed.error}</p>
      ) : (
        parsed.data && (
          <div className="rounded-lg border px-3 py-3 bg-gray-50">
            <p className="eyebrow">Fields</p>
            <ul className="stack" style={{ margin: 0 }}>
              <li><strong>Subject</strong>: {parsed.data.subject}</li>
              <li><strong>Issuer</strong>: {parsed.data.issuer}</li>
              <li><strong>SAN</strong>: {(parsed.data.san || []).join(", ")}</li>
              <li><strong>Validity</strong>: {parsed.data.notBefore} → {parsed.data.notAfter}</li>
              <li><strong>Serial</strong>: {parsed.data.serialNumber}</li>
            </ul>
          </div>
        )
      )}
    </div>
  );
}
