import Link from "next/link";

export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <span className={`brand-mark ${className}`} aria-hidden="true">
      <svg viewBox="0 0 64 64" role="img" focusable="false">
        <path d="M4 58V33L23 22V58H4Z" fill="#1E5BFF" />
        <path d="M27 58V18L47 6V58H27Z" fill="#1558FF" />
        <path d="M51 58V32L60 38V58H51Z" fill="#43B8FF" />
      </svg>
    </span>
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="logo" aria-label="Finqit home">
      <BrandMark />
      {!compact && <span className="logo-word">Finqit</span>}
    </Link>
  );
}
