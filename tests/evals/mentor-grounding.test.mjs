import assert from "node:assert/strict";
import { retrieveVectorContent } from "../../src/lib/mentor/vectorStore.js";

async function expectGrounded(question, minScore = 0.12) {
  const { matches, weak } = await retrieveVectorContent(question, null, 5);
  assert.ok(matches.length > 0, "Expected at least one retrieved source");
  assert.ok(matches[0].score >= minScore || !weak, "Top match should not be weak for core questions");
  matches.forEach((m) => {
    assert.ok(m.href, "Match must include href");
    assert.ok(m.title, "Match must include title");
  });
  return matches;
}

async function main() {
  const digitalisation = await expectGrounded("What is digitalisation?");
  assert.ok(
    digitalisation.some((m) => /digital/i.test(m.href) || /digital/i.test(m.title)),
    "Should cite a digitalisation-related page or section"
  );

  const toolUsage = await expectGrounded("How do I use the architecture diagram studio?");
  assert.ok(toolUsage.some((m) => m.href.includes("architecture-diagram") || m.href.includes("studio")), "Should cite studio/tool routes");
}

main();

