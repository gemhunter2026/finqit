"use client";

import { useMemo, useState } from "react";
import { PropertyCard } from "@/components/PropertyCard";
import { properties } from "@/data/properties";
import { CheckIcon, MapPinIcon, SearchIcon, SlidersIcon, SparklesIcon } from "@/components/icons";

const filters = ["Instant Reserve", "≤ €350k", "3+ beds", "South-facing", "Terrace"];

export function ExploreClient() {
  const [selected, setSelected] = useState<string[]>(["Instant Reserve"]);
  const [query, setQuery] = useState("Sabadell");
  const [mapView, setMapView] = useState(false);

  const shown = useMemo(() => properties.filter((p) => {
    if (query.trim() && !`${p.city} ${p.district}`.toLowerCase().includes(query.toLowerCase())) return false;
    if (selected.includes("Instant Reserve") && !p.instantReserve) return false;
    if (selected.includes("≤ €350k") && p.price > 350000) return false;
    if (selected.includes("3+ beds") && p.bedrooms < 3) return false;
    if (selected.includes("South-facing") && !p.orientation.toLowerCase().includes("south")) return false;
    if (selected.includes("Terrace") && !p.terrace) return false;
    return true;
  }), [query, selected]);

  const toggle = (filter: string) => setSelected((s) => s.includes(filter) ? s.filter((x) => x !== filter) : [...s, filter]);

  return (
    <div className="explore-layout page-shell">
      <section className="explore-main">
        <div className="explore-title-row">
          <div><div className="eyebrow">Marketplace</div><h1>Homes ready to move on.</h1><p>Verified listings with clear reservation rules and fair access.</p></div>
          <div className="view-switch"><button className={!mapView ? "active" : ""} onClick={() => setMapView(false)}>Grid</button><button className={mapView ? "active" : ""} onClick={() => setMapView(true)}>Map</button></div>
        </div>
        <div className="explore-search-row">
          <label className="explore-search"><SearchIcon/><input value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search location"/><span><MapPinIcon size={16}/> Spain</span></label>
          <button className="button button-secondary"><SlidersIcon size={18}/> All filters</button>
        </div>
        <div className="chip-list explore-chips">{filters.map((filter) => <button key={filter} onClick={() => toggle(filter)} className={selected.includes(filter) ? "filter-chip selected" : "filter-chip"}>{selected.includes(filter) && <CheckIcon size={14}/>} {filter}</button>)}</div>
        <div className="result-summary"><strong>{shown.length} homes</strong><span>Sorted by best match</span></div>
        {shown.length ? <div className={`property-grid ${mapView ? "map-grid" : ""}`}>{shown.map((property) => <PropertyCard key={property.slug} property={property}/>)}</div> : <div className="empty-state"><SparklesIcon size={28}/><h3>No exact matches yet.</h3><p>Your smart agent can keep watching and act when one appears.</p><button onClick={() => setSelected(["Instant Reserve"])} className="button button-primary">Relax filters</button></div>}
      </section>
      <aside className="explore-sidebar">
        <div className="map-card">
          <div className="fake-map-grid" aria-hidden="true">
            <span className="road r1"/><span className="road r2"/><span className="road r3"/><span className="road r4"/>
            <span className="map-zone z1"/><span className="map-zone z2"/><span className="map-zone z3"/>
            <button className="map-price p1">€329k</button><button className="map-price p2">€295k</button><button className="map-price p3">€348k</button>
          </div>
          <div className="map-label"><MapPinIcon size={16}/> Sabadell · 6 opportunities</div>
        </div>
        <div className="sidebar-agent-card">
          <div className="eyebrow"><SparklesIcon size={15}/> Smart Agent</div>
          <h3>Be first without being online first.</h3>
          <p>Your agent checks eligible new listings against exact rules and your current queue priority.</p>
          <div className="mini-rule"><span>Sabadell · 3+ beds · South</span><strong>98% best match</strong></div>
          <a className="button button-primary full-width" href="/agent">Configure agent</a>
        </div>
      </aside>
    </div>
  );
}
