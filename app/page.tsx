import Image from "next/image";
import Link from "next/link";
import { AgentBuilder } from "@/components/AgentBuilder";
import { PropertyCard } from "@/components/PropertyCard";
import { properties } from "@/data/properties";
import { ArrowRightIcon, BuildingIcon, CheckIcon, FileIcon, MailIcon, SearchIcon, ShieldIcon, SparklesIcon, UsersIcon, VoteIcon, WalletIcon } from "@/components/icons";

export default function Home() {
  return (
    <>
      <section className="hero page-shell">
        <div className="hero-copy">
          <div className="eyebrow"><SparklesIcon size={16}/> A fairer way to get home</div>
          <h1>Find it. <span>Secure it.</span><br/>See it before it&apos;s gone.</h1>
          <p className="hero-subtitle">Finqit turns home search into a transaction you can actually control — with verified listings, instant reservations and smart agents that can act for you.</p>
          <form className="hero-search" action="/explore">
            <SearchIcon size={22}/>
            <div><span>Where do you want to live?</span><strong>Sabadell, Barcelona...</strong></div>
            <button type="submit" aria-label="Search"><ArrowRightIcon size={21}/></button>
          </form>
          <div className="hero-actions-row">
            <Link className="button button-primary" href="/explore">Explore homes <ArrowRightIcon size={17}/></Link>
            <Link className="button button-secondary" href="/agent"><SparklesIcon size={17}/> Create your agent</Link>
          </div>
          <div className="trust-row">
            <span><CheckIcon size={15}/> Verified listings</span>
            <span><CheckIcon size={15}/> Transparent reservation terms</span>
            <span><CheckIcon size={15}/> Fair queue logic</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-photo-card">
            <Image src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=88" alt="Bright modern apartment" fill priority sizes="(max-width: 900px) 100vw, 48vw" />
            <div className="hero-photo-overlay" />
            <div className="hero-property-top">
              <span className="pill pill-white"><span className="status-dot"/> Instant Reserve</span>
              <span className="pill pill-blue"><SparklesIcon size={15}/> 98% match</span>
            </div>
            <div className="hero-property-card glass-card">
              <div><small>Eix Macià · Sabadell</small><strong>South-facing · 3 beds · terrace</strong></div>
              <span>€329k</span>
            </div>
          </div>
          <div className="floating-card queue-card">
            <div className="queue-icon"><ShieldIcon size={20}/></div>
            <div><small>Fair priority</small><strong>You&apos;re #1 for your next match</strong></div>
          </div>
          <div className="floating-card agent-mini-card">
            <span className="agent-pulse active" />
            <div><small>Your agent is watching</small><strong>23 new listings checked today</strong></div>
          </div>
        </div>
      </section>

      <section className="proof-strip">
        <div className="page-shell proof-grid">
          <div><strong>&lt; 10 sec</strong><span>to reserve an eligible match</span></div>
          <div><strong>1 active</strong><span>reservation per buyer</span></div>
          <div><strong>72 h</strong><span>typical exclusive visit window</span></div>
          <div><strong>100%</strong><span>terms shown before you commit</span></div>
        </div>
      </section>

      <section className="section page-shell">
        <div className="section-heading split-heading">
          <div><div className="eyebrow">Fresh opportunities</div><h2>Homes you can actually secure.</h2></div>
          <Link className="inline-link" href="/explore">See all homes <ArrowRightIcon size={17}/></Link>
        </div>
        <div className="property-grid home-property-grid">
          {properties.slice(0, 3).map((property) => <PropertyCard key={property.slug} property={property}/>) }
        </div>
      </section>

      <section className="section page-shell two-pillars">
        <div className="pillar-card marketplace-pillar">
          <div className="pillar-icon"><BuildingIcon size={25}/></div>
          <div className="eyebrow">For your next home</div>
          <h2>Search less.<br/>Move first.</h2>
          <p>Browse transaction-ready homes, reserve instantly, and let your smart agent watch for the exact property you want.</p>
          <ul className="clean-list">
            <li><CheckIcon/> Verified seller and listing data</li>
            <li><CheckIcon/> Standardised reservation terms</li>
            <li><CheckIcon/> One active reservation keeps access fair</li>
          </ul>
          <Link className="button button-primary" href="/explore">Explore marketplace <ArrowRightIcon/></Link>
        </div>
        <div className="pillar-card community-pillar">
          <div className="pillar-icon"><UsersIcon size={25}/></div>
          <div className="eyebrow">For where you already live</div>
          <h2>Your community,<br/>finally organised.</h2>
          <p>Every building gets an intelligent inbox. CC Finqit and decisions, invoices, minutes and requests become structured community knowledge.</p>
          <div className="community-feature-grid">
            <span><MailIcon/> Smart inbox</span>
            <span><FileIcon/> Documents</span>
            <span><WalletIcon/> Finances</span>
            <span><VoteIcon/> Voting</span>
          </div>
          <Link className="button button-dark" href="/community">Open community demo <ArrowRightIcon/></Link>
        </div>
      </section>

      <section className="section agent-home page-shell">
        <div className="section-heading centered-heading">
          <div className="eyebrow"><SparklesIcon size={16}/> Finqit Agent</div>
          <h2>Your search can keep moving<br/>even when you can&apos;t.</h2>
          <p>Automation is only allowed inside the rules you define. No black box bidding. No surprise spending.</p>
        </div>
        <AgentBuilder />
      </section>

      <section className="section page-shell how-it-works">
        <div className="section-heading centered-heading"><div className="eyebrow">Instant Reserve</div><h2>From listing to viewing in three clear steps.</h2></div>
        <div className="steps-grid">
          <article><span>1</span><h3>Match</h3><p>You or your agent find a verified home that fits your hard requirements.</p></article>
          <article><span>2</span><h3>Reserve</h3><p>Accept transparent terms and secure an exclusive viewing window in seconds.</p></article>
          <article><span>3</span><h3>Decide</h3><p>Visit the home. Continue and the agreed amount is credited, or decline under the stated refund rules.</p></article>
        </div>
      </section>

      <section className="section final-cta-wrap">
        <div className="final-cta page-shell">
          <div><div className="eyebrow light">Built for a faster market</div><h2>Don&apos;t refresh listings.<br/>Build your advantage.</h2></div>
          <div className="final-cta-actions"><Link className="button button-white" href="/agent">Create smart agent</Link><Link className="button button-ghost-light" href="/list-property">List a property</Link></div>
        </div>
      </section>

      <footer className="site-footer page-shell">
        <div><strong>Finqit.ai</strong><p>Find, secure and manage homes with confidence.</p></div>
        <div className="footer-links"><Link href="/explore">Marketplace</Link><Link href="/agent">Smart Agent</Link><Link href="/community">Communities</Link><Link href="/list-property">For agencies</Link></div>
        <small>© 2026 Finqit.ai · Prototype experience</small>
      </footer>
    </>
  );
}
