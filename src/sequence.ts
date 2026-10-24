import { frameBlend, progressWithin } from './motion.ts';

// Map the complete document evenly to the video, as in the recreation brief.
export function pageSequenceProgress(offset: number, viewportHeight: number, documentHeight: number) {
  return progressWithin(offset, Math.max(0, documentHeight - viewportHeight));
}

// A partial download is already useful. Interpolate only decoded frames and
// clamp to the nearest available endpoint instead of restarting the timeline.
export function availableFrameBlend(progress: number, count: number, frames: readonly unknown[]) {
  const position = progressWithin(progress, 1) * Math.max(0, count - 1);
  let lower = -1, upper = -1;
  for (let index = 0; index < count; index++) {
    if (!frames[index]) continue;
    if (index <= position) lower = index;
    if (index >= position) { upper = index; break; }
  }
  if (lower < 0) lower = upper;
  if (upper < 0) upper = lower;
  if (lower < 0) return null;
  return { lower, upper, mix: lower === upper ? 0 : (position - lower) / (upper - lower) };
}

export function previewLoadOrder(progress: number, count: number) {
  const center = Math.floor(progressWithin(progress, 1) * Math.max(0, count - 1));
  const order = [center, center+1, center-1, center+2, 0, count-1];
  // Cover the whole timeline early, then fill the gaps for smooth reversal.
  for (let index = 0; index < count; index += 6) order.push(index);
  for (let index = 0; index < count; index++) order.push(index);
  return [...new Set(order)].filter(index => index >= 0 && index < count);
}

export function frameWindow(position: number, direction: number, count: number) {
  const center = Math.max(0, Math.min(count-1, Math.round(position)));
  const order = [center, center-1, center+1];
  for (let distance = 2; distance <= 6; distance++) {
    order.push(center + distance * (direction < 0 ? -1 : 1));
    order.push(center - distance * (direction < 0 ? -1 : 1));
  }
  return [...new Set(order)].filter(index => index >= 0 && index < count);
}

// Always load the two frames for the current position before looking ahead.
// Keep the request window no larger than the decoded bitmap cache.
export function detailLoadOrder(progress: number, direction: number, count: number, limit: number) {
  const pair = frameBlend(progress, count);
  return [...new Set([pair.lower, pair.upper, ...frameWindow(progressWithin(progress, 1) * (count - 1), direction, count)])].slice(0, limit);
}

export class FrameCache<T extends { close(): void }> {
  private frames = new Map<number, T>();
  private pending = new Map<number, Promise<T | null>>();
  private disposed = false;
  private limit: number;
  private load: (index: number) => Promise<T>;
  constructor(limit: number, load: (index: number) => Promise<T>) { this.limit = limit; this.load = load; }

  peek(index: number): T | undefined {
    const hit = this.frames.get(index);
    if (hit) { this.frames.delete(index); this.frames.set(index, hit); }
    return hit;
  }

  get(index: number): Promise<T | null> {
    if (this.disposed) return Promise.resolve(null);
    const hit = this.frames.get(index);
    if (hit) {
      this.frames.delete(index);
      this.frames.set(index, hit);
      return Promise.resolve(hit);
    }
    const pending = this.pending.get(index);
    if (pending) return pending;
    const request = this.load(index).then(frame => {
      if (this.disposed) { frame.close(); return null; }
      this.frames.set(index, frame);
      while (this.frames.size > this.limit) {
        const oldest = this.frames.keys().next().value!;
        this.frames.get(oldest)!.close();
        this.frames.delete(oldest);
      }
      return frame;
    }).catch(() => null).finally(() => this.pending.delete(index));
    this.pending.set(index, request);
    return request;
  }

  dispose() {
    this.disposed = true;
    this.frames.forEach(frame => frame.close());
    this.frames.clear();
  }
}
