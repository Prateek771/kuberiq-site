// Wix serves static assets separately; only generated HTML lives in this worker.
export function createSiteWorker(pages, protections) {
  return {
    async fetch(request) {
      const headers = new Headers(protections);
      headers.set('Content-Type', 'text/html; charset=utf-8');
      headers.set('Cache-Control', 'no-store');
      const respond = (body, status) => new Response(request.method === 'HEAD' ? null : body, { status, headers });

      if (request.method !== 'GET' && request.method !== 'HEAD') {
        headers.set('Allow', 'GET, HEAD');
        return respond('Method not allowed', 405);
      }

      let path = new URL(request.url).pathname.replace(/\/+$/, '') || '/';
      if (path === '/') path = '/index.html';
      else if (!path.endsWith('.html')) path += '.html';
      if (!Object.hasOwn(pages, path)) return respond('Page not found', 404);

      headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
      return respond(pages[path], 200);
    },
  };
}
