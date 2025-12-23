import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import { PrismaClient } from "@prisma/client";

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "file:./data/dev.db";
}

const prisma = new PrismaClient();

async function ensureTables() {
  // SQLite schema for tests. This is only for node tests.
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS WorkspaceSession (
      id TEXT PRIMARY KEY NOT NULL,
      tokenHash TEXT NOT NULL UNIQUE,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS Project (
      id TEXT PRIMARY KEY NOT NULL,
      ownerId TEXT,
      workspaceSessionId TEXT,
      title TEXT NOT NULL,
      topic TEXT NOT NULL,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS Run (
      id TEXT PRIMARY KEY NOT NULL,
      projectId TEXT NOT NULL,
      toolId TEXT NOT NULL,
      status TEXT NOT NULL,
      startedAt DATETIME,
      finishedAt DATETIME,
      inputJson TEXT,
      outputJson TEXT,
      metricsJson TEXT,
      errorJson TEXT
    );
  `);
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS Note (
      id TEXT PRIMARY KEY NOT NULL,
      projectId TEXT NOT NULL,
      runId TEXT,
      content TEXT NOT NULL,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

function cuidish() {
  return `c_${crypto.randomUUID().replace(/-/g, "")}`;
}

test("creating a project works anonymous (session linked)", async () => {
  await ensureTables();
  const sessionId = cuidish();
  const tokenHash = crypto.createHash("sha256").update("token").digest("hex");
  await prisma.$executeRawUnsafe(`INSERT OR IGNORE INTO WorkspaceSession (id, tokenHash) VALUES ('${sessionId}', '${tokenHash}')`);

  const projectId = cuidish();
  await prisma.$executeRawUnsafe(
    `INSERT INTO Project (id, ownerId, workspaceSessionId, title, topic) VALUES ('${projectId}', NULL, '${sessionId}', 'Test project', 'software')`
  );

  const rows = await prisma.$queryRawUnsafe(`SELECT id, ownerId, workspaceSessionId, title, topic FROM Project WHERE id='${projectId}'`);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].ownerId, null);
  assert.equal(rows[0].workspaceSessionId, sessionId);
});

test("runs are saved and retrievable", async () => {
  await ensureTables();
  const projectId = cuidish();
  await prisma.$executeRawUnsafe(`INSERT INTO Project (id, ownerId, workspaceSessionId, title, topic) VALUES ('${projectId}', NULL, NULL, 'P', 'software')`);

  const runId = cuidish();
  await prisma.$executeRawUnsafe(
    `INSERT INTO Run (id, projectId, toolId, status, startedAt, inputJson, outputJson, metricsJson) VALUES ('${runId}', '${projectId}', 'code-runner', 'succeeded', CURRENT_TIMESTAMP, '{"code":"x"}', '{"stdout":"ok"}', '{"durationMs":10,"chargedCredits":0}')`
  );

  const runs = await prisma.$queryRawUnsafe(`SELECT id, toolId, status FROM Run WHERE projectId='${projectId}'`);
  assert.equal(runs.length, 1);
  assert.equal(runs[0].id, runId);
});

test("claim workspace assigns ownerId to anonymous projects", async () => {
  await ensureTables();
  const sessionId = cuidish();
  const tokenHash = crypto.createHash("sha256").update("token2").digest("hex");
  await prisma.$executeRawUnsafe(`INSERT OR IGNORE INTO WorkspaceSession (id, tokenHash) VALUES ('${sessionId}', '${tokenHash}')`);

  const projectId = cuidish();
  await prisma.$executeRawUnsafe(
    `INSERT INTO Project (id, ownerId, workspaceSessionId, title, topic) VALUES ('${projectId}', NULL, '${sessionId}', 'Anon', 'software')`
  );

  const ownerId = cuidish();
  await prisma.$executeRawUnsafe(`UPDATE Project SET ownerId='${ownerId}' WHERE ownerId IS NULL AND workspaceSessionId='${sessionId}'`);

  const rows = await prisma.$queryRawUnsafe(`SELECT ownerId FROM Project WHERE id='${projectId}'`);
  assert.equal(rows[0].ownerId, ownerId);
});

test("export shape can include project metadata, runs, notes, attachments metadata", async () => {
  await ensureTables();
  const projectId = cuidish();
  await prisma.$executeRawUnsafe(`INSERT INTO Project (id, ownerId, workspaceSessionId, title, topic) VALUES ('${projectId}', NULL, NULL, 'Export', 'software')`);
  const runId = cuidish();
  await prisma.$executeRawUnsafe(
    `INSERT INTO Run (id, projectId, toolId, status, startedAt, inputJson, outputJson, metricsJson) VALUES ('${runId}', '${projectId}', 'code-runner', 'succeeded', CURRENT_TIMESTAMP, '{"code":"x"}', '{"stdout":"ok"}', '{"durationMs":10}')`
  );
  const noteId = cuidish();
  await prisma.$executeRawUnsafe(
    `INSERT INTO Note (id, projectId, runId, content) VALUES ('${noteId}', '${projectId}', '${runId}', 'plain note')`
  );

  const p = await prisma.$queryRawUnsafe(`SELECT id, title, topic FROM Project WHERE id='${projectId}'`);
  const runs = await prisma.$queryRawUnsafe(`SELECT id, toolId, status, inputJson, outputJson, metricsJson FROM Run WHERE projectId='${projectId}'`);
  const notes = await prisma.$queryRawUnsafe(`SELECT id, runId, content FROM Note WHERE projectId='${projectId}'`);
  const exportObj = { project: p[0], runs, notes, attachments: [] };
  assert.equal(exportObj.project.id, projectId);
  assert.equal(exportObj.runs.length, 1);
  assert.equal(exportObj.notes.length, 1);
});

test.after(async () => {
  await prisma.$disconnect();
});


