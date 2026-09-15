import Link from "next/link";
import { BuildingIcon, HeartIcon, HomeIcon, SparklesIcon, UsersIcon } from "@/components/icons";

export function MobileNav() {
  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      <Link href="/"><HomeIcon/><span>Home</span></Link>
      <Link href="/explore"><BuildingIcon/><span>Explore</span></Link>
      <Link href="/agent" className="mobile-agent"><SparklesIcon/><span>Agent</span></Link>
      <Link href="/community"><UsersIcon/><span>Community</span></Link>
      <Link href="/explore"><HeartIcon/><span>Saved</span></Link>
    </nav>
  );
}
