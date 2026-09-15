"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BuildingIcon, HeartIcon, HomeIcon, SparklesIcon, UsersIcon } from "@/components/icons";

const items = [
  { href: "/explore", label: "Explore", icon: BuildingIcon, featured: false },
  { href: "/saved", label: "Saved", icon: HeartIcon, featured: false },
  { href: "/agent", label: "Agent", icon: SparklesIcon, featured: true },
  { href: "/community", label: "Community", icon: UsersIcon, featured: false },
  { href: "/my", label: "My Finqit", icon: HomeIcon, featured: false }
] as const;

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      {items.map(({ href, label, icon: Icon, featured }) => <Link key={href} href={href} className={`${featured ? "mobile-agent" : ""} ${pathname === href || pathname.startsWith(`${href}/`) ? "active" : ""}`}><Icon/><span>{label}</span></Link>)}
    </nav>
  );
}
