import { FeedbackEntry, listFeedback } from "./store";

export type FeedbackSummary = {
  total: number;
  praiseSignals: string[];
  repeatedIssues: { theme: string; count: number }[];
  confusionPoints: string[];
  uxProblems: string[];
  contentGaps: string[];
  keyThemes: { theme: string; count: number }[];
  severityRanking: { theme: string; severity: "high" | "medium" | "low"; count: number }[];
  suggestedFocus: string[];
  averages: { clarity?: number; usefulness?: number };
};

const positiveWords = ["good", "great", "helpful", "clear", "nice", "love", "useful", "friendly"];
const issueWords = ["bug", "slow", "error", "crash", "broken"];
const confusionWords = ["confusing", "unclear", "not sure", "lost", "uncertain"];
const gapWords = ["missing", "lack", "not covered", "need more", "not enough"];
const uxWords = ["layout", "mobile", "scroll", "button", "click", "tap", "spacing", "font", "contrast"];

function collectText(e: FeedbackEntry) {
  return [e.message, e.workedWell, e.confused, e.missing, e.other].filter(Boolean).join(" ").toLowerCase();
}

export function analyzeFeedback(entries: FeedbackEntry[] = listFeedback()): FeedbackSummary {
  const themes: Record<string, number> = {};
  const praiseSignals: string[] = [];
  const repeatedIssues: string[] = [];
  const confusionPoints: string[] = [];
  const uxProblems: string[] = [];
  const contentGaps: string[] = [];
  let claritySum = 0;
  let clarityCount = 0;
  let usefulSum = 0;
  let usefulCount = 0;

  entries.forEach((e) => {
    const text = collectText(e);
    if (e.rateClarity) {
      claritySum += e.rateClarity;
      clarityCount += 1;
    }
    if (e.rateUsefulness) {
      usefulSum += e.rateUsefulness;
      usefulCount += 1;
    }
    if (positiveWords.some((w) => text.includes(w))) {
      praiseSignals.push(e.message);
      themes["praise"] = (themes["praise"] || 0) + 1;
    }
    if (issueWords.some((w) => text.includes(w))) {
      repeatedIssues.push(e.message);
      themes["issues"] = (themes["issues"] || 0) + 1;
    }
    if (confusionWords.some((w) => text.includes(w))) {
      confusionPoints.push(e.message);
      themes["confusion"] = (themes["confusion"] || 0) + 1;
    }
    if (uxWords.some((w) => text.includes(w))) {
      uxProblems.push(e.message);
      themes["ux"] = (themes["ux"] || 0) + 1;
    }
    if (gapWords.some((w) => text.includes(w))) {
      contentGaps.push(e.message);
      themes["gaps"] = (themes["gaps"] || 0) + 1;
    }
  });

  const keyThemes = Object.entries(themes)
    .sort((a, b) => b[1] - a[1])
    .map(([theme, count]) => ({ theme, count }));

  const severityRanking = keyThemes.map(({ theme, count }) => {
    const severity: "high" | "medium" | "low" = count >= 5 ? "high" : count >= 2 ? "medium" : "low";
    return { theme, count, severity };
  });

  const suggestedFocus = keyThemes
    .filter((t) => t.theme !== "praise")
    .slice(0, 5)
    .map((t) => `Focus: ${t.theme} (${t.count})`);

  return {
    total: entries.length,
    praiseSignals: praiseSignals.slice(0, 20),
    repeatedIssues: aggregateText(repeatedIssues).map((t) => ({ theme: t.text, count: t.count })),
    confusionPoints: aggregateText(confusionPoints).map((t) => t.text),
    uxProblems: aggregateText(uxProblems).map((t) => t.text),
    contentGaps: aggregateText(contentGaps).map((t) => t.text),
    keyThemes,
    severityRanking,
    suggestedFocus,
    averages: {
      clarity: clarityCount ? Number((claritySum / clarityCount).toFixed(2)) : undefined,
      usefulness: usefulCount ? Number((usefulSum / usefulCount).toFixed(2)) : undefined,
    },
  };
}

function aggregateText(texts: string[]) {
  const counts: Record<string, number> = {};
  texts.forEach((t) => {
    const key = t.toLowerCase().slice(0, 160);
    counts[key] = (counts[key] || 0) + 1;
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([text, count]) => ({ text, count }));
}


