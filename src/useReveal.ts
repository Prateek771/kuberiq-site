import { useLayoutEffect } from 'react';

export function useReveal() {
  useLayoutEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    if (preference.matches || !('IntersectionObserver' in window)) return;
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal], .service-hero > *, .service-hero-bottom > *, .section-heading > *, .example-list article, .service-editorial > *, .fit-section > *, .approach-list article, .next-step .content-width > *, .footer-layout > *'));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px 64px 0px' });
    elements.forEach(element => {
      // Content above a restored scroll position is already readable; viewport content gets an entrance.
      if (element.getBoundingClientRect().bottom < 0) return;
      element.classList.add('reveal-ready');
      observer.observe(element);
    });
    const revealAll = () => elements.forEach(element => element.classList.add('is-visible'));
    const revealFocused = (event: FocusEvent) => {
      const target = event.target as Element;
      elements.filter(element => element.contains(target)).forEach(element => element.classList.add('is-visible'));
    };
    document.addEventListener('focusin', revealFocused);
    preference.addEventListener('change', revealAll);
    return () => { observer.disconnect(); preference.removeEventListener('change', revealAll); document.removeEventListener('focusin', revealFocused); };
  }, []);
}
