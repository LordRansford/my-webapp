import test from "node:test";
import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { issueCpdCertificateCore } from "../src/lib/cpd/issueCertificate.core.js";

test("Step 7: cannot issue without completion; issuing twice does not charge twice; verify lookup by hash works", async () => {
  const root = process.cwd();
  const dbDir = path.join(root, "data");
  const dbPath = path.join(dbDir, "test-cpd-cert.db");
  fs.mkdirSync(dbDir, { recursive: true });
  if (fs.existsSync(dbPath)) fs.rmSync(dbPath, { force: true });

  process.env.DATABASE_URL = `file:${dbPath.replaceAll("\\", "/")}`;
  execSync("npx prisma db push --skip-generate", { stdio: "inherit" });

  const prisma = new PrismaClient();

  await prisma.userIdentity.create({
    data: { id: "user-a", email: "a@example.com", provider: "email", providerAccountId: "a@example.com" },
  });

  // Seed credits + a lot.
  await prisma.credits.create({ data: { userId: "user-a", balance: 200, expiresAt: null } });
  await prisma.creditLot.create({
    data: {
      userId: "user-a",
      credits: 200,
      amountCredits: 200,
      remainingCredits: 200,
      source: "test",
      stripeEventId: null,
      stripePriceId: null,
      stripeCheckoutSessionId: null,
      stripePaymentIntentId: null,
      purchasedAt: new Date(),
      expiresAt: null,
    },
  });

  const courseId = "ai:foundations";
  const courseVersion = "2025.01";

  // Cannot issue without completion.
  await assert.rejects(
    () =>
      issueCpdCertificateCore({
        prisma,
        userId: "user-a",
        courseId,
        courseVersion,
        creditsCost: 50,
        issuer: "RansfordsNotes",
      }),
    /CERT_NOT_ELIGIBLE/,
  );

  // Insert completion marker.
  await prisma.$executeRaw`
    INSERT INTO CourseCompletion (id, userId, courseId, courseVersion, completedAt, passed)
    VALUES (${ "cc_test_1" }, ${ "user-a" }, ${ courseId }, ${ courseVersion }, ${ new Date("2025-01-01T00:00:00.000Z") }, ${ 1 })
  `;

  const beforeRows = await prisma.$queryRaw`SELECT balance FROM Credits WHERE userId = ${"user-a"} LIMIT 1`;
  assert.equal(Number(beforeRows[0].balance), 200);

  const first = await issueCpdCertificateCore({
    prisma,
    userId: "user-a",
    courseId,
    courseVersion,
    creditsCost: 50,
    issuer: "RansfordsNotes",
  });
  const afterFirstRows = await prisma.$queryRaw`SELECT balance FROM Credits WHERE userId = ${"user-a"} LIMIT 1`;
  assert.equal(Number(afterFirstRows[0].balance), 150);

  const second = await issueCpdCertificateCore({
    prisma,
    userId: "user-a",
    courseId,
    courseVersion,
    creditsCost: 50,
    issuer: "RansfordsNotes",
  });
  const afterSecondRows = await prisma.$queryRaw`SELECT balance FROM Credits WHERE userId = ${"user-a"} LIMIT 1`;
  assert.equal(Number(afterSecondRows[0].balance), 150, "issuing twice must not charge twice");
  assert.equal(second.certificateId, first.certificateId);
  assert.equal(second.certificateHash, first.certificateHash);

  const byHashRows = await prisma.$queryRaw`
    SELECT userId FROM Certificate WHERE certificateHash = ${first.certificateHash} LIMIT 1
  `;
  assert.ok(Array.isArray(byHashRows) && byHashRows[0]);
  assert.equal(byHashRows[0].userId, "user-a");

  await prisma.$disconnect();
});


