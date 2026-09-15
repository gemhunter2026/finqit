"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BuildingIcon, HeartIcon, HomeIcon, SparklesIcon, UsersIcon } from "@/components/icons";

const items = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/explore", label: "Search", icon: BuildingIcon },
  { href: "/agent", label: "Agent", icon: SparklesIcon, featured: true },
  { href: "/list-property", label: "List", icon: HomeIcon },
  { href: "/community", label: "Community", icon: UsersIcon }
] as const;

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      {items.map(({ href, label, icon: Icon, featured }) => <Link key={href} href={href} className={`${featured ? "mobile-agent" : ""} ${pathname === href || (href !== "/" && pathname.startsWith(href)) ? "active" : ""}`}><Icon/><span>{label}</span></Link>)}
    </nav>
  );
}
