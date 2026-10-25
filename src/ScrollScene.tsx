import { useEffect, useRef } from 'react';
import { canvasResolution, coverRect, detailResolution, frameBlend, scrubVideo } from './motion';
import { FrameCache, availableFrameBlend, detailLoadOrder, previewLoadOrder, pageSequenceProgress } from './sequence';
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
    const mobileFrames = matchMedia('(max-width: 767px)');
    let reduced = preference.matches, disposed = false, dirty = true;
    let mobile = mobileFrames.matches;
    let lastProgress = -1, viewport = innerHeight, documentHeight = document.documentElement.scrollHeight;
    let frames: ImageBitmap[] = [], loading: AbortController | null = null;
    let previewSettled = false, travelDirection = 1;
    let hd: ReturnType<typeof createDetailCache> | null = null;
    const setMedia = (media: string) => { if (scene.dataset.media !== media) scene.dataset.media = media; };

    function createDetailCache() {
      const controller = new AbortController();
      const active = new Set<number>(), failed = new Set<number>();
      let wanted: number[] = [];
      // Bound native detail to ~95 MiB desktop / ~63 MiB mobile. The complete
      // preview remains available, so missing detail never delays the timeline.
      const limit = matchMedia('(max-width: 767px)').matches ? 8 : 12;
      const size = detailResolution(surface.width, surface.height);
      scene.dataset.detailLimit = String(limit);
      scene.dataset.detailDecodeWidth = String(size.width);
      const cache = new FrameCache<ImageBitmap>(limit, async index => {
        const response = await fetch('/frames-hd/frame-' + String(index).padStart(3, '0') + '.webp', { signal: controller.signal });
        if (!response.ok) throw new Error('Detail frame unavailable');
        return createImageBitmap(await response.blob(), { resizeWidth: size.width, resizeHeight: size.height, resizeQuality: 'high' });
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
        width: size.width,
        request(progress: number | null, direction: number) {
          wanted = progress === null ? [] : detailLoadOrder(progress, direction, HD_FRAME_COUNT, limit);
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

    function tick(position: number) {
      if (disposed || document.hidden || reduced) return;
      const progress = pageSequenceProgress(position, viewport, documentHeight);
      // Lenis already eased this position. A second lerp would make artwork lag.
      const moved = Math.abs(progress - lastProgress) >= .000001;
      if (moved && lastProgress >= 0) travelDirection = progress > lastProgress ? 1 : -1;
      hd?.request(previewSettled ? progress : null, travelDirection);
      if (!dirty && !moved) return;
      scene.dataset.targetProgress = scene.dataset.progress = progress.toFixed(5);
      const detail = frameBlend(progress, HD_FRAME_COUNT);
      const detailFirst = hd?.cache.peek(detail.lower);
      const detailSecond = detail.mix > .001 ? hd?.cache.peek(detail.upper) : detailFirst;
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
        // Report the actual picture, including a held endpoint during loading.
        // A target-derived value would conceal gaps in the available sequence.
        const renderedProgress = (lower + (upper - lower) * mix) / ((highResolution ? HD_FRAME_COUNT : FRAME_COUNT) - 1);
        scene.dataset.frame = String(Math.round(renderedProgress * (FRAME_COUNT - 1)));
        scene.dataset.renderWidth = String(first.width);
        scene.dataset.quality = highResolution ? 'native-detail' : 'preview';
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
      if (context) {
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';
      }
      if (hd && hd.width !== detailResolution(surface.width, surface.height).width) {
        hd.dispose(); hd = createDetailCache();
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
    const changeFrameSet = () => {
      if (mobileFrames.matches === mobile) return;
      mobile = mobileFrames.matches;
      clearCache();
      if (!reduced) start();
    };
    preference.addEventListener('change', changePreference);
    mobileFrames.addEventListener('change', changeFrameSet);
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
      mobileFrames.removeEventListener('change', changeFrameSet);
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

