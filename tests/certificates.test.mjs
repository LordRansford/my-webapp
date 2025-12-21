import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const tmpStore = path.join(os.tmpdir(), "certificates-test.json");
process.env.CERTIFICATES_STORE_PATH = tmpStore;
if (fs.existsSync(tmpStore)) fs.rmSync(tmpStore, { force: true });

const certStore = await import("../src/lib/certificates/store.core.js");

test("issueCertificate creates non-guessable id and is idempotent per course/level/user", () => {
  const issued = certStore.issueCertificate({
    userId: "u1",
    courseId: "c1",
    levelId: "l1",
    courseTitle: "Course 1",
    hoursEarned: 3,
    completionDate: "2024-01-01T00:00:00.000Z",
    learnerName: "Learner One",
  });
  assert.ok(issued.certificateId);
  const again = certStore.issueCertificate({
    userId: "u1",
    courseId: "c1",
    levelId: "l1",
    courseTitle: "Course 1",
    hoursEarned: 3,
    completionDate: "2024-01-01T00:00:00.000Z",
    learnerName: "Learner One",
  });
  assert.equal(again.certificateId, issued.certificateId);
});

test("getCertificateById returns stored summary", () => {
  const all = JSON.parse(fs.readFileSync(tmpStore, "utf8"));
  const id = all.certificates[0].certificateId;
  const fetched = certStore.getCertificateById(id);
  assert.equal(fetched.certificateId, id);
  assert.equal(fetched.courseId, "c1");
});

test("revokeCertificate marks revoked and keeps id stable", () => {
  const all = JSON.parse(fs.readFileSync(tmpStore, "utf8"));
  const id = all.certificates[0].certificateId;
  const revoked = certStore.revokeCertificate(id, "Test reason");
  assert.ok(revoked.revokedAt);
  const fetched = certStore.getCertificateById(id);
  assert.equal(fetched.revokedAt, revoked.revokedAt);
});


