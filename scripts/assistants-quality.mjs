import fs from "node:fs";
import path from "node:path";

const TARGET = "src/components/assistants/AssistantShell.tsx";

function fail(msg) {
  console.error(`\nASSISTANTS QUALITY FAILED\n${msg}\n`);
  process.exit(1);
}

const abs = path.join(process.cwd(), TARGET);
if (!fs.existsSync(abs)) fail(`Missing file: ${TARGET}`);
const src = fs.readFileSync(abs, "utf8");

// Basic guardrails to prevent regressions without heavy UI testing.
if (!src.includes('aria-label="Professor Ransford"')) fail('Missing aria-label for Professor launcher.');
if (!src.includes('aria-label="Feedback"')) fail('Missing aria-label for Feedback launcher.');

// Ensure duplicate mounts are safely handled.
if (!src.includes("__RN_ASSISTANT_SHELL_MOUNTED__")) fail("Missing singleton guard for duplicate AssistantShell mounts.");

// Ensure screenshot uploads are bounded.
const feedbackFile = path.join(process.cwd(), "src/components/assistants/FeedbackAssistant.tsx");
if (!fs.existsSync(feedbackFile)) fail("Missing FeedbackAssistant component.");
const feedbackSrc = fs.readFileSync(feedbackFile, "utf8");
if (!feedbackSrc.includes("SCREENSHOT_MAX_BYTES")) fail("Missing screenshot size limit constant in FeedbackAssistant.");
if (!feedbackSrc.includes("sanitizeText")) fail("FeedbackAssistant must sanitize user input.");
if (!feedbackSrc.includes('aria-label="Close feedback"')) fail('Missing aria-label for Close feedback overlay.');
if (!feedbackSrc.includes('aria-label="Close feedback panel"')) fail('Missing close control in FeedbackAssistant.');

const professorFile = path.join(process.cwd(), "src/components/assistants/ProfessorRansfordAssistant.tsx");
if (!fs.existsSync(professorFile)) fail("Missing ProfessorRansfordAssistant component.");
const professorSrc = fs.readFileSync(professorFile, "utf8");
if (!professorSrc.includes("sanitizeText")) fail("ProfessorRansfordAssistant must sanitize user input.");
if (!professorSrc.includes('aria-label="Close professor"')) fail('Missing aria-label for Close professor overlay.');
if (!professorSrc.includes('aria-label="Close professor panel"')) fail('Missing close control in ProfessorRansfordAssistant.');
if (!professorSrc.includes('aria-label="Professor drawer"')) fail('Missing aria-label for Professor drawer.');

// Ensure bottom positioning tokens exist (avoid mid-screen overlap).
if (!/fixed\s+inset-x-0\s+bottom-\d+/.test(src)) fail("Launchers should be bottom-positioned (fixed inset-x-0 bottom-*)");

// Ensure one-open behavior exists to avoid overlapping panels.
if (!src.includes("enforceOneOpen")) fail("Missing one-open enforcement logic (enforceOneOpen).");

console.log("ASSISTANTS QUALITY PASSED");


