"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { MenuIcon, SearchIcon, XIcon } from "@/components/icons";

const nav = [
  ["Buy", "/explore"],
  ["Finqit Agent", "/agent"],
  ["Communities", "/community"],
  ["List a property", "/list-property"]
] as const;

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-inner mkt-shell">
        <Logo />
        <nav className="desktop-nav" aria-label="Main navigation">
          {nav.map(([label, href]) => <Link className={pathname.startsWith(href) ? "active" : ""} href={href} key={href}>{label}</Link>)}
        </nav>
        <div className="header-actions">
          {pathname !== "/" && <Link className="icon-button desktop-only" href="/explore" aria-label="Search homes"><SearchIcon size={18}/></Link>}
          <button className="text-button desktop-only" type="button">Sign in</button>
          <Link className="button button-primary button-sm desktop-only" href="/list-property">List your home</Link>
          <button className="icon-button mobile-menu-button" onClick={() => setOpen(!open)} aria-label="Toggle navigation" aria-expanded={open}>{open ? <XIcon /> : <MenuIcon />}</button>
        </div>
      </div>
      {open && <div className="mobile-nav mkt-shell">
        {nav.map(([label, href]) => <Link href={href} key={href} onClick={() => setOpen(false)}>{label}</Link>)}
        <div className="mobile-nav-actions"><Link className="button button-secondary" href="/explore" onClick={() => setOpen(false)}>Find a home</Link><Link className="button button-primary" href="/list-property" onClick={() => setOpen(false)}>List a property</Link></div>
      </div>}
    </header>
  );
}
