"use client";

import { useState } from "react";

export default function CertificatesClient(
  props:
    | { kind: "issue"; courseId: string }
    | { kind: "download"; certificateId: string },
) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>("");

  if (props.kind === "download") {
    return (
      <div className="flex items-center gap-2">
        <a
          className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
          href={`/api/certificates/download?certificateId=${encodeURIComponent(props.certificateId)}`}
        >
          Download
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        disabled={busy}
        className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
        onClick={async () => {
          setBusy(true);
          setError("");
          try {
            const res = await fetch("/api/certificates/issue", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ courseId: props.courseId }),
            });
            const data = await res.json().catch(() => null);
            if (!res.ok) {
              const reasons = Array.isArray(data?.reasons) ? data.reasons.join(" ") : "";
              setError(reasons || data?.message || "Unable to issue certificate.");
              return;
            }
            if (data?.certificateId) {
              window.location.href = `/api/certificates/download?certificateId=${encodeURIComponent(data.certificateId)}`;
            }
          } catch {
            setError("Unable to issue certificate.");
          } finally {
            setBusy(false);
          }
        }}
      >
        {busy ? "Issuing..." : "Issue certificate"}
      </button>
      {error ? <div className="text-xs text-rose-700">{error}</div> : null}
    </div>
  );
}


