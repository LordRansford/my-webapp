/**
 * Unified Example System
 * 
 * Centralized access to all studio examples
 */

export * from "./dev-examples";
export * from "./cyber-examples";
export * from "./data-examples";
export * from "./architecture-examples";

import { devExamples, getDevExample, getDevExamplesByCategory, getDevExamplesByDifficulty } from "./dev-examples";
import { cyberExamples, getCyberExample, getCyberExamplesByCategory, getCyberExamplesByDifficulty } from "./cyber-examples";
import { dataExamples, getDataExample, getDataExamplesByCategory, getDataExamplesByDifficulty } from "./data-examples";
import { architectureTemplates, getArchitectureTemplate, getArchitectureTemplatesByCategory, getArchitectureTemplatesByDifficulty } from "./architecture-examples";

export interface UnifiedExample {
  id: string;
  studioType: "dev" | "cyber" | "data" | "architecture";
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  credits: number;
}

export function getAllExamples(): UnifiedExample[] {
  const dev = devExamples.map(ex => ({
    id: ex.id,
    studioType: "dev" as const,
    title: ex.title,
    description: ex.description,
    difficulty: ex.difficulty,
    credits: ex.credits
  }));

  const cyber = cyberExamples.map(ex => ({
    id: ex.id,
    studioType: "cyber" as const,
    title: ex.title,
    description: ex.description,
    difficulty: ex.difficulty,
    credits: ex.credits
  }));

  const data = dataExamples.map(ex => ({
    id: ex.id,
    studioType: "data" as const,
    title: ex.title,
    description: ex.description,
    difficulty: ex.difficulty,
    credits: ex.credits
  }));

  const architecture = architectureTemplates.map(ex => ({
    id: ex.id,
    studioType: "architecture" as const,
    title: ex.title,
    description: ex.description,
    difficulty: ex.difficulty,
    credits: ex.credits
  }));

  return [...dev, ...cyber, ...data, ...architecture];
}

export function getExample(studioType: string, id: string) {
  switch (studioType) {
    case "dev":
      return getDevExample(id);
    case "cyber":
      return getCyberExample(id);
    case "data":
      return getDataExample(id);
    case "architecture":
      return getArchitectureTemplate(id);
    default:
      return null;
  }
}


