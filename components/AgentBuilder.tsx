"use client";

import { useState } from "react";
import { CheckIcon, SparklesIcon } from "@/components/icons";

const chips = ["South-facing", "3+ bedrooms", "Terrace", "Lift", "Parking"];

export function AgentBuilder({ compact = false }: { compact?: boolean }) {
  const [active, setActive] = useState(false);
  const [selected, setSelected] = useState<string[]>(["South-facing", "3+ bedrooms", "Terrace"]);

  const toggle = (chip: string) => setSelected((current) => current.includes(chip) ? current.filter((x) => x !== chip) : [...current, chip]);

  return (
    <section className={`agent-builder ${compact ? "agent-builder-compact" : ""}`}>
      <div className="eyebrow"><SparklesIcon size={16}/> Auto-Reserve Agent</div>
      <div className="agent-heading-row">
        <div>
          <h2>{compact ? "Your smart search" : "Let Finqit move before the listing disappears."}</h2>
          <p>Set hard rules once. Finqit can reserve the first eligible match within your authorised limit.</p>
        </div>
        <label className="switch-row">
          <input type="checkbox" checked={active} onChange={() => setActive(!active)} />
          <span className="switch" aria-hidden="true"><span /></span>
          <span>{active ? "Active" : "Paused"}</span>
        </label>
      </div>
      <div className="agent-fields">
        <label><span>Where</span><strong>Sabadell</strong><small>+ 8 km radius</small></label>
        <label><span>Maximum price</span><strong>€350,000</strong><small>Purchase price</small></label>
        <label><span>Reservation limit</span><strong>€1,200</strong><small>Per automatic reservation</small></label>
      </div>
      <div className="chip-list">
        {chips.map((chip) => <button key={chip} onClick={() => toggle(chip)} className={selected.includes(chip) ? "filter-chip selected" : "filter-chip"}>{selected.includes(chip) && <CheckIcon size={14}/>} {chip}</button>)}
      </div>
      <div className={`agent-status ${active ? "active" : ""}`}>
        <span className="agent-pulse" />
        <div><strong>{active ? "Agent is watching the market" : "Preview mode"}</strong><small>{active ? "You have no active reservation, so you keep full queue priority." : "Activate when your identity and payment method are verified."}</small></div>
      </div>
    </section>
  );
}
