import type { Metadata } from "next";
import Link from "next/link";
import { AgentBuilder } from "@/components/AgentBuilder";
import { ArrowRightIcon, ShieldIcon, SparklesIcon } from "@/components/icons";

export const metadata: Metadata = { title: "Smart Agent" };

export default function AgentPage() {
  return (
    <div className="page-top page-shell agent-page">
      <div className="agent-page-hero">
        <div><div className="eyebrow"><SparklesIcon size={16}/> Finqit Auto-Reserve</div><h1>Your property search,<br/><span>always switched on.</span></h1><p>Define the home, price and maximum reservation amount. Finqit watches verified listings and can secure the first exact match within those hard rules.</p></div>
        <div className="agent-assurance-card"><ShieldIcon size={26}/><strong>You stay in control.</strong><p>AI can recommend. Binding actions only happen inside deterministic rules you explicitly authorise.</p></div>
      </div>
      <AgentBuilder />
      <div className="agent-rules-section">
        <div><div className="eyebrow">Designed for fairness</div><h2>Fast doesn&apos;t have to mean unfair.</h2><p>Finqit&apos;s queue system is designed so the same buyer can&apos;t continuously block multiple properties.</p></div>
        <div className="rule-stack">
          <article><span>01</span><div><h3>One active reservation</h3><p>Once a buyer secures a home, every other auto-reserve rule pauses until they decide.</p></div></article>
          <article><span>02</span><div><h3>Priority resets transparently</h3><p>After successfully reserving, that buyer moves behind eligible users who have not yet secured one.</p></div></article>
          <article><span>03</span><div><h3>Every decision is logged</h3><p>Match criteria, queue position and reservation timestamp can be audited and explained.</p></div></article>
        </div>
      </div>
      <div className="agent-bottom-cta"><div><h2>Ready to stop refreshing?</h2><p>Create your rules now. Verification can be completed before the agent goes live.</p></div><Link className="button button-primary" href="/explore">Preview matching homes <ArrowRightIcon/></Link></div>
    </div>
  );
}
