import type { CSSProperties, ReactNode } from 'react';
import { ArrowDown } from 'lucide-react';

export default function OpeningSequence({ callToAction }: { callToAction: ReactNode }) {
  return <div className="opening" aria-label="KuberIQ introduction">
    <div className="cinema-stage">
      <section className="cinema-scene cinema-intro" aria-labelledby="hero-heading">
        <div className="cinema-top">
          <ul className="cinema-services">{['AI voice agents', 'Connected CRM', 'Follow-up + bookings'].map((label, index) => <li key={label} data-reveal style={{'--reveal-delay': `${150 + index * 120}ms`} as CSSProperties}>{label}</li>)}</ul>
          <p data-reveal style={{'--reveal-delay': '300ms'} as CSSProperties} className="cinema-intro-copy">AI voice agents that answer enquiries, follow up, and book appointments while you're busy or away. Connected to your CRM—or delivered with one.</p>
        </div>
        <div className="cinema-bottom">
          <div className="cinema-heading"><p data-reveal style={{'--reveal-delay': '150ms'} as CSSProperties} className="glass-badge">Less chasing. Fewer interruptions.</p><h1 data-reveal style={{'--reveal-delay': '280ms'} as CSSProperties} id="hero-heading">Your working day<br/>should have an end.</h1></div>
          <div data-reveal style={{'--reveal-delay': '420ms'} as CSSProperties} className="cinema-contact"><p><strong>More of your evening back.</strong></p>{callToAction}</div>
        </div>
        <a className="cinema-scroll" href="#the-chasing">Scroll to see what comes next <ArrowDown size={15}/></a>
      </section>
    </div>
  </div>;
}
