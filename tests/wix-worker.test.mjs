import test from 'node:test';
import assert from 'node:assert/strict';
import { createSiteWorker } from '../deployment/wix-worker.mjs';
import { securityHeaders } from '../security-headers.ts';

const pages = Object.fromEntries(['index', 'voice-agents', 'automations', 'contact', 'privacy', 'terms'].map(name => [`/${name}.html`, `<!doctype html><title>${name}</title>`]));
const protections = securityHeaders();
const worker = createSiteWorker(pages, protections);

test('Wix worker serves exact built documents with all browser security headers', async () => {
  for (const [path, html] of Object.entries(pages)) {
    const response = await worker.fetch(new Request(`https://www.kuberiq.si${path}?source=qa`));
    assert.equal(response.status, 200);
    assert.equal(await response.text(), html);
    assert.equal(response.headers.get('content-type'), 'text/html; charset=utf-8');
    for (const [name, value] of Object.entries(protections)) assert.equal(response.headers.get(name), value);
  }
});

test('Wix worker supports the homepage and existing extensionless page aliases', async () => {
  for (const [path, expected] of [['/', '/index.html'], ['/index', '/index.html'], ['/voice-agents/', '/voice-agents.html'], ['/privacy', '/privacy.html']]) {
    assert.equal(await (await worker.fetch(new Request(`https://www.kuberiq.si${path}`))).text(), pages[expected]);
  }
});

test('Wix worker HEAD keeps GET headers without a response body', async () => {
  const response = await worker.fetch(new Request('https://www.kuberiq.si/', { method: 'HEAD' }));
  assert.equal(response.status, 200);
  assert.equal(await response.text(), '');
  assert.equal(response.headers.get('content-security-policy'), protections['Content-Security-Policy']);
});

test('unknown paths cannot select a page by a filename suffix or prototype property', async () => {
  for (const path of ['/missing', '/nested/contact.html', '/constructor', '/__proto__', '/private.env']) {
    const response = await worker.fetch(new Request(`https://www.kuberiq.si${path}`));
    assert.equal(response.status, 404);
    assert.equal(response.headers.get('x-frame-options'), 'DENY');
    assert.equal(response.headers.get('cache-control'), 'no-store');
  }
});

test('Wix worker rejects writes rather than returning a successful enquiry response', async () => {
  for (const method of ['POST', 'PUT', 'DELETE']) {
    const response = await worker.fetch(new Request('https://www.kuberiq.si/contact.html', { method }));
    assert.equal(response.status, 405);
    assert.equal(response.headers.get('allow'), 'GET, HEAD');
    assert.equal(response.headers.get('content-security-policy'), protections['Content-Security-Policy']);
  }
});
