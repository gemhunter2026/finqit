"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BuildingIcon, CheckIcon, ShieldIcon, SparklesIcon } from "@/components/icons";
import { type SellerListing, addSellerListing } from "@/lib/demo-state";

const steps = ["Property", "Authority", "Reservation", "Review"] as const;

export function ListingWizard() {
  const [step, setStep] = useState(0);
  const [published, setPublished] = useState(false);
  const [createdListing, setCreatedListing] = useState<SellerListing | null>(null);
  const [instantReserve, setInstantReserve] = useState(true);
  const [form, setForm] = useState({
    address: "Carrer de Prat de la Riba 118",
    city: "Sabadell",
    price: "329000",
    bedrooms: "3",
    area: "104",
    sellerType: "agency",
    agency: "Nova Habitat",
    reservation: "1000",
    premium: "120",
    window: "72"
  });

  const set = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const refundable = useMemo(() => Math.max(0, Number(form.reservation || 0) - Number(form.premium || 0)), [form.reservation, form.premium]);
  const money = (value: string | number) => new Intl.NumberFormat("es-ES", {style:"currency",currency:"EUR",maximumFractionDigits:0}).format(Number(value || 0));

  const submitListing = () => {
    const listing = addSellerListing({
      address: form.address.trim(),
      city: form.city.trim(),
      price: Number(form.price || 0),
      bedrooms: Number(form.bedrooms || 0),
      area: Number(form.area || 0),
      sellerType: form.sellerType === "owner" ? "owner" : "agency",
      agency: form.sellerType === "agency" ? form.agency.trim() : "Private owner",
      instantReserve,
      reservationFee: instantReserve ? Number(form.reservation || 0) : 0,
      optionPremium: instantReserve ? Number(form.premium || 0) : 0,
      windowHours: instantReserve ? Number(form.window || 72) : 0
    });
    setCreatedListing(listing);
    setPublished(true);
  };

  if (published && createdListing) {
    return <div className="listing-card listing-success-card">
      <div className="reserve-success-icon">✓</div>
      <div className="mkt-section-label">Submitted for verification</div>
      <h2>Your property is now in your Finqit inventory.</h2>
      <p>It is intentionally <strong>not live yet</strong>. Finqit first verifies the seller/agency authority and transaction information before the listing can receive the Instant Reserve badge.</p>
      <div className="terms-preview" style={{textAlign:"left"}}>
        <div><span>Listing ID</span><strong>{createdListing.id}</strong></div>
        <div><span>Property</span><strong>{form.address}, {form.city}</strong></div>
        <div><span>Price</span><strong>{money(form.price)}</strong></div>
        <div><span>Reservation mode</span><strong>{instantReserve ? "Instant Reserve requested" : "Viewing requests only"}</strong></div>
        <div><span>Status</span><strong className="seller-status-pending">Pending verification</strong></div>
      </div>
      <div className="listing-success-actions">
        <Link className="button button-primary" href="/my-listings">View My Listings</Link>
        <button className="button button-secondary" onClick={() => { setPublished(false); setCreatedListing(null); setStep(0); }}>Create another listing</button>
      </div>
    </div>;
  }

  return <div className="listing-wizard">
    <aside className="listing-sidebar" aria-label="Listing steps">
      {steps.map((label, index) => <div key={label} className={`listing-step ${index === step ? "active" : ""} ${index < step ? "done" : ""}`}><span>{index < step ? "✓" : index + 1}</span>{label}</div>)}
    </aside>

    <section className="listing-card">
      {step === 0 && <>
        <div className="mkt-section-label"><BuildingIcon size={14}/> Property details</div>
        <h2>Start with a transaction-ready listing.</h2>
        <p>The marketplace should feel as easy as listing on a consumer platform, while collecting enough structured information to support a real reservation later.</p>
        <div className="listing-grid">
          <div className="listing-field full"><label>Property address</label><input value={form.address} onChange={(e) => set("address", e.target.value)}/></div>
          <div className="listing-field"><label>City</label><input value={form.city} onChange={(e) => set("city", e.target.value)}/></div>
          <div className="listing-field"><label>Asking price (€)</label><input inputMode="numeric" value={form.price} onChange={(e) => set("price", e.target.value)}/></div>
          <div className="listing-field"><label>Bedrooms</label><input inputMode="numeric" value={form.bedrooms} onChange={(e) => set("bedrooms", e.target.value)}/></div>
          <div className="listing-field"><label>Built area (m²)</label><input inputMode="numeric" value={form.area} onChange={(e) => set("area", e.target.value)}/></div>
          <button type="button" className="listing-uploader"><strong>＋ Add photos</strong><br/><small>Drag & drop or browse · prototype uploader</small></button>
        </div>
      </>}

      {step === 1 && <>
        <div className="mkt-section-label"><ShieldIcon size={14}/> Seller authority</div>
        <h2>Who has the right to list this home?</h2>
        <p>Instant Reserve should never activate until Finqit has a documented basis showing that the seller or agency has authority to offer the property under the displayed terms.</p>
        <div className="listing-grid">
          <div className="listing-field full"><label>Listing as</label><select value={form.sellerType} onChange={(e) => set("sellerType", e.target.value)}><option value="agency">Real-estate agency</option><option value="owner">Private owner</option></select></div>
          {form.sellerType === "agency" && <div className="listing-field full"><label>Agency name</label><input value={form.agency} onChange={(e) => set("agency", e.target.value)}/></div>}
          <button type="button" className="listing-uploader"><strong>＋ Upload mandate / ownership evidence</strong><br/><small>PDF or image · encrypted storage in production</small></button>
          <label className="reserve-check listing-field full"><input type="checkbox" defaultChecked/><span><strong>I confirm I am authorised to market this property</strong><small>Production onboarding would verify identity, authority and the information required for the applicable jurisdiction before activation.</small></span></label>
        </div>
      </>}

      {step === 2 && <>
        <div className="mkt-section-label"><SparklesIcon size={14}/> Reservation rules</div>
        <h2>Choose how buyers can secure the home.</h2>
        <p>This is the core Finqit differentiator. Agencies can keep ordinary viewing requests or opt into a standard short exclusive reservation workflow.</p>
        <label className="reserve-check" style={{marginBottom:16}}><input type="checkbox" checked={instantReserve} onChange={(e) => setInstantReserve(e.target.checked)}/><span><strong>Enable Instant Reserve</strong><small>Eligible buyers can accept the pre-agreed reservation conditions and initiate payment without waiting for a manual agency callback.</small></span></label>
        {instantReserve && <div className="listing-grid">
          <div className="listing-field"><label>Total reservation payment (€)</label><input inputMode="numeric" value={form.reservation} onChange={(e) => set("reservation", e.target.value)}/></div>
          <div className="listing-field"><label>Exclusivity / option premium (€)</label><input inputMode="numeric" value={form.premium} onChange={(e) => set("premium", e.target.value)}/></div>
          <div className="listing-field"><label>Decision window (hours)</label><select value={form.window} onChange={(e) => set("window", e.target.value)}><option>24</option><option>48</option><option>72</option><option>96</option></select></div>
          <div className="listing-field"><label>Refundable portion</label><input readOnly value={money(refundable)}/></div>
          <div className="listing-field full"><div className="terms-preview"><div><span>If buyer proceeds</span><strong>{money(form.reservation)} can be credited to purchase*</strong></div><div><span>If buyer declines in window</span><strong>{money(refundable)} returned · {money(form.premium)} retained*</strong></div><div><span>If seller breaches exclusivity</span><strong>Full refund + contractual remedy*</strong></div></div></div>
          <small className="listing-field full reservation-legal">*Product model only. Final amounts, terminology, seller remedy and contract language must be set by Spanish counsel and adapted where regional law requires it.</small>
        </div>}
      </>}

      {step === 3 && <>
        <div className="mkt-section-label"><CheckIcon size={14}/> Final review</div>
        <h2>Ready for Finqit verification.</h2>
        <p>Nothing is publicly marked “Instant Reserve” until verification is complete. This review makes the economic terms explicit before the listing enters the marketplace.</p>
        <div className="terms-preview">
          <div><span>Home</span><strong>{form.address}, {form.city}</strong></div>
          <div><span>Price</span><strong>{money(form.price)}</strong></div>
          <div><span>Seller</span><strong>{form.sellerType === "agency" ? form.agency : "Private owner"}</strong></div>
          <div><span>Reservation mode</span><strong>{instantReserve ? `Instant · ${form.window}h` : "Viewing requests only"}</strong></div>
          {instantReserve && <><div><span>Reservation payment</span><strong>{money(form.reservation)}</strong></div><div><span>Refundable / premium</span><strong>{money(refundable)} / {money(form.premium)}</strong></div></>}
        </div>
        <label className="reserve-check"><input type="checkbox" defaultChecked/><span><strong>Submit for verification</strong><small>I understand the listing remains pending until Finqit completes the production verification workflow.</small></span></label>
      </>}

      <div className="listing-actions">
        <button className="button button-secondary" disabled={step === 0} onClick={() => setStep((current) => Math.max(0, current - 1))} style={step === 0 ? {visibility:"hidden"} : undefined}>Back</button>
        {step < steps.length - 1 ? <button className="button button-primary" onClick={() => setStep((current) => Math.min(steps.length - 1, current + 1))}>Continue</button> : <button className="button button-primary" onClick={submitListing}>Submit listing</button>}
      </div>
    </section>
  </div>;
}
