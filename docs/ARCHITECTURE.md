# KuberIQ — Architecture

## Application structure

KuberIQ is a client-rendered React and TypeScript site built with Vite. Six HTML entry points share the application bundle. `App.tsx` selects the page from the pathname; there is no client-side routing dependency or application server in this project.

| Area | Source | Responsibility |
| --- | --- | --- |
| Entry and styles | `src/main.tsx` | Mount React, load the stylesheet layers and initialize optional motion diagnostics |
| Shared application | `src/App.tsx` | Header, navigation, page selection, service sections, contact composition and footer |
| Home introduction | `src/OpeningSequence.tsx` | Introductory composition and primary call to action |
| Reusable page sections | `src/ServicePages.tsx` | Page heroes and automation scope |
| Content data | `src/content.ts` | Capabilities, delivery stages and FAQ copy |
| Presentation sections | `src/Presentation.tsx`, `src/presentation.css` | Workflow example, delivery, vision, booking, email contact and legal pages |
| Booking configuration | `src/booking.ts` | Owner-approved Calendly destination and two enquiry addresses |
| Scene renderer | `src/ScrollScene.tsx` | Preview loading, detail cache, canvas painting, fallback media and lifecycle cleanup |
| Scroll coordination | `src/useSmoothScroll.ts`, `src/scrollClock.ts` | Shared frame loop and anchor navigation |
| Motion helpers | `src/motion.ts`, `src/sequence.ts` | Progress, image sizing, frame blending, progressive ordering and cache behavior |
| Content entrances | `src/useReveal.ts` | Intersection and focus-driven entrance state |
| Final visual overrides | `src/brand.css` | Current palette, reading surfaces, responsive adjustments and motion preferences |

The dependency set includes React, React DOM, Lenis and Lucide icons. Vite uses the React and Tailwind plugins; the interface's current styling is primarily expressed in the repository's CSS files. The lockfile is the reproducible dependency record for the pinned direct dependencies.

## Rendering and style layers

`main.tsx` loads `styles.css`, `refinements.css`, `cinema.css`, `services.css` `brand.css` and then `presentation.css`. Later rules refine the earlier visual treatments. The final pale blue-grey and dark teal declarations near the end of `brand.css` determine the current panel, text, action and field colors.

The decorative scene is fixed behind the document, ignores pointer input and is hidden from assistive technology. Ordinary content remains in document flow above it. The header is fixed; the cinematic home introduction and capability section use viewport-based minimum heights, with an 80vh spacer between them.

The final reading panels are opaque. They do not use backdrop blur, and main content avoids soft text shadows. This gives forms and paragraphs a consistent surface independent of the frame behind them.

## One scroll position, one animation loop

`useSmoothScroll` creates Lenis with `smoothWheel: true` and `lerp: .1`. Touch synchronization is disabled, leaving touch scrolling native. Lenis respects reduced-motion preferences and does not intercept scrolling inside textarea or select controls.

Each animation frame first updates Lenis, then publishes `window.scrollY` through the shared scroll clock. The scene maps that position to:

```text
progress = clamp(scrollY / (documentHeight - viewportHeight), 0, 1)
```

Short documents resolve to zero progress. There is no additional scene easing. Scrolling backward therefore moves the same timeline backward rather than starting a separate animation. `ResizeObserver` updates the scroll range and canvas dimensions when the content or viewport changes.

Same-page hash navigation cancels the browser's immediate jump and uses Lenis scrolling. After arrival, the target receives focus without another scroll jump.

## Progressive preview sequence

The main path uses 90 pre-exported WebP frames:

- `public/frames-scroll/`: desktop preview frames, 960px wide.
- `public/frames-scroll-mobile/`: mobile preview frames, 480px wide, selected below 768px when loading starts.

Four asynchronous workers fetch and decode frames with `createImageBitmap`. Before selecting each request, loading order considers the current page position. It prioritizes nearby frames, both timeline endpoints and a coarse spread across the timeline before filling the remaining gaps.

Decoded images become usable immediately. `availableFrameBlend` finds available frames around the requested position and interpolates between them. If only one useful endpoint is available, it holds that frame. A failed individual request does not discard successfully decoded images.

All successfully loaded preview frames remain cached until cleanup. Once complete, forward and reverse movement can use the same images without requesting them again. A partially loaded cache may interpolate across larger frame gaps, so its appearance can be less precise than the complete sequence.

## Native-detail refinement

The source also includes a 241-frame, 1920×1080 detail sequence in `public/frames-hd/`. It is not all decoded at startup.

Once the progressive preview requests finish, the renderer requests the native pair for the current position and nearby frames in the direction of travel. The detail cache retains at most 12 images on desktop or 8 on mobile, with at most two active requests. Both interpolation frames are prioritized before look-ahead frames, including after a direction reversal.

Native source images are decoded to the device-pixel resolution needed to cover the canvas, capped at the original 1920x1080 source. High-quality bitmap resizing and canvas resampling avoid unnecessary oversized uploads. At a 1280x720 canvas, twelve decoded detail images are approximately 42 MiB; the full-source worst case is approximately 95 MiB desktop or 63 MiB mobile, excluding the preview cache, in-flight images and browser/GPU overhead. A viewport resolution change rebuilds only the detail cache.

The renderer uses native detail during movement as soon as the exact pair is ready. Otherwise, it draws the available preview at the current progress; it never holds an old detail frame waiting for a download. The cost is more detail requests during scrolling. Slow networks may show preview quality until native frames arrive; no resolution is synthesized beyond the source.

`FrameCache` coalesces duplicate requests, releases evicted images and closes images that finish loading after disposal. The component also aborts pending fetches during cleanup and when motion preferences change.

## Canvas and media recovery

The canvas uses a non-alpha 2D context. It draws a centrally cropped cover image and alpha-blends the second frame when needed. Canvas dimensions follow device pixel ratio only within the source-resolution bounds calculated by `canvasResolution`; high-density displays do not trigger unlimited enlargement.

The renderer skips painting when progress, dimensions and resource readiness are unchanged. Hidden documents skip scene ticks. Visibility and page lifecycle events mark the scene for refresh.

`hero-poster.jpg` is the initial image. Normal sequence loading does not download the fallback video. If canvas decoding is unavailable or no preview frames load, the component loads `hero.mp4` on demand and seeks it according to scroll progress. If that fails, the poster remains. The video is muted and inline, with no autoplay or loop. The scene preserves the approved media-layer styling.

## Content motion and accessibility

The entrance system observes content at a 0.05 intersection threshold with a 64px bottom margin. Elements move from 12px below their final position over 350ms; their opacity remains 1. Content is therefore readable before the entrance finishes. Entrances run once, and keyboard focus reveals containing content immediately.

Reduced motion prevents scene loading, retains the poster and removes entrance transitions. Preference changes release animation resources. Other implemented access features include a skip link, semantic navigation, current-page indication, visible focus outlines, an expandable mobile menu with Escape handling, native FAQ disclosure elements, a directly visible calendar with a descriptive iframe title, and direct email alternatives.

These features describe implementation, not a comprehensive accessibility certification. Keyboard, assistive-technology, zoom and device testing remain separate acceptance activities.

## Scheduling and contact boundary

There is no enquiry endpoint, database, authentication flow, or operational CRM connection in this frontend. `booking.ts` centralizes the approved Calendly link and two business email addresses.

`BookingSection` places the meeting introduction on the left and the directly visible Calendly iframe on the right. Below 1000px they stack vertically. Native `loading="lazy"` defers the provider request until the booking area approaches the viewport. No extra disclosure click is required. A direct external booking link is always available. CSP allows only the Calendly frame origin while retaining existing script, object, framing, and form restrictions. Email links open the visitor's mail application; the site does not submit a message or display a false delivery confirmation.

Dedicated privacy and terms pages explain these boundaries. Open Graph metadata points to a locally generated 1200x630 branded card. The six pages and current assets were verified on the Wix production URL on 25 October 2026; header verification is recorded in `SECURITY-REVIEW.md`.

Wix intercepts `/sitemap.xml` on this deployment. The identical six-URL sitemap is available at `/sitemap-index.xml`, the non-reserved naming pattern recommended by Wix, and the source `robots.txt` points to it. The standard filename is retained for other static hosts. Wix serves its own crawler file: its Robots TXT API was updated and independently read back with the new sitemap directive while retaining its existing rules. A subsequent public read on 25 October 2026 verified that the new directive has propagated and the six-URL sitemap returns HTTP 200. Search indexing itself remains unverified.

Anchor navigation resolves the initial URL hash after React mounts and measures the sticky header once. A numeric Lenis destination prevents CSS scroll-margin and scroll-padding from being counted again. Popstate navigation also restores hash targets.

## Build and tests

```sh
npm ci
npm run dev
npm test
npm run build
```

The build runs TypeScript project checking before Vite generates the six-page static output in `dist/`. The test command uses Node's built-in test runner. Test files exercise progress clamping, forward/reverse mapping, cover and canvas sizing, frame interpolation, progressive loading order, partial sequences, seek completion and cache lifecycle behavior.

For Wix, `npm run build:wix` also packages `dist-wix/client` and `dist-wix/server`. `deployment/wix-worker.mjs` serves only the six exact generated HTML documents and their existing extensionless aliases, using `securityHeaders()` for every page/error response. It has no database, credentials, remote proxy, or form endpoint. Scripts, styles, images, video, and frame sequences remain static. The server output contains only JavaScript modules, using the entry aliases produced by Wix's official hosting adapter. The source `wix.config.json` retains the existing site/app identity and points to the two output directories. A Wix preview must verify HTML routing and static assets before release; a working `_headers` file on a local preview is insufficient.

Run tests and browser acceptance checks against the same revision. Unit tests verify deterministic calculations and resource rules; they do not measure frame rate, network behavior or visual quality. Review cold loading, rapid scroll reversal, expanded content, reduced motion, fallback media and mobile navigation separately in the browser.

## Maintenance considerations

- Changing page length changes the whole-document timing of the scene; review both the content and transformation after major copy changes.
- Preview resolution is chosen when loading starts. Resizing changes canvas dimensions but does not automatically replace that preview set.
- Higher-resolution exports increase transfer and decoded-memory costs; retain bounded detail loading unless measurements justify a different approach.
- A cache hit and a downloaded asset are different from a smooth rendered frame. Evaluate performance on representative devices and network conditions.
- Keep new styling aligned with the final override layer, or consolidate the stylesheet history deliberately to avoid conflicting declarations.
- Keep illustrative workflows, marketing claims and verified integration behavior distinct when extending the site.
