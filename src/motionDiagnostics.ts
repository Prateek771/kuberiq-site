// Local QA only. Read the summary from the scene element; never collect visitor data.
export function startMotionDiagnostics() {
  if (!import.meta.env.DEV || !location.search.includes('motionQA')) return;
  let last = performance.now(), lastY = scrollY, moving = 0, delayed = 0, gaps: number[] = [];
  let total = 0, reportAt = last, detailFrames = 0, previewFrames = 0;
  const tick = (now: number) => {
    const scene = document.querySelector<HTMLElement>('.site-scene');
    if (scene && Math.abs(scrollY - lastY) > .1) {
      const viewport = scene.clientHeight;
      const range = document.documentElement.scrollHeight - viewport;
      const progress = range > 0 ? scrollY / range : 0;
      const desired = Math.round(Math.max(0, Math.min(1, progress))*(Number(scene.dataset.frameCount ?? 90)-1));
      const gap = Math.abs(desired - Number(scene.dataset.frame ?? 0));
      gaps.push(gap); moving++; if (now-last > 25) delayed++;
      if (scene.dataset.quality === 'native-detail') detailFrames++; else previewFrames++;
      total += now-last;
    }
    if (scene && now-reportAt > 250) {
      const sorted = [...gaps].sort((a,b)=>a-b);
      scene.dataset.qa = JSON.stringify({moving, delayed, detailFrames, previewFrames, meanFrameMs: moving ? +(total/moving).toFixed(1) : 0, p95FrameGap: sorted[Math.floor(sorted.length*.95)] ?? 0, maxFrameGap: sorted.at(-1) ?? 0, scrollY: Math.round(scrollY)});
      reportAt = now;
    }
    last = now; lastY = scrollY;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
