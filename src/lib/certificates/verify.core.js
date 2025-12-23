import crypto from "node:crypto";

export function sha256Hex(bytes) {
  return crypto.createHash("sha256").update(Buffer.from(bytes)).digest("hex");
}


