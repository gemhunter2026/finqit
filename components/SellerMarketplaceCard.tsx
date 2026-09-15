"use client";

import Image from "next/image";
import Link from "next/link";
import { AreaIcon, BedIcon, MapPinIcon, SparklesIcon } from "@/components/icons";
import { SaveHomeButton } from "@/components/SaveHomeButton";
import { formatPrice } from "@/data/properties";
import type { SellerListing } from "@/lib/demo-state";

const demoImage = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85";

export function SellerMarketplaceCard({ listing }: { listing: SellerListing }) {
  return <article className="property-card seller-market-card">
    <div className="property-card-image-wrap">
      <Link href={`/seller-listing/${listing.id}`} aria-label={`View ${listing.address}`}>
        <Image className="property-card-image" src={demoImage} alt={listing.address} width={720} height={580} sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw"/>
      </Link>
      <div className="property-badges">
        <span className="pill pill-white">✓ Verified seller listing</span>
        {listing.instantReserve && <span className="pill pill-blue"><SparklesIcon size={15}/> Instant Reserve</span>}
      </div>
      <SaveHomeButton slug={`seller-listing:${listing.id}`} compact/>
    </div>
    <div className="property-card-body">
      <div className="property-card-title-row">
        <div><p className="property-location"><MapPinIcon size={15}/>{listing.city}</p><h3><Link href={`/seller-listing/${listing.id}`}>{listing.address}</Link></h3></div>
        <strong>{formatPrice(listing.price)}</strong>
      </div>
      <div className="property-meta"><span><BedIcon size={17}/>{listing.bedrooms} beds</span><span><AreaIcon size={17}/>{listing.area} m²</span><span>{listing.sellerType === "agency" ? listing.agency : "Private owner"}</span></div>
      <div className="property-card-footer"><span className="verified-label">✓ Live after verification</span><Link className="card-link" href={`/seller-listing/${listing.id}`}>View home →</Link></div>
    </div>
  </article>;
}
