"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { PropertyCard } from "@/components/PropertyCard";
import { SellerMarketplaceCard } from "@/components/SellerMarketplaceCard";
import { properties } from "@/data/properties";
import { CheckIcon, MapPinIcon, SearchIcon, SlidersIcon, SparklesIcon } from "@/components/icons";
import { FINQIT_STATE_EVENT, type AgentConfig, type SellerListing, getActiveReservation, getAgentConfig, getSellerListings, saveAgentConfig } from "@/lib/demo-state";

const quickFilters = [
  { id: "instant", label: "Instant Reserve" },
  { id: "under350", label: "Under €350k" },
  { id: "beds3", label: "3+ bedrooms" },
  { id: "south", label: "South-facing" },
  { id: "terrace", label: "Terrace" }
] as const;

type FilterId = (typeof quickFilters)[number]["id"];
type SortId = "match" | "price-low" | "price-high";

type ResultItem =
  | { kind: "catalog"; key: string; price: number; match: number; href: string; property: (typeof properties)[number] }
  | { kind: "seller"; key: string; price: number; match: number; href: string; listing: SellerListing };

export function ExploreClient() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "Sabadell";
  const initialBudget = Number(searchParams.get("budget") || 0);
  const initialBeds = Number(searchParams.get("beds") || 0);

  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<FilterId[]>(["instant"]);
  const [sort, setSort] = useState<SortId>("match");
  const [mapVisible, setMapVisible] = useState(true);
  const [sellerListings, setSellerListings] = useState<SellerListing[]>([]);
  const [agent, setAgent] = useState<AgentConfig | null>(null);
  const [reservationActive, setReservationActive] = useState(false);
  const [agentSaved, setAgentSaved] = useState(false);

  useEffect(() => {
    const sync = () => {
      setSellerListings(getSellerListings());
      setAgent(getAgentConfig());
      setReservationActive(Boolean(getActiveReservation()));
    };
    sync();
    window.addEventListener(FINQIT_STATE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(FINQIT_STATE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const results = useMemo<ResultItem[]>(() => {
    const catalog = properties.filter((property) => {
      const haystack = `${property.city} ${property.district} ${property.title}`.toLowerCase();
      if (query.trim() && !haystack.includes(query.trim().toLowerCase())) return false;
      if (initialBudget && property.price > initialBudget * 1000) return false;
      if (initialBeds && property.bedrooms < initialBeds) return false;
      if (filters.includes("instant") && !property.instantReserve) return false;
      if (filters.includes("under350") && property.price > 350000) return false;
      if (filters.includes("beds3") && property.bedrooms < 3) return false;
      if (filters.includes("south") && !property.orientation.toLowerCase().includes("south")) return false;
      if (filters.includes("terrace") && !property.terrace) return false;
      return true;
    }).map((property): ResultItem => ({ kind: "catalog", key: property.slug, price: property.price, match: property.match, href: `/property/${property.slug}`, property }));

    const seller = sellerListings.filter((listing) => {
      if (listing.status !== "live") return false;
      const haystack = `${listing.city} ${listing.address} ${listing.agency}`.toLowerCase();
      if (query.trim() && !haystack.includes(query.trim().toLowerCase())) return false;
      if (initialBudget && listing.price > initialBudget * 1000) return false;
      if (initialBeds && listing.bedrooms < initialBeds) return false;
      if (filters.includes("instant") && !listing.instantReserve) return false;
      if (filters.includes("under350") && listing.price > 350000) return false;
      if (filters.includes("beds3") && listing.bedrooms < 3) return false;
      if (filters.includes("south") || filters.includes("terrace")) return false;
      return true;
    }).map((listing): ResultItem => ({ kind: "seller", key: listing.id, price: listing.price, match: 90, href: `/seller-listing/${listing.id}`, listing }));

    return [...catalog, ...seller].sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      return b.match - a.match;
    });
  }, [query, filters, sort, initialBudget, initialBeds, sellerListings]);

  const toggleFilter = (id: FilterId) => setFilters((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

  const saveSearchToAgent = () => {
    const current = getAgentConfig();
    const hardRules: string[] = [];
    if (filters.includes("south")) hardRules.push("South-facing");
    if (filters.includes("beds3")) hardRules.push("3+ bedrooms");
    if (filters.includes("terrace")) hardRules.push("Terrace");

    const next = saveAgentConfig({
      active: false,
      location: query.trim() || current.location,
      radiusKm: current.radiusKm,
      maxPrice: initialBudget ? initialBudget * 1000 : filters.includes("under350") ? 350000 : current.maxPrice,
      reservationLimit: current.reservationLimit,
      hardRules: hardRules.length ? hardRules : current.hardRules,
      authorised: false
    });
    setAgent(next);
    setAgentSaved(true);
  };

  const agentEffective = Boolean(agent?.active && agent.authorised && !reservationActive);

  return (
    <div className="mkt-explore">
      <div className="mkt-explore-searchbar">
        <div className="mkt-shell">
          <div className="mkt-explore-searchinner">
            <label className="mkt-explore-input">
              <SearchIcon size={20}/>
              <input value={query} onChange={(event) => { setQuery(event.target.value); setAgentSaved(false); }} aria-label="Search location" placeholder="Search city, neighbourhood or address"/>
              <span className="pill pill-blue"><MapPinIcon size={14}/> Spain</span>
            </label>
            <button className="button button-secondary" type="button" onClick={() => setMapVisible((value) => !value)}><SlidersIcon size={17}/> {mapVisible ? "Hide map" : "Show map"}</button>
          </div>
          <div className="mkt-filter-strip">
            {quickFilters.map((filter) => <button key={filter.id} type="button" className={`mkt-filter ${filters.includes(filter.id) ? "active" : ""}`} onClick={() => { toggleFilter(filter.id); setAgentSaved(false); }}>{filters.includes(filter.id) && <CheckIcon size={13}/>} {filter.label}</button>)}
          </div>
        </div>
      </div>

      <div className="mkt-shell">
        <div className="mkt-results-head">
          <div><div className="mkt-section-label">Marketplace</div><h1>{query ? `Homes in ${query}` : "Homes ready to reserve"}</h1><p>{results.length} matching homes · verified listing information · reservation rules shown upfront</p></div>
          <div className="mkt-result-tabs" role="group" aria-label="Sort homes">
            <button className={sort === "match" ? "active" : ""} onClick={() => setSort("match")}>Best match</button>
            <button className={sort === "price-low" ? "active" : ""} onClick={() => setSort("price-low")}>Price ↑</button>
            <button className={sort === "price-high" ? "active" : ""} onClick={() => setSort("price-high")}>Price ↓</button>
          </div>
        </div>

        <div className={`mkt-results-layout ${mapVisible ? "" : "map-hidden"}`} style={!mapVisible ? {gridTemplateColumns:"1fr"} : undefined}>
          <section>
            {results.length ? <div className="property-grid">{results.map((item) => item.kind === "catalog" ? <PropertyCard key={item.key} property={item.property}/> : <SellerMarketplaceCard key={item.key} listing={item.listing}/>)}</div> : <div className="empty-state"><SparklesIcon size={28}/><h3>No exact matches right now.</h3><p>Remove a filter or let your Finqit Agent keep watching this search for you.</p><button className="button button-primary" onClick={() => setFilters(["instant"])}>Reset filters</button></div>}
          </section>

          {mapVisible && <aside className="mkt-map-panel" aria-label="Property map preview">
            <div className="mkt-map-grid"/>
            {results.slice(0, 5).map((item, index) => <Link key={item.key} href={item.href} className={`mkt-map-chip ${index === 0 ? "active" : ""}`} style={{left:`${16 + (index * 17) % 68}%`,top:`${15 + (index * 13) % 55}%`}}>€{Math.round(item.price / 1000)}k</Link>)}
            <div className="mkt-map-agent">
              <div className="mkt-section-label"><SparklesIcon size={13}/> Finqit Agent</div>
              <h3>{reservationActive && agent?.active ? "Auto-paused while you decide" : agentEffective ? "Your Agent is watching" : agentSaved ? "Search saved to your Agent" : "Never miss the right home"}</h3>
              <p>{reservationActive && agent?.active ? "Your Agent keeps its rules but cannot reserve another home while your current exclusive window is active." : agentEffective ? `Your authorised Agent is watching ${agent?.location} within its saved hard limits.` : agentSaved ? "Review the saved hard rules and explicitly authorise them before automatic reservation can be activated." : "Turn this search into hard Agent rules. Any binding reservation still requires explicit limits and authorisation."}</p>
              {agentSaved ? <Link className="button button-primary full-width" href="/agent">Review & authorise Agent</Link> : <button className="button button-primary full-width" onClick={saveSearchToAgent}>Save this search to Agent</button>}
            </div>
          </aside>}
        </div>
      </div>
    </div>
  );
}
