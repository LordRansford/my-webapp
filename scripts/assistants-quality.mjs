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
if (!src.includes('aria-label="Mentor"')) fail('Missing aria-label for Mentor launcher.');
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

const mentorFile = path.join(process.cwd(), "src/components/assistants/MentorAssistant.tsx");
if (!fs.existsSync(mentorFile)) fail("Missing MentorAssistant component.");
const mentorSrc = fs.readFileSync(mentorFile, "utf8");
if (!mentorSrc.includes("sanitizeText")) fail("MentorAssistant must sanitize user input.");
if (!mentorSrc.includes("MSG_KEY_PREFIX")) fail("MentorAssistant must persist conversation per page.");
if (!mentorSrc.includes('aria-label="Close mentor"')) fail('Missing aria-label for Close mentor overlay.');
if (!mentorSrc.includes('aria-label="Close mentor panel"')) fail('Missing close control in MentorAssistant.');

// Ensure bottom positioning tokens exist (avoid mid-screen overlap).
if (!/fixed\s+inset-x-0\s+bottom-\d+/.test(src)) fail("Launchers should be bottom-positioned (fixed inset-x-0 bottom-*)");

// Ensure one-open-on-mobile enforcement is present.
if (!src.includes("One assistant open at a time on small screens")) fail("Missing one-open-on-mobile enforcement comment/logic.");

console.log("ASSISTANTS QUALITY PASSED");


