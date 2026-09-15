import { FileIcon, MailIcon, SearchIcon, SparklesIcon } from "@/components/icons";

const threads = [
  ["Schindler España", "Lift maintenance · date confirmation", "Confirmed intervention for 22 September at 09:00. Access to the machine room will be required.", "10:42", "2"],
  ["Construccions Miró", "Roof repair quote — final version", "Attached final quote including waterproofing and waste removal. Total €2,840 + VAT.", "Yesterday", "1"],
  ["Administrador · Núria", "September bank reconciliation", "All community payments are reconciled. Water invoice has been marked as paid.", "Yesterday", ""],
  ["2B · Marta Soler", "Water pressure in upper floors", "Pressure seems lower after 20:00. Is anyone else experiencing the same issue?", "Mon", "1"]
];

export default function InboxPage() {
  return <>
    <header className="dashboard-header inbox-header"><div><div className="eyebrow">Smart inbox</div><h1>Everything the building knows.</h1><p>Emails, PDFs and attachments become organised community knowledge.</p></div></header>
    <div className="inbox-toolbar"><label><SearchIcon/><input placeholder="Search emails, people, invoices..."/></label><span className="email-alias"><MailIcon size={15}/> aribau114@in.finqit.ai</span></div>
    <div className="inbox-layout">
      <section className="thread-list">
        {threads.map(([from, subject, preview, time, unread], index) => <article className={`thread-item ${index === 0 ? "selected" : ""}`} key={subject}><div className="sender-avatar">{from.slice(0,1)}</div><div><div className="thread-top"><strong>{from}</strong><span>{time}</span></div><h3>{subject}</h3><p>{preview}</p><div className="thread-meta">{subject.includes("quote") && <span><FileIcon size={14}/> quote_roof_final.pdf</span>}{unread && <em>{unread}</em>}</div></div></article>)}
      </section>
      <aside className="thread-detail">
        <div className="thread-detail-top"><div className="sender-avatar large">S</div><div><strong>Schindler España</strong><span>service.barcelona@schindler.com</span></div></div>
        <h2>Lift maintenance · date confirmation</h2>
        <p>Good morning, we confirm the preventive maintenance visit for Tuesday 22 September at 09:00. Our technician will require access to the machine room. Estimated duration is 60–90 minutes.</p>
        <p>Please confirm someone can provide access.</p>
        <div className="ai-extraction"><div className="eyebrow"><SparklesIcon size={15}/> Finqit extracted</div><div className="extraction-grid"><span><small>Date</small><strong>22 Sep · 09:00</strong></span><span><small>Supplier</small><strong>Schindler España</strong></span><span><small>Action</small><strong>Confirm access</strong></span><span><small>Duration</small><strong>60–90 min</strong></span></div><button className="button button-primary">Add to community calendar</button></div>
      </aside>
    </div>
  </>;
}
