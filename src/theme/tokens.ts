/**
 * Design Tokens
 * 
 * TypeScript representation of the design system tokens.
 * These match the CSS custom properties defined in the design system.
 */

export const tokens = {
  spacing: {
    unit: "0.25rem", // 4px base unit
    0: "0",
    1: "0.25rem",  // 4px
    2: "0.5rem",   // 8px
    3: "0.75rem",  // 12px
    4: "1rem",     // 16px
    5: "1.25rem",  // 20px
    6: "1.5rem",   // 24px
    8: "2rem",     // 32px
    10: "2.5rem",  // 40px
    12: "3rem",    // 48px
    16: "4rem",    // 64px
    20: "5rem",    // 80px
    24: "6rem",    // 96px
    32: "8rem",    // 128px
    40: "10rem",   // 160px
    48: "12rem",   // 192px
    64: "16rem",   // 256px
    xs: "var(--space-xs)",
    sm: "var(--space-sm)",
    md: "var(--space-md)",
    lg: "var(--space-lg)",
    xl: "var(--space-xl)",
    "2xl": "var(--space-2xl)",
    "3xl": "var(--space-3xl)",
    "4xl": "var(--space-4xl)",
    // Component-specific spacing
    cardPadding: "var(--space-card-padding)",
    sectionGap: "var(--space-section-gap)",
    pagePadding: "var(--space-page-padding)",
    contentGap: "var(--space-content-gap)",
    formGap: "var(--space-form-gap)",
    navGap: "var(--space-nav-gap)",
    // Grid gaps
    gridGap: {
      sm: "var(--grid-gap-sm)",
      md: "var(--grid-gap-md)",
      lg: "var(--grid-gap-lg)",
      xl: "var(--grid-gap-xl)",
    },
    // Container sizes
    container: {
      sm: "var(--container-sm)",
      md: "var(--container-md)",
      lg: "var(--container-lg)",
      xl: "var(--container-xl)",
      "2xl": "var(--container-2xl)",
    },
    // Container padding
    containerPadding: {
      base: "var(--container-padding)",
      sm: "var(--container-padding-sm)",
      lg: "var(--container-padding-lg)",
    },
  },
  radius: {
    none: "0",
    sm: "0.5rem",    // 8px
    md: "0.75rem",   // 12px
    lg: "1rem",      // 16px
    xl: "1.5rem",    // 24px
    "2xl": "2rem",   // 32px
    full: "9999px",
  },
  border: {
    width: {
      none: "var(--border-width-none)",
      sm: "var(--border-width-sm)",
      md: "var(--border-width-md)",
      lg: "var(--border-width-lg)",
    },
  },
  shadow: {
    xs: "var(--shadow-xs)",
    sm: "var(--shadow-sm)",
    md: "var(--shadow-md)",
    lg: "var(--shadow-lg)",
    xl: "var(--shadow-xl)",
    "2xl": "var(--shadow-2xl)",
    inner: "var(--shadow-inner)",
  },
  typography: {
    fontSize: {
      xs: "var(--font-size-xs)",
      sm: "var(--font-size-sm)",
      base: "var(--font-size-base)",
      lg: "var(--font-size-lg)",
      xl: "var(--font-size-xl)",
      "2xl": "var(--font-size-2xl)",
      "3xl": "var(--font-size-3xl)",
      "4xl": "var(--font-size-4xl)",
      "5xl": "var(--font-size-5xl)",
      "6xl": "var(--font-size-6xl)",
    },
    lineHeight: {
      none: "var(--line-height-none)",
      tight: "var(--line-height-tight)",
      snug: "var(--line-height-snug)",
      normal: "var(--line-height-normal)",
      relaxed: "var(--line-height-relaxed)",
      loose: "var(--line-height-loose)",
    },
    letterSpacing: {
      tighter: "var(--letter-spacing-tighter)",
      tight: "var(--letter-spacing-tight)",
      normal: "var(--letter-spacing-normal)",
      wide: "var(--letter-spacing-wide)",
      wider: "var(--letter-spacing-wider)",
    },
    fontWeight: {
      normal: "var(--font-weight-normal)",
      medium: "var(--font-weight-medium)",
      semibold: "var(--font-weight-semibold)",
      bold: "var(--font-weight-bold)",
      extrabold: "var(--font-weight-extrabold)",
    },
  },
  color: {
    bg: {
      primary: "var(--color-bg-primary)",
      secondary: "var(--color-bg-secondary)",
      tertiary: "var(--color-bg-tertiary)",
    },
    surface: {
      base: "var(--color-surface)",
      elevated: "var(--color-surface-elevated)",
      card: "var(--color-card)",
    },
    text: {
      primary: "var(--color-text-primary)",
      secondary: "var(--color-text-secondary)",
      tertiary: "var(--color-text-tertiary)",
      heading: "var(--color-text-heading)",
      muted: "var(--color-text-muted)",
      inverse: "var(--color-text-inverse)",
    },
    border: {
      primary: "var(--color-border-primary)",
      secondary: "var(--color-border-secondary)",
      focus: "var(--color-border-focus)",
    },
    accent: {
      primary: "var(--color-accent-primary)",
      secondary: "var(--color-accent-secondary)",
      mint: "var(--color-accent-mint)",
      amber: "var(--color-accent-amber)",
    },
    semantic: {
      success: "var(--color-success)",
      warning: "var(--color-warning)",
      error: "var(--color-error)",
      info: "var(--color-info)",
    },
  },
  // Legacy color mappings for backward compatibility
  colorLegacy: {
    bg: "var(--bg)",
    surface: "var(--surface)",
    border: "var(--line)",
    text: "var(--text-body)",
    muted: "var(--text-muted)",
    accent: "var(--accent)",
  },
  motion: {
    duration: {
      instant: "var(--duration-instant)",
      fast: "var(--duration-fast)",
      normal: "var(--duration-normal)",
      slow: "var(--duration-slow)",
      slower: "var(--duration-slower)",
    },
    easing: {
      linear: "var(--ease-linear)",
      in: "var(--ease-in)",
      out: "var(--ease-out)",
      inOut: "var(--ease-in-out)",
      smooth: "var(--ease-smooth)",
      bounce: "var(--ease-bounce)",
    },
    transition: {
      fast: "var(--transition-fast)",
      normal: "var(--transition-normal)",
      slow: "var(--transition-slow)",
    },
  },
  focusRing: "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600",
} as const;


