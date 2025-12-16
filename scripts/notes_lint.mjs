import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMdx from "remark-mdx";
import { visit } from "unist-util-visit";
import { RULES } from "./notes_rules.mjs";

const TARGETS = [
  "content/notes/cybersecurity/advanced.mdx",
  "content/notes/cybersecurity/practitioner/security_engineer.mdx",
  "content/notes/cybersecurity/practitioner/security_architect.mdx",
  "content/notes/cybersecurity/practitioner/detection_response_analyst.mdx",
  "content/notes/cybersecurity/practitioner/cloud_platform_security.mdx",
];

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function wordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function normaliseHeading(node) {
  return (node.children || []).map((c) => c.value || "").join("").trim();
}

function collect(ast) {
  const headings = [];
  const mdxComponents = { ToolCard: 0, QuizBlock: 0, CalloutConcept: 0, GlossaryTip: 0 };
  const rawTextChunks = [];
  const mathBlocks = { count: 0 };
  const adversarialMentions = [];
  const decisionEvidenceConsequence = { decision: 0, evidence: 0, consequence: 0, ethics: 0, incident: 0 };

  visit(ast, (node) => {
    if (node.type === "heading") {
      headings.push({ depth: node.depth, text: normaliseHeading(node) });
    }
    if (node.type === "text") rawTextChunks.push(node.value);
    if (node.type === "inlineMath" || node.type === "math") mathBlocks.count += 1;

    if (node.type === "mdxJsxFlowElement") {
      const name = node.name;
      if (name === "ToolCard") mdxComponents.ToolCard += 1;
      if (name === "QuizBlock") mdxComponents.QuizBlock += 1;
      if (name === "GlossaryTip") mdxComponents.GlossaryTip += 1;
      if (name === "Callout") {
        const variantAttr = (node.attributes || []).find((a) => a.name === "variant");
        const variant = variantAttr && variantAttr.value && variantAttr.value.value;
        if (variant === "concept") mdxComponents.CalloutConcept += 1;
      }
    }

    if (node.type === "text") {
      const v = node.value.toLowerCase();
      if (v.includes("adversarial scenario") || v.includes("attacker") || v.includes("assumption"))
        adversarialMentions.push(v);
      if (v.includes("decision")) decisionEvidenceConsequence.decision += 1;
      if (v.includes("evidence")) decisionEvidenceConsequence.evidence += 1;
      if (v.includes("consequence") || v.includes("impact")) decisionEvidenceConsequence.consequence += 1;
      if (v.includes("ethics") || v.includes("accountability")) decisionEvidenceConsequence.ethics += 1;
      if (v.includes("incident") || v.includes("timeline")) decisionEvidenceConsequence.incident += 1;
    }
  });

  const fullText = rawTextChunks.join(" ");
  return { headings, mdxComponents, fullText, mathBlocks, adversarialMentions, decisionEvidenceConsequence };
}

function fail(msg, details = "") {
  console.error(`NOTES LINT FAILED  ${msg}`);
  if (details) console.error(details);
  process.exitCode = 1;
}

function assertAdvanced(filePath, data) {
  const r = RULES.advanced;

  for (const required of r.requiredSections) {
    const ok = data.headings.some((h) => h.depth === 2 && h.text.includes(required));
    if (!ok) fail(`Missing required Advanced section: ${required}`, filePath);
  }

  if (data.mdxComponents.ToolCard < r.requiredSections.length * r.minToolCardsPerSection) {
    fail("Advanced page has too few ToolCard components", filePath);
  }

  if (data.mdxComponents.QuizBlock < r.requiredSections.length) {
    fail("Advanced page must have at least one QuizBlock per section", filePath);
  }

  if (r.minConceptCalloutsPerSection > 0 && data.mdxComponents.CalloutConcept < r.requiredSections.length * r.minConceptCalloutsPerSection) {
    fail("Advanced page must have concept Callouts", filePath);
  }

  if (r.requireMathOrFormalPerSection && data.mathBlocks.count < r.requiredSections.length) {
    fail("Advanced page must include formal maths or formal blocks regularly", filePath);
  }

  if (r.requireAdversarialScenarioPerSection && data.adversarialMentions.length < r.requiredSections.length) {
    fail("Advanced page must include explicit adversarial reasoning in each section", filePath);
  }

  if (r.minWordsPerSection > 0 && wordCount(data.fullText) < r.requiredSections.length * r.minWordsPerSection) {
    fail("Advanced page is too short for required depth", filePath);
  }
}

function assertPractitioner(filePath, data) {
  const r = RULES.practitioner;

  if (r.minToolCardsPerSection && data.mdxComponents.ToolCard < 1) {
    fail("Practitioner page must include ToolCard", filePath);
  }

  if (data.mdxComponents.QuizBlock < 1) {
    fail("Practitioner page must include QuizBlock", filePath);
  }

  if (data.decisionEvidenceConsequence.ethics < r.minEthicsSections) {
    fail("Practitioner page must include ethics and accountability", filePath);
  }

  if (data.decisionEvidenceConsequence.incident < r.minIncidentScenarios) {
    fail("Practitioner page must include at least one incident timeline scenario", filePath);
  }

  if (r.requireDecisionEvidenceConsequenceTriplet) {
    const d = data.decisionEvidenceConsequence;
    if (d.decision < 2 || d.evidence < 1 || d.consequence < 1) {
      fail("Practitioner page must clearly include decision, evidence, and consequence framing", filePath);
    }
  }

  if (r.minWordsPerSection > 0 && wordCount(data.fullText) < r.minWordsPerSection) {
    fail("Practitioner page too short for depth", filePath);
  }
}

function main() {
  const processor = unified().use(remarkParse).use(remarkMdx);

  for (const rel of TARGETS) {
    const filePath = path.join(process.cwd(), rel);
    if (!fs.existsSync(filePath)) {
      fail("Missing required notes file", rel);
      continue;
    }
    const mdx = read(filePath);
    const ast = processor.parse(mdx);
    const data = collect(ast);

    if (rel.endsWith("advanced.mdx")) assertAdvanced(rel, data);
    if (rel.includes("/practitioner/")) assertPractitioner(rel, data);
  }

  if (process.exitCode) {
    process.exit(process.exitCode);
  } else {
    console.log("NOTES LINT PASSED");
  }
}

main();
