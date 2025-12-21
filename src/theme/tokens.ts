export const tokens = {
  spacing: {
    xs: "0.5rem",
    sm: "0.75rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
  },
  radius: {
    sm: "0.75rem",
    md: "1rem",
    lg: "1.5rem",
    pill: "9999px",
  },
  shadow: {
    sm: "0 8px 18px rgba(15,23,42,0.08)",
    md: "0 14px 28px rgba(15,23,42,0.10)",
    lg: "0 20px 50px rgba(0,0,0,0.08)",
  },
  typography: {
    body: { size: "1.05rem", weight: 500 },
    heading: { weight: 700 },
    mono: { weight: 500 },
  },
  color: {
    bg: "var(--bg)",
    surface: "var(--surface)",
    border: "var(--line)",
    text: "var(--text-body)",
    muted: "var(--text-muted)",
    accent: "var(--accent)",
  },
  focusRing: "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600",
} as const;


