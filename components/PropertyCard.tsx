"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Property } from "@/data/properties";
import { formatPrice } from "@/data/properties";
import { AreaIcon, BedIcon, HeartIcon, MapPinIcon, SparklesIcon } from "@/components/icons";

export function PropertyCard({ property }: { property: Property }) {
  const [saved, setSaved] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  const move = (direction: number) => {
    setImageIndex((current) => (current + direction + property.images.length) % property.images.length);
  };

  return (
    <article className="property-card">
      <div className="property-card-image-wrap">
        <Link href={`/property/${property.slug}`} aria-label={`View ${property.title}`}>
          <Image className="property-card-image" src={property.images[imageIndex]} alt={property.title} width={720} height={580} sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw" />
        </Link>
        <div className="property-badges">
          {property.instantReserve && <span className="pill pill-white"><span className="status-dot" /> Instant Reserve</span>}
          {property.match >= 90 && <span className="pill pill-blue"><SparklesIcon size={15}/> {property.match}% match</span>}
        </div>
        <button type="button" className="property-gallery-arrow left" onClick={() => move(-1)} aria-label="Previous photo">‹</button>
        <button type="button" className="property-gallery-arrow right" onClick={() => move(1)} aria-label="Next photo">›</button>
        <div className="property-card-dots" aria-hidden="true">{property.images.map((_, index) => <span key={index} className={index === imageIndex ? "active" : ""}/>)}</div>
        <button type="button" className={`save-button ${saved ? "saved" : ""}`} onClick={() => setSaved(!saved)} aria-label={saved ? "Remove from saved" : "Save property"}>
          <HeartIcon size={20} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="property-card-body">
        <div className="property-card-title-row">
          <div>
            <p className="property-location"><MapPinIcon size={15}/>{property.district}, {property.city}</p>
            <h3><Link href={`/property/${property.slug}`}>{property.title}</Link></h3>
          </div>
          <strong>{formatPrice(property.price)}</strong>
        </div>
        <div className="property-meta">
          <span><BedIcon size={17}/>{property.bedrooms} beds</span>
          <span><AreaIcon size={17}/>{property.area} m²</span>
          <span>{property.orientation}</span>
        </div>
        <div className="property-card-footer">
          <span className="verified-label">✓ Verified listing</span>
          <Link href={`/property/${property.slug}`} className="card-link">View home →</Link>
        </div>
      </div>
    </article>
  );
}
