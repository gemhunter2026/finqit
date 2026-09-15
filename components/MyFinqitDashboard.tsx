"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AgentConfig, FINQIT_STATE_EVENT, ReservationRecord, SellerListing, clearActiveReservation, getActiveReservation, getAgentConfig, getSavedHomes, getSellerListings } from "@/lib/demo-state";
import { properties, formatPrice } from "@/data/properties";
import { ArrowRightIcon, BuildingIcon, CheckIcon, ClockIcon, HeartIcon, ShieldIcon, SparklesIcon, UsersIcon, WalletIcon } from "@/components/icons";
import { PropertyCard } from "@/components/PropertyCard";
import { SellerMarketplaceCard } from "@/components/SellerMarketplaceCard";

export function MyFinqitDashboard() {
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);
  const [reservation, setReservation] = useState<ReservationRecord | null>(null);
  const [agent, setAgent] = useState<AgentConfig | null>(null);
  const [sellerListings, setSellerListings] = useState<SellerListing[]>([]);
  const [notice, setNotice] = useState<string | null>(null);

  const sync = () => {
    setSavedSlugs(getSavedHomes());
    setReservation(getActiveReservation());
    setAgent(getAgentConfig());
    setSellerListings(getSellerListings());
  };

  useEffect(() => {
    sync();
    window.addEventListener(FINQIT_STATE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(FINQIT_STATE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const savedProperties = useMemo(() => properties.filter((property) => savedSlugs.includes(property.slug)), [savedSlugs]);
  const savedSellerListings = useMemo(() => sellerListings.filter((listing) => listing.status === "live" && savedSlugs.includes(`seller-listing:${listing.id}`)), [savedSlugs, sellerListings]);
  const totalSaved = savedProperties.length + savedSellerListings.length;
  const reservedProperty = reservation ? properties.find((property) => property.slug === reservation.propertySlug) : null;
  const reservationHref = reservation?.propertySlug.startsWith("seller-listing:") ? `/seller-listing/${reservation.propertySlug.replace("seller-listing:", "")}` : reservation ? `/property/${reservation.propertySlug}` : "/explore";
  const agentEffective = Boolean(agent?.active && agent.authorised && !reservation);

  const endReservation = (status: "released" | "proceeded") => {
    clearActiveReservation(status);
    setReservation(null);
    setNotice(status === "released" ? "Reservation released. Your queue eligibility and Auto-Reserve Agent can resume." : "Marked as proceeding. In production this would move into the purchase workflow.");
    window.setTimeout(() => setNotice(null), 4200);
  };

  return <div className="my-finqit">
    {notice && <div className="my-toast"><CheckIcon size={17}/>{notice}</div>}

    <section className="my-hero">
      <div>
        <div className="eyebrow">My Finqit</div>
        <h1>Your home search,<br/><span>under control.</span></h1>
        <p>One place for your active reservation, Auto-Reserve rules, saved homes and community.</p>
      </div>
      <div className="my-readiness-card">
        <div className="my-readiness-head"><ShieldIcon size={22}/><div><strong>Buyer readiness</strong><span>Prototype profile</span></div><b>80%</b></div>
        <div className="my-readiness-bar"><span style={{width:"80%"}}/></div>
        <div className="my-readiness-list"><span><CheckIcon size={14}/> Identity verified</span><span><CheckIcon size={14}/> Payment method ready</span><span className="pending">○ Financing proof optional</span></div>
      </div>
    </section>

    <section className="my-status-grid">
      <article className={`my-status-card reservation ${reservation ? "live" : ""}`}>
        <div className="my-status-icon"><ClockIcon/></div>
        <div className="my-status-top"><span>Active reservation</span><strong>{reservation ? "Exclusive window" : "None"}</strong></div>
        {reservation ? <>
          <h2>{reservation.propertyTitle}</h2>
          <p>{reservedProperty ? `${reservedProperty.district}, ${reservedProperty.city}` : "Seller-published home"} · {reservation.visitWindow}</p>
          <div className="my-money-row"><span>Reserved amount</span><strong>{formatPrice(reservation.reservationFee)}</strong></div>
          <div className="my-reservation-actions">
            <Link className="button button-primary" href={reservationHref}>View home</Link>
            <button className="button button-secondary" type="button" onClick={() => endReservation("proceeded")}>I want to proceed</button>
            <button className="text-button danger" type="button" onClick={() => endReservation("released")}>Release reservation</button>
          </div>
        </> : <>
          <h2>You&apos;re fully eligible.</h2>
          <p>No property is currently locked, so you retain full eligibility for matching homes.</p>
          <Link className="button button-primary" href="/explore">Explore Instant Reserve homes</Link>
        </>}
      </article>

      <article className={`my-status-card agent ${agentEffective ? "live" : ""}`}>
        <div className="my-status-icon"><SparklesIcon/></div>
        <div className="my-status-top"><span>Auto-Reserve Agent</span><strong>{reservation && agent?.active ? "Auto-paused" : agentEffective ? "Watching" : agent?.authorised ? "Paused" : "Not authorised"}</strong></div>
        <h2>{agent?.location || "Sabadell"} · ≤ €{(agent?.maxPrice || 350000).toLocaleString("en-US")}</h2>
        <p>{reservation && agent?.active ? "Your agent is automatically paused while you hold another home." : agentEffective ? "Finqit is watching verified listings inside your hard rules." : "Configure exact rules and authorise automatic action when ready."}</p>
        <div className="my-rule-pills">{(agent?.hardRules || []).slice(0,4).map((rule) => <span key={rule}>{rule}</span>)}</div>
        <Link className="card-link" href="/agent">Manage Agent <ArrowRightIcon size={15}/></Link>
      </article>

      <article className="my-status-card saved">
        <div className="my-status-icon"><HeartIcon/></div>
        <div className="my-status-top"><span>Saved homes</span><strong>{totalSaved}</strong></div>
        <h2>{totalSaved ? `${totalSaved} home${totalSaved === 1 ? "" : "s"} on your shortlist` : "Start your shortlist"}</h2>
        <p>{totalSaved ? "Saved homes stay synced across the marketplace in this prototype." : "Tap the heart on any home to keep it here."}</p>
        <Link className="card-link" href="/saved">View shortlist <ArrowRightIcon size={15}/></Link>
      </article>

      <article className="my-status-card community-link">
        <div className="my-status-icon"><UsersIcon/></div>
        <div className="my-status-top"><span>Your community</span><strong>Connected</strong></div>
        <h2>Comunitat Sant Cugat 18</h2>
        <p>3 new AI-summarised emails · 1 vote pending · next meeting Sep 28.</p>
        <Link className="card-link" href="/community">Open community <ArrowRightIcon size={15}/></Link>
      </article>
    </section>

    <section className="my-process">
      <div className="mkt-section-head"><div><span className="mkt-section-label">Buyer journey</span><h2>From match to keys.</h2></div><p>Finqit keeps the high-pressure part structured: access, reservation, visit and decision.</p></div>
      <div className="my-process-track">
        <div className="done"><span><CheckIcon/></span><strong>Ready</strong><small>Identity + payment</small></div>
        <i/>
        <div className={reservation ? "done" : "current"}><span>{reservation ? <CheckIcon/> : "2"}</span><strong>Reserve</strong><small>Fair allocation</small></div>
        <i/>
        <div className={reservation ? "current" : ""}><span>3</span><strong>Visit</strong><small>Exclusive window</small></div>
        <i/>
        <div><span>4</span><strong>Decide</strong><small>Proceed or release</small></div>
        <i/>
        <div><span>5</span><strong>Buy</strong><small>Purchase process</small></div>
      </div>
    </section>

    <section className="my-wallet-row">
      <div><WalletIcon/><div><strong>Payment method ready</strong><span>•••• 4242 · used only after explicit reservation confirmation</span></div></div>
      <Link href="/agent" className="text-button">Manage readiness</Link>
    </section>

    {sellerListings.length > 0 && <section className="my-wallet-row my-seller-row">
      <div><BuildingIcon/><div><strong>Seller workspace</strong><span>{sellerListings.length} listing{sellerListings.length === 1 ? "" : "s"} · {sellerListings.filter((listing) => listing.status === "live").length} live</span></div></div>
      <Link href="/my-listings" className="text-button">Manage listings</Link>
    </section>}

    <section className="mkt-section my-saved-section" id="saved-homes">
      <div className="mkt-section-head"><div><span className="mkt-section-label">Your shortlist</span><h2>Saved homes.</h2></div><Link className="card-link" href="/explore">Explore more <ArrowRightIcon size={16}/></Link></div>
      {totalSaved ? <div className="property-grid">{savedProperties.slice(0,3).map((property) => <PropertyCard key={property.slug} property={property}/>)}{savedProperties.length < 3 && savedSellerListings.slice(0,3-savedProperties.length).map((listing) => <SellerMarketplaceCard key={listing.id} listing={listing}/>)}</div> : <div className="my-empty-saved"><HeartIcon size={28}/><h3>Nothing saved yet</h3><p>Build a shortlist while you explore. Your hearts will appear here automatically.</p><Link className="button button-primary" href="/explore">Find homes</Link></div>}
    </section>
  </div>;
}
