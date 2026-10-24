export function pageForPath(pathname: string) {
  const path = pathname.replace(/\/$/, '').replace(/\.html$/, '');
  switch (path) {
    case '/voice-agents': return 'voice';
    case '/automations': return 'automations';
    case '/contact': return 'contact';
    case '/privacy': return 'privacy';
    case '/terms': return 'terms';
    default: return 'home';
  }
}
