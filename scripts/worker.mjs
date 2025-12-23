const limit = Number(process.env.WORKER_TICK_LIMIT || "10");
const baseUrl = process.env.WORKER_BASE_URL || "http://localhost:3000";
const secret = process.env.ADMIN_WORKER_SECRET || "";

async function main() {
  if (!secret) {
    throw new Error("Missing ADMIN_WORKER_SECRET env var");
  }
  const res = await fetch(`${baseUrl}/api/admin/run-worker-tick`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-admin-worker-secret": secret,
    },
    body: JSON.stringify({ limit }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || `Worker tick failed (${res.status})`);
  }
  console.log("worker:tick_done", data);
}

main().catch((err) => {
  console.error("worker:tick_failed", { message: err?.message || "unknown" });
  process.exitCode = 1;
});


