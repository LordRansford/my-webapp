/**
 * Layout Components - Central Export
 * 
 * Central export point for all layout components.
 * Import from here for convenience.
 * 
 * Note: Grid is exported from BaseLayout for basic use.
 * ResponsiveGrid is exported from Grid.tsx for enhanced responsive behavior.
 */

export {
  BaseLayout,
  PageContainer,
  Section,
  Card,
  Stack,
  Inline,
  Grid,
} from "./BaseLayout";

// Enhanced responsive grid component
export { Grid as ResponsiveGrid } from "./Grid";

// Default export - BaseLayout for App Router compatibility
export { BaseLayout as default } from "./BaseLayout";
