import test from 'node:test';
import assert from 'node:assert/strict';
import { progressWithin, coverRect, cacheFrameCount, scrubVideo, frameBlend, canvasResolution, detailResolution } from '../src/motion.ts';

test('scroll progress clamps at both ends and handles a non-scrollable page', () => {
  assert.equal(progressWithin(-20, 1000), 0);
  assert.equal(progressWithin(500, 1000), 0.5);
  assert.equal(progressWithin(1500, 1000), 1);
  assert.equal(progressWithin(10, 0), 0);
});

test('cover sizing fills a portrait viewport and centres the landscape frame', () => {
  const r = coverRect(1920, 1080, 400, 800);
  assert.equal(r.height, 800);
  assert.ok(r.width >= 400);
  assert.equal(r.x, (400-r.width)/2);
  assert.equal(r.y, 0);
});

test('canvas retains native source detail without allocating an upscaled retina buffer', () => {
  assert.deepEqual(canvasResolution(1440, 900, 2), { width: 1728, height: 1080 });
  assert.deepEqual(canvasResolution(390, 844, 3), { width: 499, height: 1080 });
  assert.deepEqual(canvasResolution(3840, 2160, 2), { width: 1920, height: 1080 });
  assert.deepEqual(canvasResolution(800, 600, 1), { width: 800, height: 600 });
});

test('detail decoding supplies covered device pixels without retaining an unnecessarily large bitmap', () => {
  assert.deepEqual(detailResolution(1280, 720), { width: 1280, height: 720 });
  assert.deepEqual(detailResolution(390, 468), { width: 832, height: 468 });
  assert.deepEqual(detailResolution(1728, 1080), { width: 1920, height: 1080 });
  assert.deepEqual(detailResolution(3840, 2160), { width: 1920, height: 1080 });
});

test('frame cache has a bounded memory budget, including long or invalid videos', () => {
  assert.equal(cacheFrameCount(3), 36);
  assert.equal(cacheFrameCount(60), 90);
  assert.equal(cacheFrameCount(0), 24);
  assert.equal(cacheFrameCount(Number.NaN), 24);
});

test('a pending video seek keeps the fallback active until the final scroll target is reached', () => {
  const video = { duration: 10, readyState: 1, seeking: true, currentTime: 1.19 };
  assert.equal(scrubVideo(video, 1), true);
  assert.equal(video.currentTime, 1.19);
  video.readyState = 2;
  video.seeking = false;
  assert.equal(scrubVideo(video, 1), true);
  assert.equal(video.currentTime, 9.95);
  assert.equal(scrubVideo(video, 1), false);
});

test('cached frames blend continuously and identically in either scroll direction', () => {
  assert.deepEqual(frameBlend(.5, 90), { lower: 44, upper: 45, mix: .5 });
  assert.deepEqual(frameBlend(-1, 90), { lower: 0, upper: 1, mix: 0 });
  assert.deepEqual(frameBlend(2, 90), { lower: 89, upper: 89, mix: 0 });
  assert.deepEqual(frameBlend(.5, 1), { lower: 0, upper: 0, mix: 0 });
  for (const p of [.24999,.25,.25001,.8,.25,0]) {
    const { lower, mix } = frameBlend(p, 90);
    assert.ok(Math.abs((lower + mix) / 89 - p) < 1e-10);
  }
});

