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
    const followHash = (hash: string, immediate = false) => {
      let id: string;
      try { id = decodeURIComponent(hash.slice(1)); } catch { return false; }
      const target = id ? document.getElementById(id) : null;
      if (id && !target) return false;
      const headerHeight = document.querySelector('header')?.getBoundingClientRect().height ?? 80;
      lenis.resize();
      // A numeric destination avoids adding Lenis's CSS scroll-margin/padding
      // offsets to our measured sticky-header allowance a second time.
      const destination = target ? target.getBoundingClientRect().top + window.scrollY - headerHeight - 24 : 0;
      lenis.scrollTo(destination, {
        immediate,
        onComplete: () => {
          const focusTarget = target ?? document.getElementById('hero-heading');
          if (focusTarget) {
            focusTarget.setAttribute('tabindex', '-1');
            focusTarget.focus({ preventScroll: true });
          }
        },
      });
      return true;
    };
    // Align after layout and native scroll restoration, including font settling.
    // Never pull someone back to an initial anchor after they start interacting.
    const initialHash = location.hash;
    let initialCancelled = false;
    let initialHashFrame = 0;
    const cancelInitialHash = () => { initialCancelled = true; cancelAnimationFrame(initialHashFrame); };
    const alignInitialHash = () => {
      if (!initialHash || initialCancelled || location.hash !== initialHash) return;
      cancelAnimationFrame(initialHashFrame);
      initialHashFrame = requestAnimationFrame(() => {
        initialHashFrame = requestAnimationFrame(() => {
          if (!initialCancelled && location.hash === initialHash) followHash(initialHash, true);
        });
      });
    };
    const interactionEvents = ['wheel', 'touchstart', 'pointerdown', 'keydown'] as const;
    interactionEvents.forEach(name => window.addEventListener(name, cancelInitialHash, { passive: true }));
    window.addEventListener('load', alignInitialHash, { once: true });
    window.addEventListener('pageshow', alignInitialHash);
    void document.fonts.ready.then(alignInitialHash);
    alignInitialHash();
    const restoreHash = () => { if (location.hash) followHash(location.hash, true); };
    window.addEventListener('popstate', restoreHash);
    // Handle our hash links once: cancel the browser jump and replace any active
    // wheel tween. This also covers href="#", which Lenis's anchor helper skips.
    const navigate = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href^="#"]') : null;
      if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
      const hash = link.getAttribute('href')!;
      if (!followHash(hash)) return;
      event.preventDefault();
      if (location.hash !== hash) history.pushState(null, '', hash);
    };
    document.addEventListener('click', navigate);
    return () => {
      cancelAnimationFrame(raf); cancelInitialHash();
      interactionEvents.forEach(name => window.removeEventListener(name, cancelInitialHash));
      window.removeEventListener('load', alignInitialHash);
      window.removeEventListener('pageshow', alignInitialHash);
      window.removeEventListener('popstate', restoreHash);
      document.removeEventListener('click', navigate); lenis.destroy();
    };
  }, []);
}
