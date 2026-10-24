import { ArrowRight, ArrowUpRight, CalendarDays, Check, Mail } from 'lucide-react';
import { discoveryBooking, enquiryEmails } from './booking';

export function BookingLink({ className = '' }: { className?: string }) {
  return <a className={`button ${className}`} href={discoveryBooking.url}><span>Book a Discovery Call</span><span className="button-arrow"><ArrowUpRight size={18} aria-hidden="true" /></span></a>;
}

export function Vision() {
  return <section id="our-vision" className="section-pad vision-section"><div className="content-width vision-layout">
    <div><h2>More room for the work<br/>that needs you.</h2><p className="vision-label">Our vision</p></div>
    <div className="vision-copy"><p>Our aim is to make everyday business easier to run. We connect routine conversations, records, and follow-up so your team can spend more attention on customers and decisions that need a person.</p><p>We start with a useful, well-defined task. Your team helps shape it, tests it, and knows when to step in.</p></div>
  </div></section>;
}

export function HowWeWork() {
  return <section id="how-we-work" className="section-pad"><div className="content-width">
    <div className="presentation-heading"><h2>Built around your process.<br/>Tested with your team.</h2><p>A useful first project has clear rules, a manageable scope, and an outcome your team can check.</p></div>
    <ol className="delivery-steps">{[
      ['Understand', 'Choose one repeated task. Map the systems, the people involved, and what a useful result looks like.'],
      ['Build', 'Agree the conversation, approved information, system connections, and actions the agent can take.'],
      ['Test together', 'Try routine requests, unavailable appointments, unanswered questions, and requests to speak to a person.'],
      ['Launch and review', 'Agree ownership, monitoring, and support. Review completed tasks, exceptions, and the corrections your team still makes.'],
    ].map(([title, body], index) => <li key={title}><span className="delivery-number">0{index + 1}</span><h3>{title}</h3><p>{body}</p></li>)}</ol>
    <div className="project-scope"><div><h3>What your first project includes</h3><p>A written scope, approved questions and rules, the agreed connections, exception testing, and a practical handover.</p></div><div><h3>Clear costs before we build</h3><p>Your proposal separates setup, platform subscriptions, usage, and support. Additional work is discussed before it is added.</p></div></div>
  </div></section>;
}

export function HomeSections() {
  return <>
    <section id="the-chasing" className="section-pad workflow-section"><div className="content-width">
      <div className="presentation-heading"><h2>One conversation.<br/>A clear next step.</h2><p>Here’s what a routine enquiry could look like, from the first question to a useful handover.</p></div>
      <div className="workflow-demo">
        <div className="demo-caption"><span>Illustrative example</span><span>Service appointment enquiry</span></div>
        <div className="demo-columns"><div className="sample-conversation"><h3>The conversation</h3><ol>
          <li><span>Customer</span><p>“Could I book a service for Friday morning?”</p></li>
          <li><span>AI agent</span><p>“I can check that. Which service do you need?”</p></li>
          <li><span>Customer</span><p>“An annual service. I’d like someone to confirm the price first.”</p></li>
          <li><span>AI agent</span><p>“I’ll pass that to the team and note your preferred time. Your appointment isn’t confirmed yet.”</p></li>
        </ol></div><div className="sample-record"><div className="record-title"><h3>The handover</h3><span className="status-label">Needs a person</span></div><dl>
          <div><dt>Request</dt><dd>Annual service</dd></div><div><dt>Preferred time</dt><dd>Friday morning · requested</dd></div><div><dt>Booking status</dt><dd>Not confirmed</dd></div><div><dt>Next action</dt><dd>Confirm price and availability</dd></div><div><dt>Assigned to</dt><dd>Service team</dd></div><div><dt>Follow-up</dt><dd>Next working morning</dd></div>
        </dl><p className="record-note"><Check size={16} aria-hidden="true"/>Context, an owner, and a next action.</p></div></div>
        <p className="demo-footnote">Sample dialogue and record, not a live demo or a client result. The actions available depend on your agreed setup and connected tools.</p>
      </div>
    </div></section>

    <section className="section-pad"><div className="content-width">
      <div className="presentation-heading"><h2>Give routine work<br/>a reliable next step.</h2><a className="text-link" href="/voice-agents.html">Explore Voice Agents + CRM <ArrowUpRight size={18}/></a></div>
      <div className="jobs-list">{[
        ['Answer routine enquiries', 'Use the service information and questions you approve. Capture the request when your team is busy or away.', 'Your team starts with the context.'],
        ['Arrange the next step', 'Check supported calendars, offer suitable appointments, or record a callback when a person needs to help.', 'A confirmed booking or a clearly marked request.'],
        ['Keep follow-up organised', 'Record outcomes, assign outstanding work, and follow the calling times, retry limits, and stop rules you set.', 'One place to see what still needs attention.'],
      ].map(([title, body, outcome]) => <article key={title}><h3>{title}</h3><div><p>{body}</p><p className="job-outcome"><ArrowRight size={16} aria-hidden="true"/>{outcome}</p></div></article>)}</div>
    </div></section>

    <HowWeWork/>

    <section id="crm-fit" className="section-pad"><div className="content-width">
      <div className="presentation-heading"><h2>Your tools.<br/>A more connected day.</h2><p>We check compatibility before recommending a setup. Your tools and subscription plans determine what can connect.</p></div>
      <div className="crm-fit-panel"><article><h3>Already have a CRM?</h3><p>Keep the system your team knows. We assess its APIs, available connections, permissions, and calendar access before confirming the scope.</p></article><article><h3>Need a place to start?</h3><p>We can include CRM setup in your project, with the contacts, pipeline, and booking views you need. Platform subscriptions and support are quoted separately.</p></article></div>
      <div className="control-panel"><h3>You set the boundaries.</h3><p>Approved answers. Agreed calling hours. Clear retry limits. A defined handover to a person. If a tool is unavailable, the agent follows the fallback you’ve reviewed instead of treating an unfinished action as complete.</p><a className="text-link" href="/voice-agents.html#faqs">More about your controls <ArrowUpRight size={17}/></a></div>
      <div className="connected-services"><p>Need help with the work around the call?</p><a href="/automations.html">Explore custom automations <ArrowUpRight size={17}/></a><a href="/automations.html#website-design">Website design <ArrowUpRight size={17}/></a></div>
    </div></section>

    <Vision/>

    <section className="section-pad"><div className="content-width presentation-faq"><div><h2>A few things<br/>you may be wondering.</h2><a className="text-link" href="/voice-agents.html#faqs">All voice agent questions <ArrowUpRight size={17}/></a></div><div className="faq-list">{[
      ['Will this replace our team?', 'We can begin with busy-period calls, after-hours enquiries, or a specific follow-up task. Your team keeps the conversations that need their judgement and personal attention.'],
      ['What if the agent does not know the answer?', 'We agree what it can answer and when it must hand over. Depending on your phone setup, that may be a transfer or a callback request with the relevant context. It should not invent an answer or promise an unconfirmed action.'],
      ['How long does a first project take?', 'Timing depends on the workflow, system access, and testing needed. We confirm milestones and what we need from your team in the proposal before work begins.'],
      ['How is pricing worked out?', 'Call volume, integrations, workflow complexity, and support shape the cost. You receive a scoped proposal with setup, platform subscriptions, usage, and support shown separately.'],
    ].map(([question, answer]) => <details className="faq" key={question}><summary>{question}<span className="faq-toggle" aria-hidden="true"/></summary><p>{answer}</p></details>)}</div></div></section>
  </>;
}

export function ContactOptions() {
  return <div className="contact-options"><h3>Prefer to write it down?</h3><p>Tell us what happens today, where it gets stuck, and which tools you use. Email either of us to start the conversation.</p><div className="email-links">{enquiryEmails.map(email => <a href={`mailto:${email}?subject=KuberIQ%20project%20enquiry`} key={email}><Mail size={18} aria-hidden="true"/><span>{email}</span><ArrowUpRight size={17} aria-hidden="true"/></a>)}</div><p className="fine-print">Email links open your email app. You review and send the message there. Please leave out passwords, payment details, and sensitive customer information.</p></div>;
}

export function BookingSection({ showContact = false }: { showContact?: boolean }) {
  return <section id="contact" className="section-pad booking-section"><div className="content-width booking-panel">
    <div className="booking-intro"><div><h2>Let’s start with<br/>one useful conversation.</h2><p className="meeting-details"><CalendarDays size={18} aria-hidden="true"/>30 minutes · Online meeting</p><p>Tell us about one task that keeps coming back to your team. We’ll look at how it works today and where an AI voice agent or automation could help.</p><ol className="meeting-agenda"><li>Walk through the calls, bookings, or follow-up taking up your time.</li><li>Look at the tools you use and the decisions that should stay with your team.</li><li>Agree a practical next step and what we need to check before proposing a solution.</li></ol><p className="booking-instruction">Choose a date and time in the calendar. After booking, you’ll receive the meeting details by email.</p><p className="booking-privacy">Scheduling is provided by Calendly. <a href="/privacy.html">Privacy details</a></p></div>
    </div>
    <div id="booking-calendar" className="calendar-container"><p>If the calendar doesn’t appear, <a href={discoveryBooking.url}>open Calendly directly <ArrowUpRight size={14} aria-hidden="true"/></a>.</p><iframe title="Book a KuberIQ discovery call with Calendly" src={`${discoveryBooking.url}?embed_type=Inline&hide_event_type_details=1&background_color=dce7ec&text_color=183f47&primary_color=195461`} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" data-lenis-prevent/></div>
    {showContact ? <ContactOptions/> : <div className="booking-email"><span>Prefer email?</span>{enquiryEmails.map(email => <a key={email} href={`mailto:${email}`}>{email}<ArrowUpRight size={14} aria-hidden="true"/></a>)}</div>}
  </div></section>;
}

export function LegalContent({ kind }: { kind: 'privacy' | 'terms' }) {
  return <article className="content-width legal-page"><a className="text-link" href="/">Back to KuberIQ <ArrowRight size={16}/></a><h1>{kind === 'privacy' ? 'Privacy notice' : 'Website & service terms'}</h1><p className="legal-date">Updated 25 October 2026</p><div className="legal-copy">
    {kind === 'privacy' ? <>
      <h2>Contacting KuberIQ</h2><p>This notice describes the contact and booking options on the KuberIQ website. Email enquiries go to the address you choose: {enquiryEmails.map((email, i) => <span key={email}>{i ? ' or ' : ''}<a href={`mailto:${email}`}>{email}</a></span>)}. We use the details you send to respond to your enquiry and discuss the requested work. Please do not send passwords, payment details, or sensitive customer records.</p>
      <h2>Email enquiries</h2><p>This website does not have a form submission service or store enquiry drafts. Email links open your email application; a message is only sent when you send it from there. Your email provider and ours process the message as part of delivering and storing email.</p>
      <h2>Booking a meeting</h2><p>Booking links take you to Calendly. The embedded calendar loads automatically as you approach the booking section. Loading it connects your browser to Calendly, which may use cookies and process technical information. Information you submit there is used to arrange the meeting and is available to the meeting organiser. See <a href="https://calendly.com/legal/privacy-notice">Calendly’s privacy notice</a> for its data practices. You can manage cookies through Calendly’s cookie settings and your browser.</p>
      <h2>Browsing this site</h2><p>We have not added advertising trackers or visitor analytics to this site. Page delivery requires technical information such as your IP address and browser request; the hosting service may keep access logs. Typography loads from Google Fonts, which receives the requests needed to supply the font files. Read <a href="https://policies.google.com/privacy">Google’s privacy policy</a>.</p>
      <h2>Your questions and choices</h2><p>You can choose email instead of the embedded calendar. To ask about information you have shared with KuberIQ, request a correction or deletion, or raise a privacy concern, email <a href={`mailto:${enquiryEmails[0]}`}>{enquiryEmails[0]}</a>. We will review the request and explain any information we need to retain for the work or applicable obligations.</p>
      <h2>Information used in client projects</h2><p>A client project may involve different systems and information. The agreed scope will identify the relevant providers, access, responsibilities, and data handling before those systems are connected. This website notice does not describe a deployed client voice agent.</p>
    </> : <>
      <h2>What this website offers</h2><p>KuberIQ describes AI voice agent, CRM, automation, and website services here. Examples illustrate possible workflows; they are not guarantees of performance, availability, revenue, or time saved. The sample conversation and record do not represent a live customer or a production integration.</p>
      <h2>Before work begins</h2><p>Booking a discovery call or sending an enquiry does not purchase a service. A written proposal will define the scope, deliverables, responsibilities, milestones, acceptance criteria, and payment terms before project work begins.</p>
      <h2>Compatibility and costs</h2><p>Integrations depend on the systems, permissions, and subscription plans available. We assess compatibility before committing to an integration. Setup, platform subscriptions, usage, and ongoing support are separated in the proposal. Changes outside the agreed scope are discussed before implementation.</p>
      <h2>Human review and responsibilities</h2><p>The project defines approved information, permitted actions, contact rules, human handover, and failure handling. Your team reviews and tests the agreed workflow before launch. AI systems can make mistakes; the scope sets out appropriate checks and who handles exceptions.</p>
      <h2>Other services and links</h2><p>Calendly handles meeting scheduling. Email links use your chosen email application. These services have their own terms and privacy policies. Meeting changes and cancellations can be managed through the options in your Calendly confirmation.</p>
      <h2>Questions</h2><p>Contact <a href={`mailto:${enquiryEmails[0]}`}>{enquiryEmails[0]}</a> or <a href={`mailto:${enquiryEmails[1]}`}>{enquiryEmails[1]}</a>. Any signed project agreement sets the terms for that project.</p>
    </>}
  </div></article>;
}
