export default function BrandLogo({
  className = "h-10 w-auto",
  title = "Ransford’s Notes",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 1200 300"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      preserveAspectRatio="xMinYMid meet"
    >
      <title>{title}</title>

      {/* Laptop icon */}
      <g transform="translate(40, 70)" fill="none" stroke="currentColor" strokeWidth="14" strokeLinejoin="round">
        <rect x="0" y="0" width="260" height="170" rx="18" />
        <path d="M-10 190 H270" strokeLinecap="round" />
        <rect x="18" y="18" width="224" height="134" rx="10" strokeWidth="10" opacity="0.85" />
      </g>

      {/* Globe inside screen */}
      <g transform="translate(170, 155)" fill="none" stroke="currentColor" strokeWidth="10" opacity="0.95">
        <circle r="44" />
        <path d="M-44 0 H44" />
        <path d="M0 -44 V44" />
        <path d="M-28 -34 C-10 -10 -10 10 -28 34" />
        <path d="M28 -34 C10 -10 10 10 28 34" />
        <path d="M-44 -18 C-18 -10 18 -10 44 -18" />
        <path d="M-44 18 C-18 10 18 10 44 18" />
      </g>

      {/* Wordmark */}
      <g transform="translate(360, 105)">
        <text
          x="0"
          y="0"
          fontFamily="system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
          fontSize="72"
          fontWeight="800"
          fill="currentColor"
          letterSpacing="1"
        >
          RANSFORD’S
        </text>
        <text
          x="0"
          y="92"
          fontFamily="system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
          fontSize="70"
          fontWeight="700"
          fill="currentColor"
        >
          Notes
        </text>
      </g>

      {/* Tagline */}
      <g transform="translate(360, 250)">
        <text
          x="0"
          y="0"
          fontFamily="system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
          fontSize="44"
          fontStyle="italic"
          fontWeight="600"
        >
          <tspan fill="#1d4ed8">DemystifyTech</tspan>
          <tspan fill="#0f172a"> </tspan>
          <tspan fill="#16a34a">|</tspan>
          <tspan fill="#0f172a"> </tspan>
          <tspan fill="#dc2626">Experiment</tspan>
          <tspan fill="#0f172a"> </tspan>
          <tspan fill="#16a34a">|</tspan>
          <tspan fill="#0f172a"> </tspan>
          <tspan fill="#6d28d9">Innovate</tspan>
        </text>
      </g>
    </svg>
  );
}


