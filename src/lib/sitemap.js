/**
 * Comprehensive site map structure for navigation and discovery
 * This ensures all pages are discoverable and nothing is hidden
 */

export const siteStructure = {
  courses: [
    {
      id: "cybersecurity",
      title: "Cybersecurity",
      href: "/cybersecurity",
      description: "Practical security thinking, from foundations to strategy.",
      levels: [
        { title: "Foundations", href: "/cybersecurity/beginner" },
        { title: "Applied", href: "/cybersecurity/intermediate" },
        { title: "Practice and Strategy", href: "/cybersecurity/advanced" },
        { title: "Summary and Games", href: "/cybersecurity/summary" },
        { title: "Course Overview", href: "/cybersecurity/course" },
        { title: "Dashboards", href: "/cybersecurity/dashboards" },
      ],
    },
    {
      id: "ai",
      title: "AI",
      href: "/ai",
      description: "Models, evaluation, and responsible use without the hype.",
      levels: [
        { title: "Foundations", href: "/ai/beginner" },
        { title: "Intermediate", href: "/ai/intermediate" },
        { title: "Advanced", href: "/ai/advanced" },
        { title: "Summary and Games", href: "/ai/summary" },
        { title: "Dashboards", href: "/ai/dashboards" },
      ],
    },
    {
      id: "software-architecture",
      title: "Software Architecture",
      href: "/software-architecture",
      description: "Make trade-offs explicit and design systems that survive reality.",
      levels: [
        { title: "Foundations", href: "/software-architecture/beginner" },
        { title: "Intermediate", href: "/software-architecture/intermediate" },
        { title: "Advanced", href: "/software-architecture/advanced" },
        { title: "Summary and Games", href: "/software-architecture/summary" },
        { title: "Dashboards", href: "/software-architecture/dashboards" },
      ],
    },
    {
      id: "data",
      title: "Data",
      href: "/data",
      description: "Data quality, governance, and decision pipelines that work.",
      levels: [
        { title: "Foundations", href: "/data/foundations" },
        { title: "Intermediate", href: "/data/intermediate" },
        { title: "Advanced", href: "/data/advanced" },
        { title: "Summary", href: "/data/summary" },
      ],
    },
    {
      id: "digitalisation",
      title: "Digitalisation",
      href: "/digitalisation",
      description: "Strategy, operating models, and delivery with clear outcomes.",
      levels: [
        { title: "Foundations", href: "/digitalisation/beginner" },
        { title: "Intermediate", href: "/digitalisation/intermediate" },
        { title: "Advanced", href: "/digitalisation/advanced" },
        { title: "Summary and Games", href: "/digitalisation/summary" },
        { title: "Dashboards", href: "/digitalisation/dashboards" },
      ],
    },
  ],
  studios: [
    { title: "Software Development Studio", href: "/dev-studios" },
    { title: "Cybersecurity Studio", href: "/cyber-studios" },
    { title: "Data and Digitalisation Studio", href: "/data-studios" },
    { title: "AI Studio Hub", href: "/studios/ai-hub" },
    { title: "AI Studio (Learn)", href: "/ai-studios" },
    { title: "AI Studio (Build)", href: "/ai-studio" },
    { title: "Architecture Diagram Studio", href: "/studios/architecture-diagram-studio" },
    { title: "Model Forge", href: "/studios/model-forge" },
    { title: "Vision Lab", href: "/studios/vision-lab" },
    { title: "Speech & Sound Lab", href: "/studios/speech-lab" },
    { title: "Docs & Data Lab", href: "/studios/docs-data-lab" },
    { title: "LLM & Agent Lab", href: "/studios/llm-agent-lab" },
    { title: "Evaluation & Governance Lab", href: "/studios/eval-governance-lab" },
  ],
  dashboards: [
    { title: "AI Dashboards", href: "/dashboards/ai" },
    { title: "Cybersecurity Dashboards", href: "/dashboards/cybersecurity" },
    { title: "Architecture Dashboards", href: "/dashboards/architecture" },
    { title: "Digitalisation Dashboards", href: "/dashboards/digitalisation" },
  ],
  templates: [
    { title: "All Templates", href: "/templates" },
    { title: "Cybersecurity Templates", href: "/templates/cybersecurity" },
    { title: "AI Templates", href: "/templates/ai" },
    { title: "Data Templates", href: "/templates/data" },
    { title: "Digitalisation Templates", href: "/templates/digitalisation" },
    { title: "Software Architecture Templates", href: "/templates/software-architecture" },
  ],
  games: [
    { title: "Action Games", href: "/games" },
    { title: "Practice Games", href: "/practice" },
    { title: "Play Hub", href: "/play" },
    { title: "Thinking Gym", href: "/thinking-gym" },
    { title: "Games Offline Mode", href: "/games/offline" },
  ],
  tools: [
    { title: "All Tools", href: "/tools" },
    { title: "AI Tools", href: "/tools/ai" },
    { title: "Cybersecurity Tools", href: "/tools/cybersecurity" },
    { title: "Software Architecture Tools", href: "/tools/software-architecture" },
    { title: "Data Tools", href: "/tools/data" },
    { title: "Digitalisation Tools", href: "/tools/digitalisation" },
  ],
  learning: [
    { title: "All Courses", href: "/courses" },
    { title: "CPD Tracking", href: "/cpd" },
    { title: "My CPD", href: "/my-cpd" },
    { title: "CPD Evidence", href: "/my-cpd/evidence" },
    { title: "CPD Records", href: "/my-cpd/records" },
    { title: "Blog Posts", href: "/posts" },
  ],
  account: [
    { title: "Account", href: "/account" },
    { title: "Certificates", href: "/account/certificates" },
    { title: "Usage History", href: "/account/history" },
    { title: "Credits", href: "/account/credits" },
  ],
  support: [
    { title: "About", href: "/about" },
    { title: "Contact", href: "/contact" },
    { title: "Accessibility", href: "/accessibility" },
    { title: "Site Map", href: "/sitemap" },
    { title: "Privacy", href: "/privacy" },
    { title: "Terms", href: "/terms" },
    { title: "Legal", href: "/trust-and-about" },
    { title: "Listen (Music Player)", href: "/listen" },
    { title: "Feedback", href: "/feedback" },
  ],
};

export const getAllPages = () => {
  const pages = [];
  
  // Add all course pages
  siteStructure.courses.forEach((course) => {
    pages.push({ title: course.title, href: course.href, category: "Courses" });
    course.levels?.forEach((level) => {
      pages.push({ title: `${course.title} - ${level.title}`, href: level.href, category: "Courses" });
    });
  });

  // Add all studios
  siteStructure.studios.forEach((studio) => {
    pages.push({ title: studio.title, href: studio.href, category: "Studios" });
  });

  // Add all dashboards
  siteStructure.dashboards.forEach((dashboard) => {
    pages.push({ title: dashboard.title, href: dashboard.href, category: "Dashboards" });
  });

  // Add all templates
  siteStructure.templates.forEach((template) => {
    pages.push({ title: template.title, href: template.href, category: "Templates" });
  });

  // Add all games
  siteStructure.games.forEach((game) => {
    pages.push({ title: game.title, href: game.href, category: "Games" });
  });

  // Add all tools
  siteStructure.tools.forEach((tool) => {
    pages.push({ title: tool.title, href: tool.href, category: "Tools" });
  });

  // Add learning resources
  siteStructure.learning.forEach((item) => {
    pages.push({ title: item.title, href: item.href, category: "Learning" });
  });

  // Add account pages
  siteStructure.account.forEach((item) => {
    pages.push({ title: item.title, href: item.href, category: "Account" });
  });

  // Add support pages
  siteStructure.support.forEach((item) => {
    pages.push({ title: item.title, href: item.href, category: "Support" });
  });

  return pages;
};

