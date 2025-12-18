import { cyberSectionManifest } from "@/sections/cyberSectionManifest";

// Adapter for progress components expecting level -> sectionId arrays.
const levelBuckets = {
  foundations: [],
  applied: [],
  practice: [],
  summary: [],
};

cyberSectionManifest.forEach((section) => {
  if (!levelBuckets[section.level]) return;
  levelBuckets[section.level].push(section.id);
});

export const cyberSections = levelBuckets;
