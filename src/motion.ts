export function progressWithin(position: number, range: number): number {
  return range > 0 && Number.isFinite(position) ? Math.max(0, Math.min(1, position / range)) : 0;
}

export function coverRect(sourceWidth: number, sourceHeight: number, width: number, height: number) {
  const scale = Math.max(width / sourceWidth, height / sourceHeight);
  const w = sourceWidth * scale;
  const h = sourceHeight * scale;
  return { x: (width-w)/2, y: (height-h)/2, width: w, height: h };
}

// Match device pixels up to the detail available in the covered 1080p source.
export function canvasResolution(width: number, height: number, pixelRatio: number) {
  const scale = Math.min(Math.max(1, pixelRatio), 1920 / Math.max(1, width), 1080 / Math.max(1, height));
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) };
}

export function cacheFrameCount(duration: number): number {
  return Number.isFinite(duration) ? Math.max(24, Math.min(90, Math.round(duration*12))) : 24;
}

export function scrubVideo(video: Pick<HTMLVideoElement, 'duration' | 'readyState' | 'seeking' | 'currentTime'>, progress: number): boolean {
  if (video.seeking) return true;
  if (video.readyState < 2 || !Number.isFinite(video.duration)) return false;
  const time = progressWithin(progress, 1) * Math.max(0, video.duration-0.05);
  if (Math.abs(video.currentTime-time) <= 0.04) return false;
  video.currentTime = time;
  return true;
}

export function frameBlend(progress: number, count: number) {
  const position = progressWithin(progress, 1) * Math.max(0, count - 1);
  const lower = Math.floor(position);
  return { lower, upper: Math.min(lower + 1, Math.max(0, count - 1)), mix: position - lower };
}
