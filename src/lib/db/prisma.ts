import { PrismaClient } from "@prisma/client";

// Default DB for local dev when env is missing.
// This keeps local dev lightweight and avoids "silent" runtime failures.
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "file:./data/dev.db";
}

declare global {
  var __prisma: PrismaClient | undefined;
}

export const prisma: PrismaClient =
  global.__prisma ||
  new PrismaClient({
    log: ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.__prisma = prisma;
}


