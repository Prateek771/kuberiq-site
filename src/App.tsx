import { useEffect, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { ArrowUpRight, ArrowRight, ArrowDown, Phone, CalendarDays, ContactRound, MessageCircle, Link2, Database, CreditCard, UserRound, Workflow, Globe2, Menu, X, MoveUpRight } from 'lucide-react';
import { capabilities, delivery, faqs } from './content';
import OpeningSequence from './OpeningSequence';
import ScrollScene from './ScrollScene';
import { useReveal } from './useReveal';
import { useSmoothScroll } from './useSmoothScroll';
import { BookingLink as BookLink, HomeSections, Vision, HowWeWork, BookingSection, LegalContent } from './Presentation';
import { pageForPath } from './routing';
import { PageHero, AutomationScope } from './ServicePages';

const navigation = [['Home', '/'], ['Voice Agents + CRM', '/voice-agents.html'], ['Custom Automations', '/automations.html'], ['About & Contact', '/contact.html']];
const page = pageForPath(location.pathname);
const capabilityIcons = [Phone, UserRound, CalendarDays, ContactRound];
const process = [
  ['A lead comes in', 'An enquiry arrives by phone or through your connected form, campaign, or CRM. Existing leads can also enter an agreed follow-up campaign.', MessageCircle],
  ['Your agent starts the conversation', "It answers or calls back, asks your qualifying questions, and helps with routine requests using the information you've approved.", Phone],
  ['The next step gets arranged', 'The agent books an appointment, helps with a required deposit, or schedules the next follow-up. Requests that need a person go to your team through the agreed handover process.', CalendarDays],
  ['Your CRM stays up to date', "The outcome and relevant details are logged against the lead. Your team can see what's booked, what's awaiting payment, and what needs a person—with an owner and due time for outstanding follow-up.", Database],
] as const;

function Reveal({ children, className = '', delay = 0 }: {children: ReactNode; className?: string; delay?: number}) {
  return <div data-reveal className={className} style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}>{children}</div>;
}
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  useReveal();
  useSmoothScroll();
  useEffect(() => {
    const closeMenu = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('keydown', closeMenu);
    return () => document.removeEventListener('keydown', closeMenu);
  }, []);

  return <>
    <ScrollScene />
    <a href="#main" className="skip-link">Skip to content</a>
    <header className="site-header">
      <div className="nav-wrap">
        <a data-reveal className="wordmark" href="/" aria-label="KuberIQ home">Kuber<span>IQ</span></a>
        <nav className="desktop-nav" aria-label="Main navigation">{navigation.map(([label, href], index) => <a data-reveal style={{'--reveal-delay':`${100+index*100}ms`} as CSSProperties} href={href} key={href} aria-current={location.pathname === href ? 'page' : undefined}>{label}</a>)}</nav>
        <div data-reveal style={{'--reveal-delay':'500ms'} as CSSProperties} className="nav-actions"><BookLink className="button-small" /><button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="mobile-nav" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}>{menuOpen ? <X /> : <Menu />}</button></div>
      </div>
      {menuOpen && <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile navigation">{navigation.map(([label, href]) => <a key={href} href={href} aria-current={location.pathname === href ? 'page' : undefined} onClick={() => setMenuOpen(false)}>{label}<ArrowUpRight size={18}/></a>)}</nav>}
      <div className="page-progress" aria-hidden="true" />
    </header>

    <main id="main" className={`page-${page}`}>
      {page === 'home' && <><OpeningSequence callToAction={<BookLink/>}/><div className="cinema-spacer" aria-hidden="true"/><HomeSections/></>}
      {page === 'voice' && <>
        <PageHero title="AI voice agents. Connected CRM. Less chasing." body="Answer enquiries, qualify interest, book appointments and keep follow-up moving—with your existing CRM or one included in your solution."><BookLink/><a className="text-link" href="#how-it-works">Follow an enquiry through <ArrowDown size={16}/></a></PageHero>
      <section id="what-we-do" className="capabilities section-pad">
        <div className="content-width">
          <Reveal className="section-heading"><div><p className="eyebrow">VOICE AGENTS</p><h2>What your agent<br/>can handle.</h2></div><p>We build around the routine work that keeps coming back to you—using your service information, qualification questions, and booking rules.</p></Reveal>
          <div className="capability-grid">{capabilities.map((item, index) => {const Icon = capabilityIcons[index]; return <Reveal delay={index*90} className="capability" key={item.title}><div className="capability-top"><span className="index">0{index+1}</span><span className="icon-disc"><Icon size={24} strokeWidth={1.5}/></span></div><h3>{item.title}</h3><p>{item.body}</p></Reveal>;})}</div>
          <Reveal className="capability-note"><span className="tiny-dot"/><p>We agree response targets, calling hours, retry limits, and handover rules around your process and connected tools.</p></Reveal>
        </div>
      </section>

      <section id="how-it-works" className="process section-pad">
        <div className="content-width">
          <Reveal><p className="eyebrow">HOW IT WORKS</p><h2>From conversation to next step—<br/>with less chasing in between.</h2></Reveal>
          <div className="process-grid">{process.map(([title, body, Icon], index) => <Reveal className="process-step" delay={index*100} key={title}><div className="step-track"><span className="step-circle"><Icon size={23} strokeWidth={1.5}/></span>{index<3&&<ArrowRight className="step-arrow" size={22}/>}</div><p className="index">0{index+1}</p><h3>{title}</h3><p>{body}</p></Reveal>)}</div>
        </div>
      </section>

      <section id="your-crm" className="crm section-pad">
        <div className="content-width">
          <Reveal className="section-heading"><div><p className="eyebrow">CRM INTEGRATION</p><h2>Already have a CRM?<br/>Let's work with it.</h2></div><p>Your voice agent should fit the way you work. We connect the lead, conversation, and next action wherever your tools allow, so your team can see what happened without piecing it together from messages and call notes.</p></Reveal>
          <div className="crm-choices">
            <Reveal className="crm-choice"><span className="icon-disc"><Link2 size={25} strokeWidth={1.5}/></span><div><h3>Bring your existing CRM</h3><p>Keep your team’s familiar system. We assess how to connect your leads, contact records, calendars, and follow-up activity before recommending the integration.</p></div></Reveal>
            <Reveal className="crm-choice" delay={100}><span className="icon-disc"><Database size={25} strokeWidth={1.5}/></span><div><h3>Start with a CRM included</h3><p>If you don’t have one, we can provide a CRM as part of your solution—giving your team one place to manage contacts, appointments, payment status, and the follow-up that still needs attention.</p></div></Reveal>
          </div>
          <Reveal className="crm-outcomes"><div className="outcomes-label"><p className="eyebrow">ILLUSTRATIVE WORKFLOW</p><span>Possible outcomes</span></div><div className="outcomes-grid"><div><span className="status-icon mint"><CalendarDays size={22}/></span><div><h4>Booked</h4><p>Appointment in your calendar.</p></div></div><div><span className="status-icon peach"><CreditCard size={22}/></span><div><h4>Awaiting payment</h4><p>Payment link sent. Status visible.</p></div></div><div><span className="status-icon blue"><UserRound size={22}/></span><div><h4>Needs your team</h4><p>Context and a clear next action.</p></div></div></div></Reveal>
          <p className="fine-print crm-footnote">The setup, access, subscription costs, and ongoing support are made clear in your proposal.</p>
        </div>
      </section>

      <section className="leads-deposits section-pad">
        <div className="content-width split-layout">
          <Reveal className="existing-leads"><p className="eyebrow">LEAD REACTIVATION</p><h2>Your next customer<br/>could already be<br/>in your database.</h2><p>Past enquiries, missed callbacks, and unfinished conversations can sit untouched because working through them means another evening on the phone. Your agent can contact an agreed list from your CRM, CSV, or Excel sheet, find out who is still interested, and arrange the next step.</p><p>Your team gets interested prospects with useful context and a clear next action, rather than another list to call from scratch.</p><p className="fine-print">You choose the audience, calling schedule, follow-up limits, and when contact should stop.</p></Reveal>
          <Reveal className="deposits" delay={120}><span className="deposit-visual" aria-hidden="true"><CalendarDays size={48} strokeWidth={1}/><span className="deposit-link"><Link2 size={24}/></span></span><h2>Keep the deposit<br/>in the booking process.</h2><p>If your business takes a deposit or booking fee, make it part of the conversation. The agent can send a payment link and guide the customer through the next step, with payment confirmation connected to the booking workflow.</p><p>If payment is still outstanding, the record shows it. Follow-up can continue under the rules you set, giving your team fewer payments to check and chase manually.</p><p>You set the amount and booking terms. Your payment provider handles the transaction.</p><div className="deposit-labels"><span>Your fee</span><span>Your calendar</span><span>A clear payment status</span></div><p className="fine-print">Deposits are optional. The system is built around how your business takes bookings.</p></Reveal>
        </div>
      </section>

      <section className="delivery section-pad">
        <div className="content-width"><Reveal className="section-heading"><div><p className="eyebrow">GETTING STARTED</p><h2>Start with the work<br/>that keeps coming back to you.</h2></div><BookLink/></Reveal><div className="delivery-grid">{delivery.map((item,index)=><Reveal className="delivery-step" delay={index*90} key={item.title}><span className="index">0{index+1}</span><h3>{item.title}</h3><p>{item.body}</p></Reveal>)}</div></div>
      </section>

      <section id="faqs" className="faqs section-pad"><div className="content-width faq-layout"><Reveal><p className="eyebrow">COMMON QUESTIONS</p><h2>Voice agent questions,<br/> answered.</h2><p className="faq-intro">Your team, your tools, your way of working. Here's how a voice agent can fit in.</p></Reveal><div className="faq-list">{faqs.map((item,index)=><Reveal key={item.question} delay={Math.min(index*30,120)}><details className="faq" open={index===0?true:undefined}><summary>{item.question}<span className="faq-toggle" aria-hidden="true"/></summary><p>{item.answer}</p></details></Reveal>)}</div></div></section>

      </>}
      {page === 'automations' && <>
        <PageHero title="Custom automations. Built around your business." body="Connect the tasks that happen between your systems: capture an enquiry, assign the work, send a reminder, or prepare a report. You choose the workflow and the approvals."><a className="button" href="/contact.html?service=automations#contact">Discuss your workflow <ArrowUpRight size={18}/></a></PageHero>
      <section id="custom-automations" className="other-services">
        <div className="content-width other-layout">
          <Reveal className="automation-heading"><p className="eyebrow">ADDITIONAL SERVICES</p><h2>Customizable solutions<br/>we can deliver.</h2></Reveal>
          <Reveal delay={70} className="other-service">
            <Workflow size={25} strokeWidth={1.5}/>
            <h3>Business automations, tailored to your process</h3>
            <p>We build custom automations for businesses with different processes and requirements. Each solution is configured around your workflow, the systems you use, and the steps your team needs to approve.</p>
            <h4 className="automation-subheading">Solutions we can build</h4>
            <ul className="automation-solutions">
              <li><strong>Enquiry routing and CRM updates</strong><span>Capture enquiries, assign them to the right person, and update connected records.</span></li>
              <li><strong>Reminders and follow-ups</strong><span>Send appointment reminders, payment reminders, or status updates on an agreed schedule.</span></li>
              <li><strong>Customer onboarding and handovers</strong><span>Collect information, create tasks, and pass details between teams.</span></li>
              <li><strong>Reporting and data updates</strong><span>Bring information from connected systems into scheduled reports or shared records.</span></li>
            </ul>
            <div className="automation-questions">
              <details className="faq"><summary>Can the solution follow our existing process?<span className="faq-toggle" aria-hidden="true"/></summary><p>Yes. We agree the triggers, steps, conditions, approvals, and exceptions with you. We check what your existing systems support before confirming the scope.</p></details>
              <details className="faq"><summary>What if our requirement isn't listed?<span className="faq-toggle" aria-hidden="true"/></summary><p>These are examples. Tell us what starts the task, what should happen next, and which systems are involved. We can assess a tailored solution for your business.</p></details>
            </div>
            <a href="/contact.html?service=automations#contact" className="text-link">Discuss Your Requirements <MoveUpRight size={15}/></a>
          </Reveal>
          <div id="website-design"><Reveal delay={140} className="other-service"><Globe2 size={25} strokeWidth={1.5}/><h3>Website design</h3><p>A clear, distinctive website that explains your offer and gives visitors an easy way to enquire or book. We can assess a supported CRM connection as part of the project, so each enquiry has a clear next step.</p><a href="/contact.html?service=website#contact" className="text-link">Discuss Your Project <MoveUpRight size={15}/></a></Reveal></div>
        </div>
      </section>

        <AutomationScope/>
      </>}
      {page === 'contact' && <>
        <PageHero title="Let's make the everyday work easier." body="Voice agents, connected CRM, and automations shaped around your business. Start with the process that takes more attention than it should."><BookLink/><a className="text-link" href="#contact">Prefer email? <ArrowDown size={18}/></a></PageHero>
        <Vision/><HowWeWork/>
      </>}
      {(page === 'privacy' || page === 'terms') ? <LegalContent kind={page}/> : <BookingSection showContact={page === 'contact'}/>}
    </main>

    <footer><div className="content-width footer-layout"><div><a className="wordmark" href="/">Kuber<span>IQ</span></a><p>AI voice agents. Connected CRM. Less chasing.</p><span className="footer-domain">kuberiq.si</span></div><nav aria-label="Footer navigation">{navigation.map(([label,href])=><a key={href} href={href}>{label}</a>)}</nav><p className="copyright">© {new Date().getFullYear()} KuberIQ.</p></div><div className="content-width legal-preview"><a href="/privacy.html">Privacy notice</a><a href="/terms.html">Website &amp; service terms</a><a href="mailto:prateek@kuberiq.si">prateek@kuberiq.si</a><a href="mailto:venkatesh@kuberiq.si">venkatesh@kuberiq.si</a><span>Designed to give your day a little room.</span></div></footer>
  </>;
}
