import test from 'node:test';
import assert from 'node:assert/strict';
import { pageForPath } from '../src/routing.ts';

test('extensionless and trailing-slash routes select the same page as canonical links', () => {
  for (const [path, expected] of [['voice-agents', 'voice'], ['automations', 'automations'], ['contact', 'contact']]) {
    for (const suffix of ['.html', '', '/']) assert.equal(pageForPath(`/${path}${suffix}`), expected);
  }
});

test('unrecognized paths cannot select a page just by sharing a filename suffix', () => {
  for (const path of ['/', '/index.html', '/unknown', '/not-contact.html', '/nested/contact.html', '/contact%2f']) {
    assert.equal(pageForPath(path), 'home');
  }
});
