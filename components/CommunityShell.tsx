"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BellIcon, BuildingIcon, FileIcon, HomeIcon, MailIcon, PlusIcon, SparklesIcon, UsersIcon, VoteIcon, WalletIcon } from "@/components/icons";

const nav = [
  ["Overview", "/community", HomeIcon],
  ["Inbox", "/community/inbox", MailIcon],
  ["Documents", "#", FileIcon],
  ["Finances", "#", WalletIcon],
  ["Votes", "#", VoteIcon],
  ["Neighbours", "#", UsersIcon]
] as const;

export function CommunityShell({ children }: {children: React.ReactNode}) {
  const pathname = usePathname();
  return <div className="community-app page-shell">
    <aside className="community-sidebar">
      <div className="community-selector"><div className="community-avatar"><BuildingIcon/></div><div><strong>Comunitat Aribau 114</strong><span>Barcelona · 24 homes</span></div></div>
      <nav>{nav.map(([label, href, Icon]) => <Link key={label} href={href} className={(href !== "#" && pathname === href) ? "active" : ""}><Icon size={19}/>{label}{label === "Inbox" && <em>4</em>}</Link>)}</nav>
      <div className="community-sidebar-bottom"><div className="ai-sidebar-card"><SparklesIcon/><strong>Ask Finqit</strong><span>Search all community knowledge</span></div><button className="button button-secondary full-width"><PlusIcon/> Invite neighbour</button></div>
    </aside>
    <section className="community-main">
      <div className="community-mobile-title"><strong>Comunitat Aribau 114</strong><button className="icon-button"><BellIcon/></button></div>
      {children}
    </section>
  </div>
}
