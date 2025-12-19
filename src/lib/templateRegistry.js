"use strict";

import fs from "fs";
import path from "path";

const registryPath = path.join(process.cwd(), "content", "templates", "registry.json");

const categoryLabels = {
  ai: "AI Useful Tools",
  data: "Data Useful Tools",
  "software-architecture": "Software Architecture Useful Tools",
  digitalisation: "Digitalisation Useful Tools",
};

const categoryRoutes = {
  ai: "/templates/ai",
  data: "/templates/data",
  "software-architecture": "/templates/software-architecture",
  digitalisation: "/templates/digitalisation",
};

function loadRegistry() {
  try {
    const raw = fs.readFileSync(registryPath, "utf8");
    return JSON.parse(raw);
  } catch {
    return { ai: [], data: [], "software-architecture": [], digitalisation: [] };
  }
}

function flattenRegistry(registry) {
  return Object.entries(registry || {}).flatMap(([category, entries]) =>
    (entries || []).map((entry) => ({
      ...entry,
      category,
    }))
  );
}

export function getRegistry() {
  return loadRegistry();
}

export function getAllTemplates() {
  return flattenRegistry(loadRegistry());
}

export function getTemplatesByCategory(category) {
  const registry = loadRegistry();
  return registry[category] || [];
}

export function getTemplateById(id) {
  return getAllTemplates().find((item) => item.id === id) || null;
}

export function getCategories() {
  return Object.keys(loadRegistry()).map((id) => ({
    id,
    title: categoryLabels[id] || id,
    route: categoryRoutes[id] || `/templates/${id}`,
  }));
}

export function getCategoryMeta(category) {
  return {
    id: category,
    title: categoryLabels[category] || category,
    route: categoryRoutes[category] || `/templates/${category}`,
  };
}
