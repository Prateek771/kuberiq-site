export function pageForPath(pathname: string) {
  const path = pathname.replace(/\/$/, '').replace(/\.html$/, '');
  switch (path) {
    case '/voice-agents': return 'voice';
    case '/automations': return 'automations';
    case '/contact': return 'contact';
    default: return 'home';
  }
}
