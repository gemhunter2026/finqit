"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { MenuIcon, XIcon } from "@/components/icons";

const nav = [
  ["Explore", "/explore"],
  ["Smart Agent", "/agent"],
  ["Communities", "/community"],
  ["For agencies", "/list-property"]
] as const;

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-inner page-shell">
        <Logo />
        <nav className="desktop-nav" aria-label="Main navigation">
          {nav.map(([label, href]) => (
            <Link className={pathname.startsWith(href) ? "active" : ""} href={href} key={href}>{label}</Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link className="text-button desktop-only" href="/community">Sign in</Link>
          <Link className="button button-primary button-sm desktop-only" href="/explore">Find a home</Link>
          <button className="icon-button mobile-menu-button" onClick={() => setOpen(!open)} aria-label="Toggle navigation" aria-expanded={open}>
            {open ? <XIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
      {open && (
        <div className="mobile-nav page-shell">
          {nav.map(([label, href]) => <Link href={href} key={href} onClick={() => setOpen(false)}>{label}</Link>)}
          <div className="mobile-nav-actions">
            <Link className="button button-secondary" href="/community" onClick={() => setOpen(false)}>Sign in</Link>
            <Link className="button button-primary" href="/explore" onClick={() => setOpen(false)}>Find a home</Link>
          </div>
        </div>
      )}
    </header>
  );
}
