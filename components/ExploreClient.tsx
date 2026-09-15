"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { PropertyCard } from "@/components/PropertyCard";
import { properties } from "@/data/properties";
import { CheckIcon, MapPinIcon, SearchIcon, SlidersIcon, SparklesIcon } from "@/components/icons";

const quickFilters = [
  { id: "instant", label: "Instant Reserve" },
  { id: "under350", label: "Under €350k" },
  { id: "beds3", label: "3+ bedrooms" },
  { id: "south", label: "South-facing" },
  { id: "terrace", label: "Terrace" }
] as const;

type FilterId = (typeof quickFilters)[number]["id"];
type SortId = "match" | "price-low" | "price-high";

export function ExploreClient() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "Sabadell";
  const initialBudget = Number(searchParams.get("budget") || 0);
  const initialBeds = Number(searchParams.get("beds") || 0);

  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<FilterId[]>(["instant"]);
  const [sort, setSort] = useState<SortId>("match");
  const [mapVisible, setMapVisible] = useState(true);
  const [agentWatching, setAgentWatching] = useState(false);

  const results = useMemo(() => {
    const filtered = properties.filter((property) => {
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
    });

    return [...filtered].sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      return b.match - a.match;
    });
  }, [query, filters, sort, initialBudget, initialBeds]);

  const toggleFilter = (id: FilterId) => setFilters((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

  return (
    <div className="mkt-explore">
      <div className="mkt-explore-searchbar">
        <div className="mkt-shell">
          <div className="mkt-explore-searchinner">
            <label className="mkt-explore-input">
              <SearchIcon size={20}/>
              <input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search location" placeholder="Search city, neighbourhood or address"/>
              <span className="pill pill-blue"><MapPinIcon size={14}/> Spain</span>
            </label>
            <button className="button button-secondary" type="button" onClick={() => setMapVisible((value) => !value)}><SlidersIcon size={17}/> {mapVisible ? "Hide map" : "Show map"}</button>
          </div>
          <div className="mkt-filter-strip">
            {quickFilters.map((filter) => <button key={filter.id} type="button" className={`mkt-filter ${filters.includes(filter.id) ? "active" : ""}`} onClick={() => toggleFilter(filter.id)}>{filters.includes(filter.id) && <CheckIcon size={13}/>} {filter.label}</button>)}
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
            {results.length ? <div className="property-grid">{results.map((property) => <PropertyCard key={property.slug} property={property}/>)}</div> : <div className="empty-state"><SparklesIcon size={28}/><h3>No exact matches right now.</h3><p>Remove a filter or let your Finqit Agent keep watching this search for you.</p><button className="button button-primary" onClick={() => setFilters(["instant"])}>Reset filters</button></div>}
          </section>

          {mapVisible && <aside className="mkt-map-panel" aria-label="Property map preview">
            <div className="mkt-map-grid"/>
            {results.slice(0, 5).map((property, index) => <Link key={property.slug} href={`/property/${property.slug}`} className={`mkt-map-chip ${index === 0 ? "active" : ""}`} style={{left:`${16 + (index * 17) % 68}%`,top:`${15 + (index * 13) % 55}%`}}>€{Math.round(property.price / 1000)}k</Link>)}
            <div className="mkt-map-agent">
              <div className="mkt-section-label"><SparklesIcon size={13}/> Finqit Agent</div>
              <h3>{agentWatching ? "Watching this search" : "Never miss the right home"}</h3>
              <p>{agentWatching ? `We’ll keep checking new ${query || "market"} listings against your active filters. Auto-reserve remains off until you explicitly authorise a maximum payment.` : "Save these hard filters and let an agent alert you — or later reserve automatically inside limits you explicitly set."}</p>
              <button className={`button full-width ${agentWatching ? "button-secondary" : "button-primary"}`} onClick={() => setAgentWatching((value) => !value)}>{agentWatching ? "Pause watching" : "Watch this search"}</button>
            </div>
          </aside>}
        </div>
      </div>
    </div>
  );
}
