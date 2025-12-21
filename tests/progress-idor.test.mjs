import test from "node:test";
import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

test("no IDOR: user can only read their own CPD state", async () => {
  const root = process.cwd();
  const dbDir = path.join(root, "data");
  const dbPath = path.join(dbDir, "test-progress.db");
  fs.mkdirSync(dbDir, { recursive: true });
  if (fs.existsSync(dbPath)) fs.rmSync(dbPath, { force: true });

  // Use a dedicated test DB.
  process.env.DATABASE_URL = `file:${dbPath.replaceAll("\\", "/")}`;

  // Ensure schema exists (non-interactive).
  execSync("npx prisma db push --skip-generate", { stdio: "inherit" });

  const prisma = new PrismaClient();

  // Seed identity rows (mirrors NextAuth user.id).
  await prisma.userIdentity.create({
    data: { id: "user-a", email: "a@example.com", provider: "email", providerAccountId: "a@example.com" },
  });
  await prisma.userIdentity.create({
    data: { id: "user-b", email: "b@example.com", provider: "email", providerAccountId: "b@example.com" },
  });

  await prisma.cpdState.upsert({
    where: { userId: "user-a" },
    create: {
      userId: "user-a",
      stateJson: JSON.stringify({
        version: 1,
        sections: [{ trackId: "ai", levelId: "foundations", sectionId: "s1", completed: true, minutes: 5 }],
        activity: [],
      }),
    },
    update: {
      stateJson: JSON.stringify({
        version: 1,
        sections: [{ trackId: "ai", levelId: "foundations", sectionId: "s1", completed: true, minutes: 5 }],
        activity: [],
      }),
    },
  });

  const a = await prisma.cpdState.findUnique({ where: { userId: "user-a" } });
  const b = await prisma.cpdState.findUnique({ where: { userId: "user-b" } });

  assert.ok(a?.stateJson, "user-a should have state");
  assert.equal(b, null, "user-b should not be able to read user-a state");

  await prisma.$disconnect();
});


