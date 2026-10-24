import type { CSSProperties, ReactNode } from 'react';
import { ArrowUpRight, ArrowRight, ChevronRight } from 'lucide-react';

export function PageHero({title,body,children}:{title:string;body:string;children?:ReactNode}) {
  return <section className="service-hero content-width">
    <a className="back-home" href="/">KuberIQ / Services</a>
    <h1 id="hero-heading">{title}</h1>
    <div className="service-hero-bottom"><p>{body}</p><div>{children}</div></div>
  </section>;
}

export function HomeSections({callToAction}: {callToAction: ReactNode}) {
  return <>
    <section id="the-chasing" className="cinema-capability home-introduction">
      <div className="capability-intro">
        <p data-reveal style={{'--reveal-delay':'120ms'} as CSSProperties} className="glass-badge">AI voice agents + CRM</p>
        <p data-reveal style={{'--reveal-delay':'220ms'} as CSSProperties}>Your team already answers calls. It's the callback promised for tomorrow, the unconfirmed booking, and the update that never reached the CRM that keep work coming back.</p>
      </div>
      <div className="capability-bottom">
        <div className="capability-editorial">
          <h2 data-reveal style={{'--reveal-delay':'180ms'} as CSSProperties}>The first call is only<br/>part of the job.</h2>
          <p data-reveal style={{'--reveal-delay':'320ms'} as CSSProperties}>We build AI voice agents to handle those routine conversations and record what happens next. Your team keeps the conversations that need a person.</p>
          <div data-reveal style={{'--reveal-delay':'420ms'} as CSSProperties} className="capability-actions"><a className="button" href="/voice-agents.html">Explore Voice Agents + CRM <ChevronRight size={14}/></a>{callToAction}</div>
        </div>
        <div className="frosted-capabilities">{[
          ['AI voice agents', 'Cover enquiries while the team is busy or away.'],
          ['Follow-up + bookings', 'Qualify interest and book suitable appointments.'],
          ['Connected CRM', 'Keep outcomes and follow-up together in your CRM.'],
        ].map(([title,body], index) => <div data-reveal key={title} style={{'--reveal-delay':`${300+index*110}ms`} as CSSProperties} className="frosted-capability"><span className="capability-index">0{index+1}</span><div><h3>{title}<ChevronRight size={16}/></h3><p>{body}</p></div></div>)}</div>
      </div>
    </section>
    <section className="section-pad example-section">
      <div className="content-width">
        <div className="section-heading"><h2>Where would it help<br/>in your business?</h2><p>Illustrative workflows, not client results. Each setup depends on your process and connected systems.</p></div>
        <div className="example-list">
          <article><span>After-hours enquiries</span><div><h3>The phone rings after your team has left.</h3><p>The agent answers routine questions, captures the request, and offers an available appointment or records a callback for the next working day.</p><p className="example-outcome">Your morning starts with context and a next step.</p></div></article>
          <article><span>Busy service teams</span><div><h3>A new enquiry arrives while everyone is with a customer.</h3><p>The agent calls during your agreed hours, asks the qualifying questions you chose, and passes suitable enquiries into your booking process.</p><p className="example-outcome">Fewer interruptions to the customer in front of you.</p></div></article>
          <article><span>Existing enquiries</span><div><h3>You have a list of people you meant to follow up with.</h3><p>Work through an agreed CRM or spreadsheet list, respect contact preferences and retry limits, and record who is interested in speaking again.</p><p className="example-outcome">A useful follow-up list with conversation notes.</p></div></article>
        </div>
      </div>
    </section>
    <section className="section-pad home-services">
      <div className="content-width service-editorial">
        <h2>Start with conversations.<br/>Connect the work around them.</h2>
        <a className="service-feature" href="/voice-agents.html"><div><h3>Voice Agents + CRM</h3><p>Enquiries, qualification, appointment booking and follow-up. Connect your existing CRM or include one in the setup.</p><span className="text-link">See the service <ArrowRight size={18}/></span></div><span className="service-arrow"><ArrowUpRight size={32}/></span></a>
        <div className="secondary-offer"><div><h3>Custom Automations</h3><p>For the repetitive work beyond the call: routing, reminders, handovers and reports, tailored to your business.</p></div><a className="text-link" href="/automations.html">Explore automations <ArrowUpRight size={18}/></a></div>
        <p className="website-note">Need the website connected too? <a href="/automations.html#website-design">Explore website design.</a></p>
      </div>
    </section>
    <section className="section-pad"><div className="content-width fit-section">
      <h2>Start with one<br/>well-defined workflow.</h2>
      <div className="reading-copy"><p>A useful first project has a repeated task, clear rules, and an outcome your team can check. We agree the scope, connect the supported systems, and test the exceptions with you before launch.</p><p>If every conversation needs specialist judgement, we focus on capturing the request and handing it to the right person.</p><a className="text-link" href="/contact.html">How we work together <ArrowUpRight size={18}/></a></div>
    </div></section>
  </>;
}

export function AutomationScope() {
  return <section className="section-pad"><div className="content-width fit-section">
    <h2>Your process.<br/>Your rules.<br/>A defined scope.</h2>
    <div className="reading-copy"><h3>What we agree before building</h3><ul className="scope-list"><li>What starts the workflow, and what a completed task looks like.</li><li>Which systems hold the information and what access they support.</li><li>Which actions run automatically and which need your approval.</li><li>What happens when information is missing or a system is unavailable.</li><li>Who owns the result, and what ongoing support is included.</li></ul><p>Setup, platform subscriptions, usage and support are separated in your proposal. Requirements outside the agreed scope are discussed before implementation.</p></div>
  </div></section>;
}

export function AboutApproach() {
  return <section className="section-pad about-approach"><div className="content-width">
    <div className="section-heading"><h2>Practical systems.<br/>Clear responsibilities.</h2><p>KuberIQ builds voice agents and connected workflows for service businesses. We start with the routine work you want handled, then define where automation ends and your team takes over.</p></div>
    <div className="approach-list"><article><h3>Build around your business</h3><p>Your service information, qualification questions, calendar rules and existing tools shape the solution.</p></article><article><h3>Test the difficult moments</h3><p>A caller asks for a person. A slot is unavailable. A payment is outstanding. We agree and test what should happen next.</p></article><article><h3>Make the handover clear</h3><p>You review the setup before launch. Ownership, platform access, usage costs and ongoing support are documented in the proposal.</p></article></div>
  </div></section>;
}

export function DiscoveryAgenda() {
  return <section className="section-pad discovery-agenda"><div className="content-width fit-section">
    <h2>What we'll cover<br/>in 30 minutes.</h2><div className="reading-copy"><p>The discovery call is free. Bring one process you want to improve and the names of the systems you use.</p><ol className="scope-list"><li>Where calls, bookings or follow-up currently get stuck.</li><li>What the agent should handle, and what your team should keep.</li><li>Whether the integration is feasible and what to scope next.</li></ol><p>You'll have a clearer next step. A scoped proposal follows when there is a suitable project.</p></div>
  </div></section>;
}

export function NextStep({children}:{children:ReactNode}) {
  return <section className="next-step section-pad"><div className="content-width"><h2>Which task would you<br/>like off your list?</h2><p>Tell us what happens today, where it gets stuck, and what you want to happen instead.</p><div className="next-step-actions">{children}<a className="text-link" href="/contact.html#contact">Prefer to leave a message? <ArrowUpRight size={18}/></a></div></div></section>;
}
