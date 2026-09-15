"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRightIcon, HeartIcon } from "@/components/icons";
import { PropertyCard } from "@/components/PropertyCard";
import { SellerMarketplaceCard } from "@/components/SellerMarketplaceCard";
import { properties } from "@/data/properties";
import { FINQIT_STATE_EVENT, type SellerListing, getSavedHomes, getSellerListings } from "@/lib/demo-state";

export function SavedHomesClient() {
  const [saved, setSaved] = useState<string[]>([]);
  const [sellerListings, setSellerListings] = useState<SellerListing[]>([]);

  useEffect(() => {
    const sync = () => {
      setSaved(getSavedHomes());
      setSellerListings(getSellerListings());
    };
    sync();
    window.addEventListener(FINQIT_STATE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(FINQIT_STATE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const homes = useMemo(() => properties.filter((property) => saved.includes(property.slug)), [saved]);
  const sellerHomes = useMemo(() => sellerListings.filter((listing) => listing.status === "live" && saved.includes(`seller-listing:${listing.id}`)), [saved, sellerListings]);
  const total = homes.length + sellerHomes.length;

  return <div className="saved-page">
    <div className="mkt-section-head saved-page-head">
      <div><span className="mkt-section-label">Shortlist</span><h1>Saved homes.</h1><p>Keep the properties worth comparing in one place. Saved homes stay synced across Finqit in this prototype.</p></div>
      <Link className="button button-secondary" href="/explore">Explore homes <ArrowRightIcon size={16}/></Link>
    </div>
    {total ? <>
      <div className="saved-count"><HeartIcon size={16} fill="currentColor"/><strong>{total}</strong> saved {total === 1 ? "home" : "homes"}</div>
      <div className="property-grid">
        {homes.map((property) => <PropertyCard key={property.slug} property={property}/>)}
        {sellerHomes.map((listing) => <SellerMarketplaceCard key={listing.id} listing={listing}/>)}
      </div>
    </> : <div className="my-empty-saved saved-empty-large"><HeartIcon size={34}/><h3>Your shortlist is empty</h3><p>Tap the heart on a home while exploring and it will appear here automatically.</p><Link className="button button-primary" href="/explore">Explore Instant Reserve homes</Link></div>}
  </div>;
}
