import { useEffect, useRef } from 'react';
import { canvasResolution, coverRect, frameBlend, scrubVideo } from './motion';
import { FrameCache, availableFrameBlend, previewLoadOrder, pageSequenceProgress } from './sequence';
import { subscribeScrollFrame } from './scrollClock';

const FRAME_COUNT = 90;
const HD_FRAME_COUNT = 241;

export default function ScrollScene() {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const scene = root.current!, surface = canvas.current!, visible = video.current!;
    const context = surface.getContext('2d', { alpha: false });
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    let reduced = preference.matches, disposed = false, dirty = true;
    let lastProgress = -1, viewport = innerHeight, documentHeight = document.documentElement.scrollHeight;
    let frames: ImageBitmap[] = [], loading: AbortController | null = null;
    let previewSettled = false, lastMovement = 0, wasSettled = false;
    let hd: ReturnType<typeof createDetailCache> | null = null;
    const setMedia = (media: string) => { if (scene.dataset.media !== media) scene.dataset.media = media; };

    function createDetailCache() {
      const controller = new AbortController();
      const active = new Set<number>(), failed = new Set<number>();
      let wanted: number[] = [];
      // Keep two detail pairs (~32 MiB), and fetch only the settled position.
      // The smooth preview sequence handles movement without HD decode churn.
      const cache = new FrameCache<ImageBitmap>(4, async index => {
        const response = await fetch('/frames-hd/frame-' + String(index).padStart(3, '0') + '.webp', { signal: controller.signal });
        if (!response.ok) throw new Error('Detail frame unavailable');
        return createImageBitmap(await response.blob());
      });
      function pump() {
        if (controller.signal.aborted || document.hidden) return;
        for (const index of wanted) {
          if (active.size >= 2) break;
          if (active.has(index) || failed.has(index) || cache.peek(index)) continue;
          active.add(index);
          void cache.get(index).then(frame => {
            if (!frame) failed.add(index);
            if (!controller.signal.aborted && frame) dirty = true;
          }).finally(() => { active.delete(index); pump(); });
        }
      }
      return {
        cache,
        request(progress: number | null) {
          const pair = progress === null ? null : frameBlend(progress, HD_FRAME_COUNT);
          wanted = pair ? [...new Set([pair.lower, pair.upper])] : [];
          pump();
        },
        dispose() { controller.abort(); cache.dispose(); },
      };
    }

    function clearCache() {
      loading?.abort(); loading = null;
      hd?.dispose(); hd = null;
      frames.forEach(frame => frame.close()); frames = [];
      previewSettled = false;
      scene.dataset.cachedFrames = '0';
      lastProgress = -1; dirty = true;
    }

    // Original-video frames are exported ahead of time, not decoded by seeking
    // a video on the visitor's main thread. Retain all frames for instant reversal.
    async function loadFrames() {
      if (disposed || reduced || !context || !('createImageBitmap' in window)) return;
      const controller = new AbortController(); loading = controller;
      const directory = matchMedia('(max-width: 767px)').matches ? 'frames-scroll-mobile' : 'frames-scroll';
      const requested = new Set<number>();
      let completed = 0;
      const worker = async () => {
        while (requested.size < FRAME_COUNT && !controller.signal.aborted) {
          const progress = pageSequenceProgress(scrollY, viewport, documentHeight);
          const index = previewLoadOrder(progress, FRAME_COUNT).find(index => !requested.has(index))!;
          requested.add(index);
          try {
            const response = await fetch('/' + directory + '/frame-' + String(index).padStart(3, '0') + '.webp', { signal: controller.signal });
            if (!response.ok) throw new Error('Frame unavailable');
            const bitmap = await createImageBitmap(await response.blob());
            if (controller.signal.aborted) { bitmap.close(); return; }
            frames[index] = bitmap;
            scene.dataset.cachedFrames = String(++completed);
            scene.dataset.cacheWidth = String(bitmap.width);
            dirty = true;
          } catch {
            // One unavailable frame must not discard the other decoded frames.
            if (controller.signal.aborted) return;
          }
        }
      };
      try {
        await Promise.all(Array.from({ length: 4 }, () => worker()));
        if (controller.signal.aborted || disposed || reduced) return;
        previewSettled = true;
        scene.dataset.frameCount = String(FRAME_COUNT);
        scene.dataset.cacheStatus = completed === FRAME_COUNT ? 'complete' : 'partial';
        if (!completed) {
          hd?.dispose(); hd = null;
          startVideoFallback();
        }
        dirty = true;
      } finally {
        if (loading === controller) loading = null;
      }
    }

    function tick(position: number, time: number) {
      if (disposed || document.hidden || reduced) return;
      const progress = pageSequenceProgress(position, viewport, documentHeight);
      // Lenis already eased this position. A second lerp would make artwork lag.
      const moved = Math.abs(progress - lastProgress) >= .000001;
      if (moved) lastMovement = time;
      const settled = time - lastMovement >= 160;
      if (settled !== wasSettled) dirty = true;
      wasSettled = settled;
      hd?.request(settled && previewSettled ? progress : null);
      if (!dirty && !moved) return;
      scene.dataset.targetProgress = scene.dataset.progress = progress.toFixed(5);
      const detail = frameBlend(progress, HD_FRAME_COUNT);
      const detailFirst = settled ? hd?.cache.peek(detail.lower) : undefined;
      const detailSecond = settled ? (detail.mix > .001 ? hd?.cache.peek(detail.upper) : detailFirst) : undefined;
      const preview = availableFrameBlend(progress, FRAME_COUNT, frames);
      if ((preview || (detailFirst && detailSecond)) && context) {
        const highResolution = Boolean(detailFirst && detailSecond);
        const { lower, upper, mix } = highResolution ? detail : preview!;
        const first = highResolution ? detailFirst! : frames[lower];
        const second = highResolution ? detailSecond! : frames[upper];
        const rect = coverRect(first.width, first.height, surface.width, surface.height);
        context.globalAlpha = 1;
        context.drawImage(first, rect.x, rect.y, rect.width, rect.height);
        if (mix > .001 && upper !== lower) {
          context.globalAlpha = mix;
          context.drawImage(second, rect.x, rect.y, rect.width, rect.height);
          context.globalAlpha = 1;
        }
        scene.dataset.frame = String(Math.round(progress * (FRAME_COUNT - 1)));
        scene.dataset.renderWidth = String(first.width);
        scene.dataset.quality = highResolution ? '1080p' : 'preview';
        setMedia('canvas');
        dirty = false;
      } else {
        // Keep revisiting an outstanding seek even when scrolling has stopped.
        dirty = scrubVideo(visible, progress);
      }
      lastProgress = progress;
    }

    function resize() {
      viewport = innerHeight; documentHeight = document.documentElement.scrollHeight;
      const { width, height } = canvasResolution(surface.clientWidth, surface.clientHeight, devicePixelRatio);
      if (surface.width !== width || surface.height !== height) {
        surface.width = width; surface.height = height;
      }
      dirty = true;
    }
    function start() {
      if (reduced || disposed) return;
      if (context && 'createImageBitmap' in window) {
        hd = createDetailCache();
        void loadFrames();
      } else startVideoFallback();
    }
    function startVideoFallback() {
      if (reduced || disposed || visible.getAttribute('src')) return;
      scene.dataset.cacheStatus = 'fallback';
      visible.preload = 'auto';
      visible.src = '/hero.mp4'; visible.load();
    }
    const ready = () => { if (!reduced && !disposed && !frames.length && scene.dataset.media !== 'canvas') { setMedia('video'); dirty = true; } };
    const error = () => {
      if (reduced || disposed || frames.length || scene.dataset.media === 'canvas') return;
      setMedia('poster');
    };
    const changePreference = () => {
      reduced = preference.matches;
      clearCache(); setMedia('poster');
      visible.removeAttribute('src'); visible.load();
      if (!reduced) start();
    };
    const wake = () => { dirty = true; };
    visible.addEventListener('loadeddata', ready); visible.addEventListener('error', error);
    visible.addEventListener('seeked', wake); visible.addEventListener('canplay', wake);
    preference.addEventListener('change', changePreference);
    const unsubscribe = subscribeScrollFrame(tick);
    const observer = new ResizeObserver(resize);
    observer.observe(surface); observer.observe(document.body);
    window.addEventListener('pageshow', resize);
    document.addEventListener('visibilitychange', wake);
    setMedia('poster'); resize(); start();
    return () => {
      disposed = true; clearCache(); unsubscribe(); observer.disconnect();
      window.removeEventListener('pageshow', resize);
      document.removeEventListener('visibilitychange', wake);
      preference.removeEventListener('change', changePreference);
      visible.removeEventListener('loadeddata', ready); visible.removeEventListener('error', error);
      visible.removeEventListener('seeked', wake); visible.removeEventListener('canplay', wake);
      visible.removeAttribute('src'); visible.load();
    };
  }, []);
  return <div ref={root} className="scene-track site-scene" aria-hidden="true">
    <img className="scene-poster" src="/hero-poster.jpg" alt="" fetchPriority="high" />
    <video ref={video} className="scene-video" muted playsInline preload="none" tabIndex={-1} />
    <canvas ref={canvas} className="scene-canvas" />
  </div>;
}

