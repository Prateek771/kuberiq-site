import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { renderScrollFrame } from './scrollClock';

export function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: false,
      lerp: .1,
      wheelMultiplier: 1,
      // Ease content and artwork together once, in this shared animation loop.
      smoothWheel: true,
      syncTouch: false,
      anchors: false,
      stopInertiaOnNavigate: true,
      respectReducedMotion: true,
      prevent: node => node.tagName === 'TEXTAREA' || node.tagName === 'SELECT',
    });
    // Scroll first, then paint the scene in the same animation frame.
    let raf = 0;
    const tick = (time: number) => {
      lenis.raf(time);
      renderScrollFrame(window.scrollY, time);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    // Handle our hash links once: cancel the browser jump and replace any active
    // wheel tween. This also covers href="#", which Lenis's anchor helper skips.
    const navigate = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href^="#"]') : null;
      if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
      const hash = link.getAttribute('href')!;
      const target = hash === '#' ? null : document.getElementById(decodeURIComponent(hash.slice(1)));
      if (hash !== '#' && !target) return;
      event.preventDefault();
      if (location.hash !== hash) history.pushState(null, '', hash);
      lenis.scrollTo(target ?? 0, {
        onComplete: () => {
          const focusTarget = target ?? document.getElementById('hero-heading');
          if (focusTarget) {
            focusTarget.setAttribute('tabindex', '-1');
            focusTarget.focus({ preventScroll: true });
          }
        },
      });
    };
    document.addEventListener('click', navigate);
    return () => { cancelAnimationFrame(raf); document.removeEventListener('click', navigate); lenis.destroy(); };
  }, []);
}
