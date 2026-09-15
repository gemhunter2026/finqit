import Link from "next/link";

export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <span className={`brand-mark ${className}`} aria-hidden="true">
      <svg viewBox="0 0 40 40" role="img">
        <defs>
          <linearGradient id="finqitGradient" x1="4" x2="36" y1="4" y2="36" gradientUnits="userSpaceOnUse">
            <stop stopColor="#69C3FF" />
            <stop offset="1" stopColor="#2F7CF6" />
          </linearGradient>
        </defs>
        <path d="M20 3.7 34 12v16L20 36.3 6 28V12L20 3.7Z" fill="url(#finqitGradient)" />
        <path d="M12.8 19.1 20 13.4l7.2 5.7v8.1a2.3 2.3 0 0 1-2.3 2.3h-9.8a2.3 2.3 0 0 1-2.3-2.3v-8.1Z" fill="white" fillOpacity=".96" />
        <path d="m20 17.4 1.15 2.95L24.1 21.5l-2.95 1.15L20 25.6l-1.15-2.95-2.95-1.15 2.95-1.15L20 17.4Z" fill="#2F7CF6" />
      </svg>
    </span>
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="logo" aria-label="Finqit.ai home">
      <BrandMark />
      {!compact && <span className="logo-word">Finqit<span>.ai</span></span>}
    </Link>
  );
}
