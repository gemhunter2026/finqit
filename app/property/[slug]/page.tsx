import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { properties, formatPrice } from "@/data/properties";
import { ReservationFlow } from "@/components/ReservationFlow";
import { AreaIcon, BathIcon, BedIcon, CheckIcon, HeartIcon, MapPinIcon, ShieldIcon, SparklesIcon } from "@/components/icons";

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
    <div className="page-top mkt-shell property-page">
      <div className="property-breadcrumb"><Link href="/explore">Marketplace</Link><span>›</span><span>{property.city}</span><span>›</span><strong>{property.district}</strong></div>

      <section className="property-gallery">
        <div className="gallery-main"><Image src={property.images[0]} alt={property.title} fill priority sizes="(max-width:900px) 100vw, 66vw"/></div>
        <div className="gallery-side"><Image src={property.images[1]} alt="Property interior" fill sizes="33vw"/></div>
        <div className="gallery-side"><Image src={property.images[2]} alt="Property detail" fill sizes="33vw"/></div>
        <button className="gallery-save"><HeartIcon/> Save</button>
      </section>

      <div className="property-detail-layout">
        <section className="property-content">
          <div className="property-heading">
            <div>
              <div className="property-heading-badges"><span className="pill pill-green"><CheckIcon size={14}/> Verified</span>{property.instantReserve && <span className="pill pill-blue"><SparklesIcon size={14}/> Instant Reserve</span>}</div>
              <h1>{property.title}</h1>
              <p><MapPinIcon size={17}/> {property.district}, {property.city}</p>
            </div>
            <strong>{formatPrice(property.price)}</strong>
          </div>

          <div className="property-facts">
            <div><BedIcon/><strong>{property.bedrooms}</strong><span>Bedrooms</span></div>
            <div><BathIcon/><strong>{property.bathrooms}</strong><span>Bathrooms</span></div>
            <div><AreaIcon/><strong>{property.area} m²</strong><span>Built area</span></div>
            <div><span className="compass-icon">↗</span><strong>{property.orientation}</strong><span>Orientation</span></div>
          </div>

          <div className="detail-section"><h2>About this home</h2><p>{property.description}</p><div className="tag-row">{property.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div>

          <div className="detail-section verified-panel">
            <div className="verified-panel-icon"><ShieldIcon/></div>
            <div><h2>Transaction-ready before reservation</h2><p>Finqit&apos;s production flow is designed so the seller/agency authority, the advertised price, the property information and the reservation conditions are prepared before a listing receives the Instant Reserve badge. The buyer receives the information in a durable format before payment.</p></div>
          </div>

          <div className="detail-section">
            <h2>What Instant Reserve means</h2>
            <div className="steps-grid">
              <article><span>1</span><h3>Same rules for eligible buyers</h3><p>The queue applies published eligibility rules and only one active reservation per buyer.</p></article>
              <article><span>2</span><h3>Short exclusive decision window</h3><p>The intended agreement locks the seller for {property.visitWindow} while you arrange the visit and decide.</p></article>
              <article><span>3</span><h3>Clear money outcome</h3><p>The premium and refundable portion are shown separately, including what happens if you proceed, decline or the seller breaches.</p></article>
            </div>
          </div>

          <div className="detail-section"><h2>Location</h2><div className="property-map"><div className="fake-map-grid"><span className="road r1"/><span className="road r2"/><span className="road r3"/><span className="map-zone z1"/><span className="map-zone z2"/><span className="map-property-pin"><MapPinIcon/></span></div><div><strong>{property.district}</strong><span>{property.city}, Barcelona</span></div></div></div>
        </section>

        <aside className="reservation-card-wrap">
          <div className="reservation-card">
            <div className="reservation-top"><span>Exclusive reservation</span><strong>{property.instantReserve ? "Available now" : "Request only"}</strong></div>
            <h2>{property.instantReserve ? "Reserve this home" : "Request a viewing"}</h2>
            <p>{property.instantReserve ? "Secure your decision window before another eligible buyer takes the next slot." : "This seller has not enabled the standard instant reservation agreement yet."}</p>
            {property.instantReserve ? <ReservationFlow price={property.price} reservationFee={property.reservationFee} optionPremium={property.optionPremium} visitWindow={property.visitWindow} propertyTitle={property.title}/> : <><button className="button button-primary full-width">Request viewing</button><small className="reservation-legal">No reservation payment is requested for this listing.</small></>}
          </div>
          <div className="priority-card"><ShieldIcon/><div><strong>Fair-access rule</strong><p>A buyer can hold only one active Finqit reservation. Once a reservation is obtained, the buyer leaves the eligible queue until that reservation ends.</p></div></div>
        </aside>
      </div>
    </div>
  );
}
