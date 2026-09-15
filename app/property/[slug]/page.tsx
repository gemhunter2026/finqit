import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { properties, formatPrice } from "@/data/properties";
import { AreaIcon, BathIcon, BedIcon, CheckIcon, ClockIcon, HeartIcon, MapPinIcon, ShieldIcon, SparklesIcon } from "@/components/icons";

export async function generateStaticParams() { return properties.map((p) => ({ slug: p.slug })); }

export async function generateMetadata({ params }: { params: Promise<{slug: string}> }) {
  const { slug } = await params;
  const property = properties.find((p) => p.slug === slug);
  return { title: property?.title || "Property" };
}

export default async function PropertyPage({ params }: { params: Promise<{slug: string}> }) {
  const { slug } = await params;
  const property = properties.find((p) => p.slug === slug);
  if (!property) notFound();

  return (
    <div className="page-top page-shell property-page">
      <div className="property-breadcrumb"><Link href="/explore">Explore</Link><span>›</span><span>{property.city}</span><span>›</span><strong>{property.district}</strong></div>
      <section className="property-gallery">
        <div className="gallery-main"><Image src={property.images[0]} alt={property.title} fill priority sizes="(max-width:900px) 100vw, 66vw"/></div>
        <div className="gallery-side"><Image src={property.images[1]} alt="Property interior" fill sizes="33vw"/></div>
        <div className="gallery-side"><Image src={property.images[2]} alt="Property detail" fill sizes="33vw"/></div>
        <button className="gallery-save"><HeartIcon/> Save</button>
      </section>
      <div className="property-detail-layout">
        <section className="property-content">
          <div className="property-heading">
            <div><div className="property-heading-badges"><span className="pill pill-green"><CheckIcon size={14}/> Verified</span>{property.instantReserve && <span className="pill pill-blue"><SparklesIcon size={14}/> Instant Reserve</span>}</div><h1>{property.title}</h1><p><MapPinIcon size={17}/> {property.district}, {property.city}</p></div>
            <strong>{formatPrice(property.price)}</strong>
          </div>
          <div className="property-facts">
            <div><BedIcon/><strong>{property.bedrooms}</strong><span>Bedrooms</span></div>
            <div><BathIcon/><strong>{property.bathrooms}</strong><span>Bathrooms</span></div>
            <div><AreaIcon/><strong>{property.area} m²</strong><span>Built area</span></div>
            <div><span className="compass-icon">↗</span><strong>{property.orientation}</strong><span>Orientation</span></div>
          </div>
          <div className="detail-section"><h2>About this home</h2><p>{property.description}</p><div className="tag-row">{property.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
          <div className="detail-section verified-panel"><div className="verified-panel-icon"><ShieldIcon/></div><div><h2>Transaction-ready listing</h2><p>Seller identity, mandate and key property information are marked as verified for this prototype. Exact legal documentation would be made available before any binding reservation.</p></div></div>
          <div className="detail-section"><h2>Location</h2><div className="property-map"><div className="fake-map-grid"><span className="road r1"/><span className="road r2"/><span className="road r3"/><span className="map-zone z1"/><span className="map-zone z2"/><span className="map-property-pin"><MapPinIcon/></span></div><div><strong>{property.district}</strong><span>{property.city}, Barcelona</span></div></div></div>
        </section>
        <aside className="reservation-card-wrap">
          <div className="reservation-card">
            <div className="reservation-top"><span>Exclusive purchase option</span><strong>{property.instantReserve ? "Available now" : "Request only"}</strong></div>
            <h2>Reserve this home</h2>
            <p>Secure the right to visit and decide before another buyer can take it.</p>
            {property.instantReserve ? <>
              <div className="reservation-price"><span>Reservation amount</span><strong>{formatPrice(property.reservationFee)}</strong></div>
              <div className="reservation-breakdown">
                <div><CheckIcon/><span><strong>{property.visitWindow} exclusive window</strong><small>The seller cannot accept another reservation during this period.</small></span></div>
                <div><CheckIcon/><span><strong>{formatPrice(property.reservationFee - property.optionPremium)} refundable portion</strong><small>If you decline within the agreed visit window.</small></span></div>
                <div><CheckIcon/><span><strong>{formatPrice(property.optionPremium)} option premium</strong><small>Retained if you decline; exact terms shown before payment.</small></span></div>
                <div><CheckIcon/><span><strong>Full amount credited if you proceed</strong><small>Under the standard prototype reservation terms.</small></span></div>
              </div>
              <button className="button button-primary full-width large-button">Instant Reserve</button>
              <button className="button button-secondary full-width">Book a visit instead</button>
              <small className="reservation-legal">Prototype only. No payment is processed and no legal option is created in this demo.</small>
            </> : <><button className="button button-primary full-width">Request viewing</button><small className="reservation-legal">Instant Reserve has not been enabled by this seller.</small></>}
          </div>
          <div className="priority-card"><ClockIcon/><div><strong>Your queue priority is strong</strong><p>You currently have no active reservation. Eligible buyers without an active reservation are prioritised first.</p></div></div>
        </aside>
      </div>
    </div>
  );
}
