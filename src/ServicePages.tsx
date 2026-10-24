import type { ReactNode } from 'react';

export function PageHero({title,body,children}:{title:string;body:string;children?:ReactNode}) {
  return <section className="service-hero content-width">
    <a className="back-home" href="/">KuberIQ / Home</a>
    <h1 id="hero-heading">{title}</h1>
    <div className="service-hero-bottom"><p>{body}</p><div>{children}</div></div>
  </section>;
}
export function AutomationScope() {
  return <section className="section-pad"><div className="content-width fit-section">
    <h2>Your process.<br/>Your rules.<br/>A defined scope.</h2>
    <div className="reading-copy"><h3>What we agree before building</h3><ul className="scope-list"><li>What starts the workflow, and what a completed task looks like.</li><li>Which systems hold the information and what access they support.</li><li>Which actions run automatically and which need your approval.</li><li>What happens when information is missing or a system is unavailable.</li><li>Who owns the result, and what ongoing support is included.</li></ul><p>Setup, platform subscriptions, usage and support are separated in your proposal. Requirements outside the agreed scope are discussed before implementation.</p></div>
  </div></section>;
}
