import test from 'node:test';
import assert from 'node:assert/strict';
import { pageSequenceProgress, FrameCache, frameWindow } from '../src/sequence.ts';

test('animation follows the complete document linearly and finishes at the footer', () => {
  assert.equal(pageSequenceProgress(0, 1000, 10000), 0);
  assert.equal(pageSequenceProgress(2000, 1000, 10000), 2/9);
  assert.equal(pageSequenceProgress(4500, 1000, 10000), .5);
  assert.equal(pageSequenceProgress(6000, 1000, 10000), 2/3);
  assert.equal(pageSequenceProgress(9000, 1000, 10000), 1);
  assert.equal(pageSequenceProgress(12000, 1000, 10000), 1);
  assert.equal(pageSequenceProgress(-100, 1000, 10000), 0);
});

test('timeline reverses, adapts to expanded content, and handles short documents', () => {
  for (const height of [667, 844, 1080]) {
    assert.equal(pageSequenceProgress(height * 2, height, height * 10), 2/9);
  }
  const positions = [0, 800, 1600, 4000, 9000];
  const forward = positions.map(y => pageSequenceProgress(y, 1000, 10000));
  assert.deepEqual([...positions].reverse().map(y => pageSequenceProgress(y, 1000, 10000)), [...forward].reverse());
  assert.ok(pageSequenceProgress(5000, 1000, 12000) < pageSequenceProgress(5000, 1000, 10000));
  assert.equal(pageSequenceProgress(0, 1000, 1000), 0);
  assert.equal(pageSequenceProgress(500, 1000, 1500), 1);
});

test('frame cache coalesces requests and releases the least recently used bitmap', async () => {
  const loads = [], closed = [];
  const cache = new FrameCache(2, async index => { loads.push(index); return { close: () => closed.push(index) }; });
  await Promise.all([cache.get(0), cache.get(0)]);
  await cache.get(1);
  await cache.get(0);
  await cache.get(2);
  assert.deepEqual(loads, [0,1,2]);
  assert.deepEqual(closed, [1]);
  cache.dispose();
  assert.deepEqual(closed, [1,0,2]);
});

test('dispose closes in-flight frames and failed loads can be retried', async () => {
  let finish, closed = 0;
  const cache = new FrameCache(2, () => new Promise(resolve => { finish = resolve; }));
  const pending = cache.get(0);
  cache.dispose();
  finish({ close: () => closed++ });
  assert.equal(await pending, null);
  assert.equal(closed, 1);
  let attempts = 0;
  const retry = new FrameCache(2, async () => { if (++attempts === 1) throw Error('network'); return { close() {} }; });
  assert.equal(await retry.get(1), null);
  assert.ok(await retry.get(1));
  retry.dispose();
});

test('frame window prioritizes the target and both interpolation neighbours on reversal', () => {
  assert.deepEqual(frameWindow(20.6, 1, 241).slice(0,3), [21,20,22]);
  assert.deepEqual(frameWindow(20.6, -1, 241).slice(0,3), [21,20,22]);
  assert.ok(frameWindow(20.6,-1,241).indexOf(17) < frameWindow(20.6,-1,241).indexOf(25));
  for (const frame of [-20,0,239.8,300]) {
    const window = frameWindow(frame,1,241);
    assert.equal(window.length,new Set(window).size);
    assert.ok(window.every(i=>i>=0 && i<241));
  }
});

test('ready frames can be painted synchronously without triggering a decode', async () => {
  let loads = 0;
  const cache = new FrameCache(3, async index => ({index, close() {}, load: ++loads}));
  assert.equal(cache.peek(1), undefined);
  await cache.get(1);
  assert.equal(cache.peek(1)?.index, 1);
  assert.equal(loads, 1);
  cache.dispose();
  assert.equal(cache.peek(1), undefined);
});
