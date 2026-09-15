import { ArrowRightIcon, BellIcon, CheckIcon, ClockIcon, FileIcon, MailIcon, SparklesIcon, VoteIcon, WalletIcon } from "@/components/icons";

export default function CommunityPage() {
  return <>
    <header className="dashboard-header"><div><div className="eyebrow">Tuesday, 15 September</div><h1>Good morning, Adrian.</h1><p>Here&apos;s what needs attention in your community.</p></div><button className="icon-button desktop-only"><BellIcon/></button></header>
    <div className="dashboard-grid top-dashboard-grid">
      <article className="dashboard-card ai-summary-card"><div className="dashboard-card-top"><span className="dashboard-icon blue"><SparklesIcon/></span><span className="pill pill-blue">AI summary</span></div><h2>3 things changed since yesterday</h2><ul><li><CheckIcon/><span><strong>Lift maintenance confirmed</strong><small>Schindler proposed Tuesday 22 Sep at 09:00.</small></span></li><li><CheckIcon/><span><strong>Water invoice paid</strong><small>€418.20 reconciled with community account.</small></span></li><li><CheckIcon/><span><strong>Roof repair quote received</strong><small>New PDF from Construccions Miró, €2,840.</small></span></li></ul><button className="inline-link">Ask about these updates <ArrowRightIcon/></button></article>
      <article className="dashboard-card inbox-card"><div className="dashboard-card-top"><span className="dashboard-icon"><MailIcon/></span><span className="unread-dot">4 unread</span></div><h3>Community inbox</h3><p className="email-alias">aribau114@in.finqit.ai</p><p>CC this address and Finqit organises the thread, attachments, decisions and follow-ups automatically.</p><a className="button button-secondary full-width" href="/community/inbox">Open inbox</a></article>
    </div>
    <div className="dashboard-section-title"><div><h2>Community overview</h2><p>Live operational snapshot</p></div></div>
    <div className="dashboard-grid metrics-grid">
      <article className="metric-card"><span className="dashboard-icon green"><WalletIcon/></span><div><small>Available balance</small><strong>€18,460</strong><span className="positive">+€1,920 this month</span></div></article>
      <article className="metric-card"><span className="dashboard-icon amber"><ClockIcon/></span><div><small>Open incidents</small><strong>3</strong><span>1 awaiting supplier</span></div></article>
      <article className="metric-card"><span className="dashboard-icon blue"><FileIcon/></span><div><small>Documents</small><strong>148</strong><span>12 added this month</span></div></article>
      <article className="metric-card"><span className="dashboard-icon purple"><VoteIcon/></span><div><small>Active votes</small><strong>1</strong><span>Closes Friday</span></div></article>
    </div>
    <div className="dashboard-grid bottom-dashboard-grid">
      <article className="dashboard-card"><div className="card-title-row"><div><h3>Upcoming</h3><p>Meetings & deadlines</p></div><button className="text-button">View calendar</button></div><div className="event-list"><div><span className="date-box"><strong>22</strong><small>SEP</small></span><div><strong>Lift maintenance</strong><span>09:00 · Main entrance</span></div></div><div><span className="date-box"><strong>02</strong><small>OCT</small></span><div><strong>Annual owners meeting</strong><span>19:00 · Lobby + online</span></div></div></div></article>
      <article className="dashboard-card"><div className="card-title-row"><div><h3>Active vote</h3><p>Roof repair contractor</p></div><span className="pill pill-green">68% voted</span></div><div className="vote-bars"><div><span><strong>Construccions Miró</strong><em>54%</em></span><i><b style={{width:"54%"}}/></i></div><div><span><strong>Obres BCN</strong><em>31%</em></span><i><b style={{width:"31%"}}/></i></div><div><span><strong>Abstain</strong><em>15%</em></span><i><b style={{width:"15%"}}/></i></div></div><button className="button button-primary full-width">Cast your vote</button></article>
    </div>
  </>;
}
