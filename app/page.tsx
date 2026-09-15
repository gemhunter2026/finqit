import Link from "next/link";
import { MarketplaceHero } from "@/components/MarketplaceHero";
import { PropertyCard } from "@/components/PropertyCard";
import { properties } from "@/data/properties";
import { ArrowRightIcon, CheckIcon, MailIcon, ShieldIcon, SparklesIcon, UsersIcon } from "@/components/icons";

const categories = ["Instant Reserve", "Under €350k", "3+ bedrooms", "Terrace", "South-facing", "New today"];

export default function Home() {
  return (
    <>
      <MarketplaceHero />

      <section className="mkt-shell mkt-stats" aria-label="Finqit marketplace principles">
        <div><strong>&lt;10 sec</strong><span>to secure an eligible home</span></div>
        <div><strong>1 active</strong><span>reservation per buyer</span></div>
        <div><strong>72 h</strong><span>typical exclusive visit window</span></div>
        <div><strong>100%</strong><span>terms visible before payment</span></div>
      </section>

      <section className="mkt-section mkt-shell">
        <div className="mkt-section-head">
          <div><div className="mkt-section-label">Explore homes</div><h2>Homes you can actually move on.</h2></div>
          <Link href="/explore" className="inline-link">View all homes <ArrowRightIcon size={17}/></Link>
        </div>
        <div className="mkt-category-row" aria-label="Popular filters">
          {categories.map((item, index) => <Link key={item} href="/explore" className={`mkt-category ${index === 0 ? "active" : ""}`}>{item}</Link>)}
        </div>
        <div className="property-grid" style={{marginTop:22}}>
          {properties.slice(0, 3).map((property) => <PropertyCard key={property.slug} property={property}/>) }
        </div>
      </section>

      <section className="mkt-section" style={{background:"#f7fbff",borderBlock:"1px solid #eaf1f7"}}>
        <div className="mkt-shell">
          <div className="mkt-section-head">
            <div><div className="mkt-section-label">How Instant Reserve works</div><h2>A fair queue, not a race to call.</h2></div>
            <p>When a seller enables Instant Reserve, the listing comes with a pre-agreed short reservation structure. Eligible buyers can secure the next exclusive decision window under the same published rules.</p>
          </div>
          <div className="steps-grid">
            <article><span>1</span><h3>Verified listing</h3><p>Seller authority, key property information and reservation conditions are prepared before the home is marked reservable.</p></article>
            <article><span>2</span><h3>Reserve & lock</h3><p>You accept the displayed terms and pay through the future regulated payment flow. The property is locked for the agreed window.</p></article>
            <article><span>3</span><h3>Visit & decide</h3><p>Proceed and the agreed amount can be credited toward the purchase, or decline under the stated premium/refund rules.</p></article>
          </div>
        </div>
      </section>

      <section className="mkt-section mkt-shell">
        <div className="mkt-section-head">
          <div><div className="mkt-section-label">Finqit Agent</div><h2>Let your search stay awake.</h2></div>
          <p>Your agent can monitor hard criteria and act only inside the price, location and reservation limits you explicitly authorise.</p>
        </div>
        <div className="two-pillars">
          <div className="pillar-card marketplace-pillar" style={{minHeight:430}}>
            <div className="pillar-icon"><SparklesIcon size={24}/></div>
            <div className="eyebrow">Buyer automation</div>
            <h2>See the match.<br/>Not the noise.</h2>
            <p>Set non-negotiables like city, maximum price, bedrooms, orientation and maximum reservation payment.</p>
            <ul className="clean-list"><li><CheckIcon/> Hard filters only for auto-reserve</li><li><CheckIcon/> One active reservation at a time</li><li><CheckIcon/> Every automated action is logged</li></ul>
            <Link className="button button-primary" href="/agent">Configure agent <ArrowRightIcon/></Link>
          </div>
          <div className="pillar-card" style={{minHeight:430,background:"white",border:"1px solid #e5edf5"}}>
            <div className="pillar-icon"><ShieldIcon size={24}/></div>
            <div className="eyebrow">For sellers & agencies</div>
            <h2>Publish once.<br/>Handle demand fairly.</h2>
            <p>Turn a listing into a transaction-ready opportunity with standard information, clear terms and controlled reservation windows.</p>
            <ul className="clean-list"><li><CheckIcon/> Owner or agency mandate</li><li><CheckIcon/> Buyer queue and anti-abuse rules</li><li><CheckIcon/> Reservation-ready listing wizard</li></ul>
            <Link className="button button-secondary" href="/list-property">List a property <ArrowRightIcon/></Link>
          </div>
        </div>
      </section>

      <section className="mkt-shell mkt-community-band">
        <div>
          <div className="eyebrow light"><UsersIcon size={15}/> The other side of Finqit</div>
          <h2>Already own a home? Your community lives here too.</h2>
          <p>The community workspace remains a separate Finqit product area: give each building an intelligent inbox for minutes, invoices, incidents, votes and shared knowledge.</p>
        </div>
        <Link className="button button-white" href="/community"><MailIcon size={17}/> Open community demo</Link>
      </section>

      <footer className="site-footer mkt-shell">
        <div><strong>Finqit.ai</strong><p>Find, reserve and manage homes with confidence.</p></div>
        <div className="footer-links"><Link href="/explore">Marketplace</Link><Link href="/agent">Buying Agent</Link><Link href="/list-property">List property</Link><Link href="/community">Communities</Link></div>
        <small>© 2026 Finqit.ai · Product prototype</small>
      </footer>
    </>
  );
}
