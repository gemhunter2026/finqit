import type { Metadata } from "next";
import { ListingWizard } from "@/components/ListingWizard";
import { BuildingIcon, CheckIcon, ShieldIcon, SparklesIcon } from "@/components/icons";

export const metadata: Metadata = { title: "List a property" };

export default function ListPropertyPage() {
  return <div className="page-top mkt-shell seller-page">
    <section className="seller-hero">
      <div>
        <div className="mkt-section-label">For agencies & verified sellers</div>
        <h1>List once.<br/><span>Let qualified buyers act.</span></h1>
        <p>Turn a property into a transaction-ready opportunity: structured information, seller authority, clear reservation rules and a fair queue instead of dozens of overlapping calls.</p>
        <div className="mkt-hero-trust"><span><CheckIcon size={14}/> Seller authority check</span><span><CheckIcon size={14}/> Buyer reservation terms</span><span><CheckIcon size={14}/> One active reservation</span></div>
      </div>
      <div className="seller-hero-panel">
        <div className="seller-panel-top"><span className="dashboard-icon blue"><BuildingIcon/></span><span className="pill pill-green">Instant Reserve ready</span></div>
        <h3>Carrer de Prat de la Riba · Sabadell</h3>
        <div className="seller-status-list"><span><CheckIcon/> Seller / agency authority</span><span><CheckIcon/> Required property info</span><span><CheckIcon/> Reservation economics</span><span><CheckIcon/> Published queue rules</span></div>
        <div className="seller-reservation"><div><small>Next eligible buyer</small><strong>Identity ready · no active reservation</strong></div><span>Queue #1</span></div>
      </div>
    </section>

    <section style={{paddingTop:28}}>
      <div className="mkt-section-head"><div><div className="mkt-section-label">Create listing</div><h2>Publish a home in four steps.</h2></div><p>This wizard is interactive. It separates the ordinary property data from the authority check and the optional Instant Reserve agreement.</p></div>
      <ListingWizard/>
    </section>

    <section className="section seller-benefits">
      <div className="section-heading centered-heading"><div className="eyebrow">Why agencies would use it</div><h2>Turn frantic demand into an orderly process.</h2></div>
      <div className="benefit-grid"><article><ShieldIcon/><h3>Verified before exposure</h3><p>Collect the mandate and key property information before Instant Reserve is activated.</p></article><article><SparklesIcon/><h3>Qualified matching</h3><p>Buyer agents surface people whose hard requirements actually fit the property.</p></article><article><BuildingIcon/><h3>One reservation at a time</h3><p>Reduce no-shows and overlapping promises while keeping access transparent.</p></article></div>
    </section>
  </div>;
}
