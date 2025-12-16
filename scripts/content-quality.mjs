import fs from "node:fs";
import path from "node:path";

const FILE = process.argv[2] || "content/notes/ai/beginner.mdx";

function fail(msg) {
  console.error(`\nCONTENT QUALITY FAILED\n${msg}\n`);
  process.exit(1);
}

function readFile(p) {
  const full = path.resolve(process.cwd(), p);
  if (!fs.existsSync(full)) fail(`File not found: ${p}`);
  return fs.readFileSync(full, "utf8");
}

function stripMdx(text) {
  return text
    .replace(/<ToolCard[\s\S]*?<\/ToolCard>/g, "")
    .replace(/<QuizBlock[\s\S]*?<\/QuizBlock>/g, "")
    .replace(/<GlossaryTip[\s\S]*?<\/GlossaryTip>/g, "")
    .replace(/```[\s\S]*?```/g, "");
}

function splitSections(raw) {
  const parts = raw.split(/\n##\s+/).filter(Boolean);
  const sections = [];
  if (!raw.trim().startsWith("##")) {
    const intro = raw.split(/\n##\s+/)[0];
    sections.push({ title: "Intro", body: intro });
  }
  for (let i = 0; i < parts.length; i++) {
    const chunk = parts[i];
    // Skip horizontal rules or stray separators that are not real sections
    if (chunk.trim().startsWith("---")) continue;
    const firstLineEnd = chunk.indexOf("\n");
    const title = firstLineEnd === -1 ? chunk.trim() : chunk.slice(0, firstLineEnd).trim();
    const body = firstLineEnd === -1 ? "" : chunk.slice(firstLineEnd + 1);
    sections.push({ title, body });
  }
  return sections;
}

function countMatches(text, re) {
  const m = text.match(re);
  return m ? m.length : 0;
}

function paragraphs(text) {
  return text
    .split(/\n\s*\n/g)
    .map((p) => p.trim())
    .filter((p) => p && !p.startsWith("#"));
}

function isShallowExample(p) {
  const m = p.match(/^\s*Example\s*:\s*(.+)$/i);
  if (!m) return false;
  const words = m[1].trim().split(/\s+/).filter(Boolean);
  return words.length < 12;
}

function isTooShortParagraph(p) {
  const words = p.split(/\s+/).filter(Boolean);
  return words.length > 0 && words.length < 25;
}

function hasDefinitionsBeforeKatex(sectionBody) {
  const lines = sectionBody.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isMathStart = line.includes("$$") || line.includes("\\[") || line.match(/\\begin\{(equation|align)\}/);
    if (isMathStart) {
      const windowStart = Math.max(0, i - 8);
      const window = lines.slice(windowStart, i).join("\n");
      const ok = /Definitions\s*:|Definitions\s*$/i.test(window);
      if (!ok) return false;
    }
  }
  return true;
}

const raw = readFile(FILE);
const sections = splitSections(raw);

if (sections.length < 4) fail(`Expected multiple sections. Found only ${sections.length}. Add more structure and content.`);

const nonIntroCount = sections.filter((s) => s.title !== "Intro").length;
const toolCards = countMatches(raw, /<ToolCard\b/g);
const quizBlocks = countMatches(raw, /<QuizBlock\b/g);
const glossaryTips = countMatches(raw, /<GlossaryTip\b/g);
const totalQuestions = countMatches(raw, /\{ q:/g);

if (toolCards < nonIntroCount) fail(`Beginner must include at least one ToolCard per section. Found ${toolCards}.`);
if (quizBlocks < nonIntroCount) fail(`Beginner must include at least one QuizBlock per section. Found ${quizBlocks}.`);
if (glossaryTips < 20) fail(`Beginner must include at least 20 GlossaryTip blocks. Found ${glossaryTips}.`);
if (totalQuestions < nonIntroCount * 12) fail(`Each section needs 12+ questions. Found ${totalQuestions} total questions.`);

const problems = [];

for (const s of sections) {
  const proseOnly = stripMdx(s.body);
  const ps = paragraphs(proseOnly);
  const wordCount = proseOnly.split(/\s+/).filter(Boolean).length;
  const scenarioCount = (proseOnly.match(/Imagine|Suppose|In practice|In a real system/gi) || []).length;
  const localGlossary = countMatches(s.body, /<GlossaryTip\b/g);
  const shallowExamples = ps.filter(isShallowExample);
  const localTools = countMatches(s.body, /<ToolCard\b/g);
  const localQuizzes = countMatches(s.body, /<QuizBlock\b/g);
  const localQuestions = countMatches(s.body, /\{ q:/g);

  if (s.title !== "Intro") {
    if (wordCount < 600) problems.push(`${s.title}: too shallow. Need at least 600 words of prose.`);
    if (ps.length < 7) problems.push(`${s.title}: needs at least 7 paragraphs. Found ${ps.length}.`);
    if (scenarioCount < 2) problems.push(`${s.title}: add realistic scenario paragraphs (found ${scenarioCount}).`);
    const shortCount = ps.filter(isTooShortParagraph).length;
    if (shortCount >= Math.ceil(ps.length / 2)) problems.push(`${s.title}: too many short paragraphs. Write fuller explanations.`);
    if (shallowExamples.length > 0) problems.push(`${s.title}: contains shallow Example lines. Expand them.`);
    if (!hasDefinitionsBeforeKatex(s.body)) problems.push(`${s.title}: maths found without a nearby Definitions block.`);
    if (localGlossary < 2) problems.push(`${s.title}: add more GlossaryTip definitions.`);
    if (localTools < 1) problems.push(`${s.title}: missing ToolCard.`);
    if (localQuizzes < 1) problems.push(`${s.title}: missing QuizBlock.`);
    if (localQuestions < 12) problems.push(`${s.title}: each QuizBlock needs at least 12 questions.`);
  }
}

if (problems.length) fail(problems.join("\n"));

console.log(`CONTENT QUALITY PASSED for ${FILE}`);

// Lightweight gate for cybersecurity summary to ensure the games are present
const summaryPath = "src/pages/cybersecurity/summary.js";
if (fs.existsSync(summaryPath)) {
  const summary = readFile(summaryPath);
  if (!summary.includes("Games that build judgement")) fail("Summary page must include games section");
  if (!summary.includes("GameHub")) fail("Summary page must render GameHub");
}

// Basic guardrail for AI advanced page presence and structure
const aiAdvancedPath = "content/notes/ai/advanced.mdx";
if (fs.existsSync(aiAdvancedPath)) {
  const adv = readFile(aiAdvancedPath);
  if (!adv.includes("Transformers and attention")) fail("AI advanced must include transformers section");
  if (!adv.includes("Supply chain and systemic risk")) fail("AI advanced must include supply chain section");
  if (!adv.includes("<QuizBlock")) fail("AI advanced must include quizzes");
  if (!adv.includes("<ToolCard")) fail("AI advanced must include tools");
}
