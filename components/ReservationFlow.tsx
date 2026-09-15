"use client";

import { useMemo, useState } from "react";
import { CheckIcon, ClockIcon, ShieldIcon } from "@/components/icons";
import { formatPrice } from "@/data/properties";

type ReservationFlowProps = {
  price: number;
  reservationFee: number;
  optionPremium: number;
  visitWindow: string;
  propertyTitle: string;
};

export function ReservationFlow({ price, reservationFee, optionPremium, visitWindow, propertyTitle }: ReservationFlowProps) {
  const [step, setStep] = useState(1);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedInfo, setAcceptedInfo] = useState(false);
  const [method, setMethod] = useState<"card" | "wallet" | "bank">("card");

  const refundable = reservationFee - optionPremium;
  const reference = useMemo(() => `FQ-${Math.floor(100000 + Math.random() * 899999)}`, []);

  if (step === 4) {
    return <div className="reserve-success">
      <div className="reserve-success-icon">✓</div>
      <h3>Reservation simulation complete</h3>
      <p><strong>{propertyTitle}</strong> would now be exclusively locked for your {visitWindow} decision window.</p>
      <div className="reserve-summary" style={{marginTop:16,textAlign:"left"}}>
        <div className="reserve-summary-row"><span>Reference</span><strong>{reference}</strong></div>
        <div className="reserve-summary-row"><span>Reservation amount</span><strong>{formatPrice(reservationFee)}</strong></div>
        <div className="reserve-summary-row"><span>Status</span><strong style={{color:"#16845f"}}>Exclusive window active</strong></div>
      </div>
      <small className="reservation-legal">Prototype: no payment was charged and no binding right has been created. Production must use the final lawyer-approved contract and a regulated payment provider.</small>
    </div>;
  }

  return <div className="reserve-flow">
    <div className="reserve-progress" aria-label={`Reservation step ${step} of 3`}><span className="active"/><span className={step >= 2 ? "active" : ""}/><span className={step >= 3 ? "active" : ""}/></div>

    {step === 1 && <>
      <h3 className="reserve-step-title">Secure the exclusive window</h3>
      <p className="reserve-step-copy">The seller has enabled Finqit Instant Reserve for this listing. You see the economic structure before any payment step.</p>
      <div className="reserve-summary">
        <div className="reserve-summary-row"><span>Home price</span><strong>{formatPrice(price)}</strong></div>
        <div className="reserve-summary-row"><span>Reservation payment</span><strong>{formatPrice(reservationFee)}</strong></div>
        <div className="reserve-summary-row"><span>Refundable deposit portion</span><strong>{formatPrice(refundable)}</strong></div>
        <div className="reserve-summary-row"><span>Option / exclusivity premium</span><strong>{formatPrice(optionPremium)}</strong></div>
        <div className="reserve-summary-row"><span>Exclusive decision window</span><strong>{visitWindow}</strong></div>
      </div>
      <div className="reservation-breakdown">
        <div><ShieldIcon size={18}/><span><strong>Seller lock</strong><small>The production agreement is intended to prevent the seller from accepting another reservation during your exclusive window.</small></span></div>
        <div><CheckIcon size={18}/><span><strong>Proceed with the purchase</strong><small>The contract can provide that the full reservation payment is credited toward the purchase price.</small></span></div>
        <div><ClockIcon size={18}/><span><strong>Decide not to proceed</strong><small>Under the displayed prototype terms, the refundable deposit returns and only the stated premium is retained.</small></span></div>
      </div>
      <button className="button button-primary full-width large-button" onClick={() => setStep(2)}>Review reservation terms</button>
    </>}

    {step === 2 && <>
      <h3 className="reserve-step-title">Know exactly what you accept</h3>
      <p className="reserve-step-copy">Production must provide the property information and contract in a durable format before the buyer pays. These confirmations model that UX.</p>
      <label className="reserve-check">
        <input type="checkbox" checked={acceptedInfo} onChange={(event) => setAcceptedInfo(event.target.checked)}/>
        <span><strong>I received the transaction information</strong><small>Seller/intermediary identity, total price, essential property information, charges and the reservation conditions are available to download before payment.</small></span>
      </label>
      <label className="reserve-check">
        <input type="checkbox" checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)}/>
        <span><strong>I accept the exclusive reservation terms</strong><small>I understand the {formatPrice(optionPremium)} premium, the {formatPrice(refundable)} refundable portion, the {visitWindow} deadline and the consequence of proceeding or declining.</small></span>
      </label>
      <button className="button button-primary full-width large-button" disabled={!acceptedTerms || !acceptedInfo} onClick={() => setStep(3)} style={!acceptedTerms || !acceptedInfo ? {opacity:.45,cursor:"not-allowed"} : undefined}>Continue to payment</button>
      <button className="text-button" onClick={() => setStep(1)}>← Back to summary</button>
    </>}

    {step === 3 && <>
      <h3 className="reserve-step-title">Choose payment method</h3>
      <p className="reserve-step-copy">The real product should send funds through a regulated payment provider; Finqit should not casually hold reservation money in its operating account.</p>
      <div className="reserve-payment">
        <button className={method === "card" ? "active" : ""} onClick={() => setMethod("card")}><span>💳 Card</span><span>•••• 4242</span></button>
        <button className={method === "wallet" ? "active" : ""} onClick={() => setMethod("wallet")}><span> Pay / Google Pay</span><span>Fast</span></button>
        <button className={method === "bank" ? "active" : ""} onClick={() => setMethod("bank")}><span>🏦 Bank payment</span><span>Verified account</span></button>
      </div>
      <div className="reserve-summary">
        <div className="reserve-summary-row"><span>Due now</span><strong>{formatPrice(reservationFee)}</strong></div>
        <div className="reserve-summary-row"><span>Payment purpose</span><strong>Exclusive reservation</strong></div>
      </div>
      <button className="button button-primary full-width large-button" onClick={() => setStep(4)}>Simulate secure payment · {formatPrice(reservationFee)}</button>
      <button className="text-button" onClick={() => setStep(2)}>← Back to terms</button>
      <small className="reservation-legal">Demo only. This button intentionally does not collect card data or charge money.</small>
    </>}
  </div>;
}
