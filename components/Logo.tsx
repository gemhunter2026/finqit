import Link from "next/link";

export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <span className={`brand-mark ${className}`} aria-hidden="true">
      <svg viewBox="0 0 48 48" role="img" focusable="false">
        <defs>
          <linearGradient id="finqitBrandGradient" x1="7" x2="41" y1="6" y2="42" gradientUnits="userSpaceOnUse">
            <stop stopColor="#62BAFF" />
            <stop offset="1" stopColor="#2F7CF6" />
          </linearGradient>
        </defs>
        <rect x="4" y="4" width="40" height="40" rx="13" fill="url(#finqitBrandGradient)" />
        <path d="M13.2 22.2 24 13.5l10.8 8.7v10.2a3.2 3.2 0 0 1-3.2 3.2H16.4a3.2 3.2 0 0 1-3.2-3.2V22.2Z" fill="white" fillOpacity=".97" />
        <path d="M20.6 28.2h6.8v7.5h-6.8z" fill="#2F7CF6" />
        <path d="m28.4 20.4 1.15 2.75 2.75 1.15-2.75 1.15-1.15 2.75-1.15-2.75-2.75-1.15 2.75-1.15 1.15-2.75Z" fill="#62BAFF" />
      </svg>
    </span>
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="logo" aria-label="Finqit.ai home">
      <BrandMark />
      {!compact && (
        <span className="logo-word">
          Finqit<span>.ai</span>
        </span>
      )}
    </Link>
  );
}
