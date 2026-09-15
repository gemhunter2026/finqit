"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRightIcon, CheckIcon, SearchIcon, SparklesIcon } from "@/components/icons";

export function MarketplaceHero() {
  const router = useRouter();
  const [location, setLocation] = useState("Sabadell");
  const [budget, setBudget] = useState("€350k");
  const [beds, setBeds] = useState("3+");

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams({ q: location });
    if (budget) params.set("budget", budget.replace(/[^0-9]/g, ""));
    if (beds) params.set("beds", beds.replace(/[^0-9]/g, ""));
    router.push(`/explore?${params.toString()}`);
  };

  return (
    <section className="mkt-hero">
      <div className="mkt-shell mkt-hero-grid">
        <div className="mkt-hero-copy">
          <div className="mkt-kicker"><SparklesIcon size={15}/> Property search that can act for you</div>
          <h1>Find it. <span>Reserve it.</span><br/>Then go see it.</h1>
          <p>Finqit gives serious buyers a fair way to secure a short exclusive decision window on transaction-ready homes — before a great listing disappears into calls and WhatsApps.</p>

          <form className="mkt-search" onSubmit={submit}>
            <label className="mkt-search-field">
              <small>Where</small>
              <input value={location} onChange={(e) => setLocation(e.target.value)} aria-label="Location" placeholder="City or neighbourhood"/>
            </label>
            <button type="button" className="mkt-search-field" onClick={() => setBudget(budget === "€350k" ? "€500k" : "€350k")}>
              <small>Max price</small><strong>{budget}</strong>
            </button>
            <button type="button" className="mkt-search-field" onClick={() => setBeds(beds === "3+" ? "2+" : "3+")}>
              <small>Bedrooms</small><strong>{beds} beds</strong>
            </button>
            <button type="submit" className="mkt-search-submit" aria-label="Search homes"><SearchIcon size={21}/></button>
          </form>

          <div className="mkt-hero-actions">
            <Link href="/explore" className="button button-primary">Explore homes <ArrowRightIcon size={17}/></Link>
            <Link href="/agent" className="button button-secondary"><SparklesIcon size={17}/> Create buying agent</Link>
          </div>
          <div className="mkt-hero-trust">
            <span><CheckIcon size={14}/> Verified seller mandate</span>
            <span><CheckIcon size={14}/> Terms before payment</span>
            <span><CheckIcon size={14}/> One active reservation</span>
          </div>
        </div>

        <div className="mkt-hero-visual">
          <div className="mkt-hero-photo">
            <Image src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=88" alt="Bright modern apartment" fill priority sizes="(max-width: 900px) 100vw, 48vw"/>
          </div>
          <div className="mkt-hero-float top"><span className="mkt-mini-status"><span className="mkt-mini-dot"/> Instant Reserve available</span><small>Exclusive viewing window</small><strong>72 hours to visit & decide</strong></div>
          <div className="mkt-hero-float bottom">
            <div className="mkt-hero-property-line"><div><small>Eix Macià · Sabadell</small><strong>South-facing · 3 bedrooms · terrace</strong></div><div className="mkt-hero-price">€329k</div></div>
            <div style={{display:"flex",justifyContent:"space-between",gap:12,marginTop:12,paddingTop:12,borderTop:"1px solid #edf1f5"}}><span className="pill pill-blue"><SparklesIcon size={14}/> 98% match</span><Link href="/property/eix-macia-south-terrace" className="card-link">See home →</Link></div>
          </div>
        </div>
      </div>
    </section>
  );
}
