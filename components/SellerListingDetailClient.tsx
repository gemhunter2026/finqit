"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AreaIcon, BedIcon, BuildingIcon, CheckIcon, MapPinIcon, ShieldIcon, SparklesIcon } from "@/components/icons";
import { ReservationFlow } from "@/components/ReservationFlow";
import { SaveHomeButton } from "@/components/SaveHomeButton";
import { formatPrice } from "@/data/properties";
import { FINQIT_STATE_EVENT, type SellerListing, getSellerListings } from "@/lib/demo-state";

const images = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=88",
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85"
];

export function SellerListingDetailClient({ id }: { id: string }) {
  const [listing, setListing] = useState<SellerListing | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const sync = () => {
      setListing(getSellerListings().find((item) => item.id === id) || null);
      setLoaded(true);
    };
    sync();
    window.addEventListener(FINQIT_STATE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(FINQIT_STATE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [id]);

  if (!loaded) return <div className="seller-live-loading">Loading listing…</div>;
  if (!listing) return <div className="seller-live-missing"><BuildingIcon size={32}/><h1>Listing not found</h1><p>This demo listing exists only in the browser where it was created.</p><Link className="button button-primary" href="/explore">Back to marketplace</Link></div>;
  if (listing.status !== "live") return <div className="seller-live-missing"><ShieldIcon size={32}/><h1>This listing is not live yet</h1><p>{listing.address} is currently <strong>{listing.status}</strong>. Seller-side verification and publication happen before buyers can reserve it.</p><Link className="button button-primary" href="/my-listings">Open My Listings</Link></div>;

  return <div className="seller-live-detail">
    <div className="property-breadcrumb"><Link href="/explore">Marketplace</Link><span>›</span><span>{listing.city}</span><span>›</span><strong>Seller listing</strong></div>
    <section className="property-gallery">
      <div className="gallery-main"><Image src={images[0]} alt={listing.address} fill priority sizes="(max-width:900px) 100vw, 66vw"/></div>
      <div className="gallery-side"><Image src={images[1]} alt="Property interior" fill sizes="33vw"/></div>
      <div className="gallery-side"><Image src={images[2]} alt="Property detail" fill sizes="33vw"/></div>
      <SaveHomeButton slug={`seller-listing:${listing.id}`}/>
    </section>

    <div className="property-detail-layout">
      <section className="property-content">
        <div className="property-heading"><div><div className="property-heading-badges"><span className="pill pill-green"><CheckIcon size={14}/> Verified</span>{listing.instantReserve && <span className="pill pill-blue"><SparklesIcon size={14}/> Instant Reserve</span>}</div><h1>{listing.address}</h1><p><MapPinIcon size={17}/> {listing.city}</p></div><strong>{formatPrice(listing.price)}</strong></div>
        <div className="property-facts seller-live-facts">
          <div><BedIcon/><strong>{listing.bedrooms}</strong><span>Bedrooms</span></div>
          <div><AreaIcon/><strong>{listing.area} m²</strong><span>Built area</span></div>
          <div><BuildingIcon/><strong>{listing.sellerType === "agency" ? "Agency" : "Owner"}</strong><span>{listing.agency}</span></div>
          <div><ShieldIcon/><strong>Verified</strong><span>Seller authority</span></div>
        </div>

        <div className="detail-section"><h2>About this listing</h2><p>This home was created through the Finqit seller workflow in this browser. The prototype demonstrates the complete lifecycle from seller submission to verification, marketplace publication and buyer reservation.</p></div>
        <div className="detail-section verified-panel"><div className="verified-panel-icon"><ShieldIcon/></div><div><h2>Verification gate completed in demo</h2><p>This listing only became visible after moving through the seller inventory from Pending to Verified to Live. In production those transitions would be controlled by real document, identity and authority checks.</p></div></div>
        {listing.instantReserve && <div className="detail-section"><h2>Reservation economics</h2><div className="terms-preview"><div><span>Total reservation payment</span><strong>{formatPrice(listing.reservationFee)}</strong></div><div><span>Refundable portion</span><strong>{formatPrice(Math.max(0, listing.reservationFee - listing.optionPremium))}</strong></div><div><span>Exclusivity premium</span><strong>{formatPrice(listing.optionPremium)}</strong></div><div><span>Decision window</span><strong>{listing.windowHours} hours</strong></div></div></div>}
      </section>

      <aside className="reservation-card-wrap">
        <div className="reservation-card">
          <div className="reservation-top"><span>Seller-published listing</span><strong>{listing.instantReserve ? "Available now" : "Viewing only"}</strong></div>
          <h2>{listing.instantReserve ? "Reserve this home" : "Request a viewing"}</h2>
          <p>{listing.instantReserve ? "This demo listing passed the seller-side verification gate and can now enter the same buyer reservation flow." : "Instant Reserve was not enabled by this seller."}</p>
          {listing.instantReserve ? <ReservationFlow propertySlug={`seller-listing:${listing.id}`} price={listing.price} reservationFee={listing.reservationFee} optionPremium={listing.optionPremium} visitWindow={`${listing.windowHours} hours`} propertyTitle={listing.address}/> : <button className="button button-primary full-width">Request viewing</button>}
        </div>
      </aside>
    </div>
  </div>;
}
