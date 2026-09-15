"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BuildingIcon, CheckIcon, ClockIcon, PlusIcon, ShieldIcon, SparklesIcon } from "@/components/icons";
import { FINQIT_STATE_EVENT, type SellerListing, getSellerListings, updateSellerListingStatus } from "@/lib/demo-state";
import { formatPrice } from "@/data/properties";

const statusCopy = {
  pending: { label: "Pending verification", icon: ClockIcon },
  verified: { label: "Verified · not live", icon: ShieldIcon },
  live: { label: "Live in marketplace", icon: CheckIcon }
} as const;

export function SellerListingsClient() {
  const [listings, setListings] = useState<SellerListing[]>([]);

  const sync = () => setListings(getSellerListings());

  useEffect(() => {
    sync();
    window.addEventListener(FINQIT_STATE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(FINQIT_STATE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const advance = (listing: SellerListing) => {
    const next = listing.status === "pending" ? "verified" : listing.status === "verified" ? "live" : "verified";
    setListings(updateSellerListingStatus(listing.id, next));
  };

  return <div className="seller-inventory-page">
    <section className="seller-inventory-hero">
      <div><div className="eyebrow"><BuildingIcon size={15}/> Seller workspace</div><h1>My Listings.</h1><p>Track verification, reservation readiness and marketplace status without mixing seller operations into the buyer experience.</p></div>
      <Link className="button button-primary" href="/list-property"><PlusIcon size={17}/> Add property</Link>
    </section>

    <div className="seller-inventory-summary">
      <div><strong>{listings.length}</strong><span>Total listings</span></div>
      <div><strong>{listings.filter((item) => item.status === "pending").length}</strong><span>Pending verification</span></div>
      <div><strong>{listings.filter((item) => item.status === "live").length}</strong><span>Live</span></div>
      <div><strong>{listings.filter((item) => item.instantReserve).length}</strong><span>Instant Reserve requested</span></div>
    </div>

    {listings.length ? <div className="seller-inventory-list">
      {listings.map((listing) => {
        const StatusIcon = statusCopy[listing.status].icon;
        return <article className="seller-listing-row" key={listing.id}>
          <div className="seller-listing-thumb"><BuildingIcon size={28}/></div>
          <div className="seller-listing-main">
            <div className="seller-listing-title"><div><small>{listing.id}</small><h2>{listing.address}</h2><p>{listing.city} · {listing.bedrooms} bedrooms · {listing.area} m²</p></div><strong>{formatPrice(listing.price)}</strong></div>
            <div className="seller-listing-meta">
              <span className={`seller-status seller-status-${listing.status}`}><StatusIcon size={14}/>{statusCopy[listing.status].label}</span>
              {listing.instantReserve && <span><SparklesIcon size={14}/> Instant Reserve · {listing.windowHours}h · {formatPrice(listing.reservationFee)}</span>}
              <span>{listing.sellerType === "agency" ? listing.agency : "Private owner"}</span>
            </div>
          </div>
          <div className="seller-listing-actions">
            {listing.status === "pending" && <button type="button" className="button button-secondary" onClick={() => advance(listing)}>Simulate verification</button>}
            {listing.status === "verified" && <button type="button" className="button button-primary" onClick={() => advance(listing)}>Publish live</button>}
            {listing.status === "live" && <><Link className="button button-primary" href={`/seller-listing/${listing.id}`}>View live listing</Link><button type="button" className="text-button" onClick={() => advance(listing)}>Pause listing</button></>}
          </div>
        </article>;
      })}
    </div> : <div className="seller-inventory-empty"><BuildingIcon size={32}/><h2>No listings yet</h2><p>Create a property listing, define the reservation model and submit it for verification.</p><Link className="button button-primary" href="/list-property">List your first property</Link></div>}

    <div className="seller-demo-note"><ShieldIcon size={18}/><p><strong>Prototype workflow:</strong> the verification buttons intentionally simulate internal review. A production version would require real identity, authority and property-document checks before a listing could become reservable.</p></div>
  </div>;
}
