import test from 'node:test';
import assert from 'node:assert/strict';
import { securityHeaders } from '../security-headers.ts';

test('only the approved scheduling origin can be embedded, with other browser protections retained', () => {
  for (const development of [false, true]) {
    const headers = securityHeaders(development);
    const directives = Object.fromEntries(headers['Content-Security-Policy'].split(';').filter(Boolean).map(d => {
      const [key, ...values] = d.trim().split(/\s+/);
      return [key, values];
    }));
    assert.deepEqual(directives['frame-src'], ['https://calendly.com']);
    assert.deepEqual(directives['frame-ancestors'], ["'none'"]);
    assert.deepEqual(directives['form-action'], ["'none'"]);
    assert.deepEqual(directives['object-src'], ["'none'"]);
    assert.equal(headers['X-Frame-Options'], 'DENY');
  }
});
