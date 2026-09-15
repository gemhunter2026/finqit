"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BuildingIcon, HomeIcon, SparklesIcon, UsersIcon } from "@/components/icons";

const items = [
  { href: "/", label: "Home", icon: HomeIcon, featured: false },
  { href: "/explore", label: "Search", icon: BuildingIcon, featured: false },
  { href: "/agent", label: "Agent", icon: SparklesIcon, featured: true },
  { href: "/list-property", label: "List", icon: HomeIcon, featured: false },
  { href: "/community", label: "Community", icon: UsersIcon, featured: false }
] as const;

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      {items.map(({ href, label, icon: Icon, featured }) => <Link key={href} href={href} className={`${featured ? "mobile-agent" : ""} ${pathname === href || (href !== "/" && pathname.startsWith(href)) ? "active" : ""}`}><Icon/><span>{label}</span></Link>)}
    </nav>
  );
}
