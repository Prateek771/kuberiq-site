import test from 'node:test';
import assert from 'node:assert/strict';
import { preview } from 'vite';

test('preview sends browser protections on pages and assets without blocking required media sources', async () => {
  const server = await preview({ preview: { host: '127.0.0.1', port: 0, strictPort: true } });
  try {
    const base = `http://127.0.0.1:${server.httpServer.address().port}`;
    for (const path of ['/', '/contact.html', '/privacy.html', '/terms.html', '/favicon.svg', '/social-card.png']) {
      const response = await fetch(base + path);
      assert.equal(response.status, 200);
      assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
      assert.equal(response.headers.get('x-frame-options'), 'DENY');
      assert.equal(response.headers.get('referrer-policy'), 'strict-origin-when-cross-origin');
      assert.match(response.headers.get('permissions-policy') ?? '', /camera=\(\)/);
      const csp = response.headers.get('content-security-policy') ?? '';
      assert.match(csp, /script-src 'self';/);
      assert.match(csp, /frame-ancestors 'none'/);
      assert.match(csp, /frame-src https:\/\/calendly\.com;/);
      assert.match(csp, /form-action 'none'/);
      assert.match(csp, /object-src 'none'/);
      assert.match(csp, /media-src 'self'/);
      assert.match(csp, /font-src 'self' https:\/\/fonts.gstatic.com/);
      await response.arrayBuffer();
    }
  } finally {
    await server.close();
  }
});
