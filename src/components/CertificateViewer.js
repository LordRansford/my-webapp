const sampleCert = {
  subject: {
    commonName: "example.com",
    organization: "Example Ltd",
  },
  subjectAltName: ["example.com", "www.example.com", "api.example.com"],
  issuer: {
    commonName: "Example CA Root",
    organization: "Example Trust",
  },
  validity: {
    notBefore: "2024-01-01T00:00:00Z",
    notAfter: "2026-01-01T00:00:00Z",
  },
  serialNumber: "12:34:56:78:9A",
  signatureAlgorithm: "RSA with SHA-256",
  publicKey: {
    type: "RSA",
    size: 2048,
  },
  chain: ["Example CA Root", "Example Intermediate CA", "example.com"],
};

export default function CertificateViewer() {
  return (
    <div className="panel stack">
      <p className="eyebrow">Certificate viewer</p>
      <p className="muted">This uses a sample certificate to show the important fields.</p>
      <div className="cert-grid">
        <div className="cert-card">
          <p className="eyebrow">Subject (who this is for)</p>
          <p>
            <strong>CN</strong>: {sampleCert.subject.commonName}
          </p>
          <p>
            <strong>O</strong>: {sampleCert.subject.organization}
          </p>
          <p className="muted">CN is the Common Name shown in the certificate.</p>
        </div>
        <div className="cert-card">
          <p className="eyebrow">SAN (subject alt names)</p>
          <ul>
            {sampleCert.subjectAltName.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
          <p className="muted">SAN lists every hostname the certificate covers.</p>
        </div>
        <div className="cert-card">
          <p className="eyebrow">Issuer</p>
          <p>
            <strong>CN</strong>: {sampleCert.issuer.commonName}
          </p>
          <p>
            <strong>O</strong>: {sampleCert.issuer.organization}
          </p>
          <p className="muted">Issuer is the Certificate Authority that signed this certificate.</p>
        </div>
        <div className="cert-card">
          <p className="eyebrow">Validity</p>
          <p>
            <strong>Not before</strong>: {new Date(sampleCert.validity.notBefore).toDateString()}
          </p>
          <p>
            <strong>Not after</strong>: {new Date(sampleCert.validity.notAfter).toDateString()}
          </p>
          <p className="muted">Certificates outside this window should be rejected.</p>
        </div>
        <div className="cert-card">
          <p className="eyebrow">Key and algorithm</p>
          <p>
            <strong>Public key</strong>: {sampleCert.publicKey.type}, {sampleCert.publicKey.size} bits
          </p>
          <p>
            <strong>Signature algorithm</strong>: {sampleCert.signatureAlgorithm}
          </p>
          <p className="muted">Key type and size affect security and performance.</p>
        </div>
        <div className="cert-card">
          <p className="eyebrow">Chain of trust</p>
          <ol className="stack">
            {sampleCert.chain.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
          <p className="muted">Browsers trust roots; each link signs the next.</p>
        </div>
      </div>
    </div>
  );
}
