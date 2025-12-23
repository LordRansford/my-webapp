function slug(input: string) {
  return String(input || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 12) || "COURSE";
}

function randomChunk(len: number) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/1/O/I
  let out = "";
  for (let i = 0; i < len; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
}

/**
 * Public certificate IDs must be unguessable to prevent enumeration.
 * Format remains human-readable, but includes a random suffix.
 */
export function formatCertificateId(params: { courseId: string; year: number }) {
  const course = slug(params.courseId);
  const rand = randomChunk(10);
  return `RN-${course}-${params.year}-${rand}`;
}


