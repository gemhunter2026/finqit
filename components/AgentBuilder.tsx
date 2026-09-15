"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckIcon, ShieldIcon, SparklesIcon } from "@/components/icons";
import { FINQIT_STATE_EVENT, getActiveReservation, getAgentConfig, saveAgentConfig } from "@/lib/demo-state";

const chips = ["South-facing", "3+ bedrooms", "Terrace", "Lift", "Parking"];

export function AgentBuilder({ compact = false }: { compact?: boolean }) {
  const initial = getAgentConfig();
  const [active, setActive] = useState(initial.active);
  const [location, setLocation] = useState(initial.location);
  const [radiusKm, setRadiusKm] = useState(initial.radiusKm);
  const [maxPrice, setMaxPrice] = useState(initial.maxPrice);
  const [reservationLimit, setReservationLimit] = useState(initial.reservationLimit);
  const [selected, setSelected] = useState<string[]>(initial.hardRules);
  const [authorised, setAuthorised] = useState(initial.authorised);
  const [reservationActive, setReservationActive] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const sync = () => setReservationActive(Boolean(getActiveReservation()));
    sync();
    window.addEventListener(FINQIT_STATE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(FINQIT_STATE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggle = (chip: string) => setSelected((current) => current.includes(chip) ? current.filter((x) => x !== chip) : [...current, chip]);
  const effectiveActive = active && authorised && !reservationActive;

  const summary = useMemo(() => {
    const core = `${location || "Any location"} · ≤ €${maxPrice.toLocaleString("en-US")}`;
    return selected.length ? `${core} · ${selected.slice(0, 2).join(" · ")}` : core;
  }, [location, maxPrice, selected]);

  const persist = (nextActive = active) => {
    const next = saveAgentConfig({
      active: nextActive,
      location: location.trim() || "Sabadell",
      radiusKm: Math.max(1, radiusKm),
      maxPrice: Math.max(50000, maxPrice),
      reservationLimit: Math.max(100, reservationLimit),
      hardRules: selected,
      authorised,
    });
    setActive(next.active);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  const handleActivation = () => {
    if (!authorised || reservationActive) return;
    persist(!active);
  };

  return (
    <section className={`agent-builder ${compact ? "agent-builder-compact" : ""}`}>
      <div className="eyebrow"><SparklesIcon size={16}/> Auto-Reserve Agent</div>
      <div className="agent-heading-row">
        <div>
          <h2>{compact ? "Your smart search" : "Let Finqit move before the listing disappears."}</h2>
          <p>Set hard rules once. Recommendations can be flexible, but any automatic reservation stays inside the exact limits you authorise.</p>
        </div>
        <button type="button" className={`agent-live-toggle ${effectiveActive ? "active" : ""}`} onClick={handleActivation} disabled={!authorised || reservationActive}>
          <span className="agent-pulse" />
          {reservationActive ? "Auto-paused" : effectiveActive ? "Agent active" : "Agent paused"}
        </button>
      </div>

      <div className="agent-fields agent-fields-editable">
        <label>
          <span>Where</span>
          <input value={location} onChange={(event) => setLocation(event.target.value)} aria-label="Agent location" />
          <small>Search centre</small>
        </label>
        <label>
          <span>Radius</span>
          <div className="agent-input-suffix"><input type="number" min="1" max="50" value={radiusKm} onChange={(event) => setRadiusKm(Number(event.target.value))}/><strong>km</strong></div>
          <small>Maximum distance</small>
        </label>
        <label>
          <span>Maximum price</span>
          <div className="agent-input-prefix"><strong>€</strong><input type="number" min="50000" step="5000" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))}/></div>
          <small>Hard purchase cap</small>
        </label>
        <label>
          <span>Reservation limit</span>
          <div className="agent-input-prefix"><strong>€</strong><input type="number" min="100" step="50" value={reservationLimit} onChange={(event) => setReservationLimit(Number(event.target.value))}/></div>
          <small>Maximum automatic payment</small>
        </label>
      </div>

      <div className="agent-rule-head"><div><strong>Hard reservation rules</strong><small>Finqit will never auto-reserve outside these selected rules.</small></div><span>{selected.length} active</span></div>
      <div className="chip-list">
        {chips.map((chip) => <button type="button" key={chip} onClick={() => toggle(chip)} className={selected.includes(chip) ? "filter-chip selected" : "filter-chip"}>{selected.includes(chip) && <CheckIcon size={14}/>} {chip}</button>)}
      </div>

      <label className={`agent-authorisation ${authorised ? "accepted" : ""}`}>
        <input type="checkbox" checked={authorised} onChange={(event) => { setAuthorised(event.target.checked); if (!event.target.checked) setActive(false); }}/>
        <ShieldIcon size={21}/>
        <span><strong>Authorise binding reservations within these hard limits</strong><small>I authorise Finqit to automatically create a reservation only when every hard rule above is met and the reservation payment does not exceed €{reservationLimit.toLocaleString("en-US")}.</small></span>
      </label>

      <div className="agent-save-row">
        <div><small>Current rule summary</small><strong>{summary}</strong></div>
        <button type="button" className="button button-primary" onClick={() => persist(active)}>{saved ? "Saved ✓" : "Save rules"}</button>
      </div>

      <div className={`agent-status ${effectiveActive ? "active" : ""}`}>
        <span className="agent-pulse" />
        <div>
          <strong>{reservationActive ? "Agent paused because you already hold a reservation" : effectiveActive ? "Agent is watching verified listings" : authorised ? "Ready to activate" : "Preview mode"}</strong>
          <small>{reservationActive ? "Finqit enforces one active reservation at a time. The agent can resume after you release or complete it." : effectiveActive ? "Matching is automatic; binding action remains limited to the deterministic rules you authorised." : "Verify identity/payment readiness and authorise the hard limits before enabling automatic action."}</small>
        </div>
      </div>
    </section>
  );
}
