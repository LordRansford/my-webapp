export default function Logo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Ransford's Notes"
    >
      <rect x="10" y="10" width="80" height="80" rx="12" fill="currentColor" opacity="0.1" />
      <rect x="10" y="10" width="80" height="80" rx="12" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <text x="50" y="62" textAnchor="middle" fontSize="36" fontWeight="700" fill="currentColor" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="-0.5">
        RN
      </text>
    </svg>
  );
}
