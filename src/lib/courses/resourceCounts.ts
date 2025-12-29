// Client-side safe resource counting utility
// Note: Template counts require server-side data, so we use approximate counts

// Map course slugs to template categories
const COURSE_TO_TEMPLATE_CATEGORY: Record<string, string> = {
  cybersecurity: "cybersecurity",
  ai: "ai",
  "software-architecture": "software-architecture",
  data: "data",
  digitalisation: "digitalisation",
};

// Map course slugs to tool categories (from component organization)
const COURSE_TO_TOOL_CATEGORY: Record<string, string> = {
  cybersecurity: "cybersecurity",
  ai: "ai",
  "software-architecture": "software-architecture",
  data: "data",
  digitalisation: "digitalisation",
};

// Map course slugs to studio routes
const COURSE_TO_STUDIO_ROUTES: Record<string, string[]> = {
  cybersecurity: ["/cyber-studios"],
  ai: ["/ai-studios"],
  "software-architecture": ["/dev-studios", "/studios/architecture-diagram-studio"],
  data: ["/data-studios"],
  digitalisation: ["/data-studios"],
};

// Count tools per course (from component exports)
function countToolsForCourse(courseSlug: string): number {
  const toolCategory = COURSE_TO_TOOL_CATEGORY[courseSlug];
  if (!toolCategory) return 0;

  // Count tools from component exports
  // This is a rough estimate based on the tool component structure
  // For exact counts, we'd need to import all tool components, which is heavy
  // Instead, we'll use approximate counts based on known tool organization
  const approximateCounts: Record<string, number> = {
    cybersecurity: 25, // Based on cyber tool components
    ai: 20, // Based on AI tool components
    "software-architecture": 15, // Based on arch tool components
    data: 18, // Based on data tool components
    digitalisation: 12, // Based on dig tool components
  };

  return approximateCounts[courseSlug] || 0;
}

// Count templates per course
// Using approximate counts since template registry requires server-side access
function countTemplatesForCourse(courseSlug: string): number {
  const templateCategory = COURSE_TO_TEMPLATE_CATEGORY[courseSlug];
  if (!templateCategory) return 0;

  // Approximate counts based on template registry structure
  // These are estimates and will be accurate on server-side rendering
  const approximateCounts: Record<string, number> = {
    cybersecurity: 15,
    ai: 12,
    "software-architecture": 10,
    data: 14,
    digitalisation: 11,
  };

  return approximateCounts[courseSlug] || 0;
}

// Count studios per course
function countStudiosForCourse(courseSlug: string): number {
  const studioRoutes = COURSE_TO_STUDIO_ROUTES[courseSlug] || [];
  return studioRoutes.length;
}

export interface CourseResourceCounts {
  tools: number;
  templates: number;
  studios: number;
}

export function getResourceCountsForCourse(courseSlug: string): CourseResourceCounts {
  return {
    tools: countToolsForCourse(courseSlug),
    templates: countTemplatesForCourse(courseSlug),
    studios: countStudiosForCourse(courseSlug),
  };
}

export function getToolRouteForCourse(courseSlug: string): string {
  const routes: Record<string, string> = {
    cybersecurity: "/tools/cybersecurity",
    ai: "/tools/ai",
    "software-architecture": "/tools/software-architecture",
    data: "/tools/data",
    digitalisation: "/tools/digitalisation",
  };
  return routes[courseSlug] || "/tools";
}

export function getTemplateRouteForCourse(courseSlug: string): string {
  const routes: Record<string, string> = {
    cybersecurity: "/templates/cybersecurity",
    ai: "/templates/ai",
    "software-architecture": "/templates/software-architecture",
    data: "/templates/data",
    digitalisation: "/templates/digitalisation",
  };
  return routes[courseSlug] || "/templates";
}

export function getStudioRouteForCourse(courseSlug: string): string {
  const routes: Record<string, string> = {
    cybersecurity: "/cyber-studios",
    ai: "/ai-studios",
    "software-architecture": "/dev-studios",
    data: "/data-studios",
    digitalisation: "/data-studios",
  };
  return routes[courseSlug] || "/studios";
}

