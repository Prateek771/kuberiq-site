import test from 'node:test';
import assert from 'node:assert/strict';
import * as sequence from '../src/sequence.ts';

test('incomplete sequences interpolate ready neighbours without waiting for all downloads', () => {
  const frames = []; frames[0] = {}; frames[4] = {}; frames[8] = {};
  assert.deepEqual(sequence.availableFrameBlend?.(.25, 9, frames), {lower:0, upper:4, mix:.5});
  assert.deepEqual(sequence.availableFrameBlend?.(.75, 9, frames), {lower:4, upper:8, mix:.5});
  assert.deepEqual(sequence.availableFrameBlend?.(.25, 9, []), null);
});

test('partial sequences hold the closest endpoint and handle single frames', () => {
  const frames = []; frames[4] = {};
  assert.deepEqual(sequence.availableFrameBlend?.(0, 9, frames), {lower:4, upper:4, mix:0});
  assert.deepEqual(sequence.availableFrameBlend?.(1, 9, frames), {lower:4, upper:4, mix:0});
});

test('progressive loading prioritizes the current location and covers the full timeline early', () => {
  const order = sequence.previewLoadOrder?.(.5, 90) ?? [];
  assert.ok(order.slice(0,4).includes(44) && order.slice(0,4).includes(45));
  assert.ok(order.slice(0,22).includes(0) && order.slice(0,22).includes(89));
  assert.equal(order.length, 90);
  assert.equal(new Set(order).size, 90);
  assert.ok(order.every(i=>i>=0 && i<90));
});
